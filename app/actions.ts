"use server"; // Indica que esta função será executada no lado do servidor.

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"; // Gerencia sessões de autenticação no servidor.
import { redirect } from "next/navigation"; // Redireciona usuários para outras rotas no Next.js.
import { parseWithZod } from "@conform-to/zod"; // Valida formulários com o Zod.
import { bannerSchema, productSchema } from "./lib/zodSchemas"; // Esquema de validação para os dados do produto.
import prisma from "./lib/db"; // Instância do Prisma ORM para interagir com o banco de dados.
import { Schema } from "zod";

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
