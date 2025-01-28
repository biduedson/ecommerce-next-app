"use server"; // Indica que esta função será executada no lado do servidor.

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"; // Gerencia sessões de autenticação no servidor.
import { redirect } from "next/navigation"; // Redireciona usuários para outras rotas no Next.js.
import { parseWithZod } from "@conform-to/zod"; // Valida formulários com o Zod.
import { bannerSchema, productSchema } from "./lib/zodSchemas"; // Esquema de validação para os dados do produto.
import prisma from "./lib/db"; // Instância do Prisma ORM para interagir com o banco de dados.
import { Schema } from "zod";
import { redis } from "./lib/redis";
import { Cart } from "./lib/interfaces";
import { revalidatePath } from "next/cache";
import { Redis } from "@upstash/redis";
import { stripe } from "./lib/stripe";
import Stripe from "stripe";

// Define a server action para criar um produto.
export async function createProduct(prevState: unknown, formData: FormData) {
  // Obtém a sessão do servidor para verificar se o usuário está autenticado.
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Verifica se o usuário está autenticado e tem permissão para criar produtos.
  if (!user || user.email !== "biduzao.bidu21@gmail.com") {
    return redirect("/"); // Redireciona para a página inicial se não estiver autorizado.
  }

  // Valida os dados enviados pelo formulário usando o esquema definido.
  const submission = parseWithZod(formData, {
    schema: productSchema,
  });

  // Se os dados forem inválidos, retorna uma resposta indicando os erros.
  if (submission.status !== "success") {
    return submission.reply(); // Retorna mensagens de erro para o cliente.
  }

  // Processa as URLs das imagens enviadas no formulário, separando-as por vírgulas.
  const flattenUrls = submission.value.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  // Cria um novo produto no banco de dados usando o Prisma.
  await prisma.product.create({
    data: {
      name: submission.value.name, // Nome do produto.
      description: submission.value.description, // Descrição do produto.
      status: submission.value.status, // Status do produto (ex: disponível, fora de estoque).
      price: submission.value.price, // Preço do produto.
      images: flattenUrls, // Lista de URLs das imagens.
      category: submission.value.category, // Categoria do produto.
      isFeatured: submission.value.isFeatured === true ? true : false,
      // Indica se o produto é destacado.
    },
  });

  // Redireciona o usuário para a página de produtos do dashboard após a criação.
  redirect("/dashboard/products");
}

export async function editProduct(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Verifica se o usuário está autenticado e tem permissão para criar produtos.
  if (!user || user.email !== "biduzao.bidu21@gmail.com") {
    return redirect("/"); // Redireciona para a página inicial se não estiver autorizado.
  }

  const submission = parseWithZod(formData, { schema: productSchema });

  if (submission.status !== "success") return submission.reply();

  const flattenUrls = submission.value.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  const productId = formData.get("productId") as string;
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name: submission.value.name,
      description: submission.value.description,
      status: submission.value.status,
      price: submission.value.price,
      images: flattenUrls,
      category: submission.value.category,
      isFeatured: submission.value.isFeatured === true ? true : false,
    },
  });
  redirect("/dashboard/products");
}

export async function deleteProduct(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Verifica se o usuário está autenticado e tem permissão para criar produtos.
  if (!user || user.email !== "biduzao.bidu21@gmail.com") {
    return redirect("/"); // Redireciona para a página inicial se não estiver autorizado.
  }

  await prisma.product.delete({
    where: {
      id: formData.get("productId") as string,
    },
  });
  redirect("/dashboard/products");
}

export async function createBanner(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== "biduzao.bidu21@gmail.com") {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: bannerSchema,
  });

  if (submission.status !== "success") return submission.reply();

  const banner = await prisma.banner.create({
    data: {
      title: submission.value.title,
      imageString: submission.value.imageString,
    },
  });

  redirect("/dashboard/banner");
}

export async function deleteBanner(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Verifica se o usuário está autenticado e tem permissão para criar produtos.
  if (!user || user.email !== "biduzao.bidu21@gmail.com") {
    return redirect("/"); // Redireciona para a página inicial se não estiver autorizado.
  }

  await prisma.banner.delete({
    where: {
      id: formData.get("bannerId") as string,
    },
  });
  redirect("/dashboard/banner");
}

export async function addItem(productId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Verifica se o usuário está autenticado e tem permissão para criar produtos.
  if (!user) {
    return redirect("/"); // Redireciona para a página inicial se não estiver autorizado.
  }
  let cart: Cart | null = await redis.get(`cart-${user.id}`);

  const selecteProduc = await prisma.product.findUnique({
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
    },
    where: {
      id: productId,
    },
  });

  if (!selecteProduc) {
    throw new Error("No product with this id");
  }
  let myCart = {} as Cart;
  if (!cart || !cart.items) {
    myCart = {
      items: [
        {
          id: selecteProduc.id,
          imageString: selecteProduc.images[0],
          name: selecteProduc.name,
          price: selecteProduc.price,
          quantity: 1,
        },
      ],
      userId: user.id,
    };
  } else {
    let itemfound = false;
    myCart.items = cart.items.map((item) => {
      if (item.id === productId) {
        itemfound = true;
        item.quantity += 1;
      }

      return item;
    });

    if (!itemfound) {
      myCart.items.push({
        id: selecteProduc.id,
        imageString: selecteProduc.images[0],
        name: selecteProduc.name,
        price: selecteProduc.price,
        quantity: 1,
      });
    }
  }

  await redis.set(`cart-${user.id}`, myCart);
  revalidatePath("/", "layout");
}

export async function deleItem(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Verifica se o usuário está autenticado e tem permissão para criar produtos.
  if (!user) {
    return redirect("/"); // Redireciona para a página inicial se não estiver autorizado.
  }

  const productId = formData.get("productId");
  let cart: Cart | null = await redis.get(`cart-${user.id}`);

  if (cart && cart.items) {
    const updateCart: Cart = {
      userId: user.id,
      items: cart.items.filter((item) => item.id !== productId),
    };

    await redis.set(`cart-${user.id}`, updateCart);
  }

  revalidatePath("/bag");
}

export async function checkOut() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Verifica se o usuário está autenticado e tem permissão para criar produtos.
  if (!user) {
    return redirect("/"); // Redireciona para a página inicial se não estiver autorizado.
  }

  let cart: Cart | null = await redis.get(`cart-${user.id}`);

  if (cart && cart.items) {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cart.items.map((item) => ({
        price_data: {
          unit_amount: item.price * 100,
          currency: "brl",
          product_data: {
            name: item.name,
            images: [item.imageString],
          },
        },
        quantity: item.quantity,
      }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/payment/success"
          : "https://ecommerce-next-app-self.vercel.app/payment/success",
      cancel_url:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/payment/cancel"
          : "https://ecommerce-next-app-self.vercel.app/payment/cancel",
      metadata: {
        userId: user.id,
      },
    });

    return redirect(session.url as string);
  }
}
