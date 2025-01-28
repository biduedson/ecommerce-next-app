import { ProductCard } from "@/app/components/storefront/ProductCard";
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache"; // Importa um método experimental para desativar o cache.

const getData = async (productCategory: string) => {
  noStore();
  switch (productCategory) {
    case "all": {
      const data = await prisma.product.findMany({
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
        where: {
          status: "published",
        },
      });

      return {
        title: "All Products",
        data: data,
      };
    }
    case "men": {
      const data = await prisma.product.findMany({
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
        where: {
          status: "published",
          category: "men",
        },
      });

      return {
        title: "Products for Men",
        data: data,
      };
    }

    case "women": {
      const data = await prisma.product.findMany({
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
        where: {
          status: "published",
          category: "women",
        },
      });

      return {
        title: "Products to Women",
        data: data,
      };
    }

    case "kids": {
      const data = await prisma.product.findMany({
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
        where: {
          status: "published",
          category: "kids",
        },
      });

      return {
        title: "Products for Kids",
        data: data,
      };
    }
    default: {
      return notFound();
    }
  }
};

const CategoriesPage = async ({ params }: { params: { name: string } }) => {
  const { data, title } = await getData(params.name);

  return (
    <section>
      <h1 className="font-semibold text-3xl my-5">{title}</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <ProductCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
};

export default CategoriesPage;
