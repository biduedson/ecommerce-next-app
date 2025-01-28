import EditForm from "@/app/components/dashboard/EditForm";
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache"; // Importa um método experimental para desativar o cache.

async function getData(productId: string) {
  noStore();
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!data) {
    return notFound();
  }

  return data;
}

const EditRoute = async ({ params }: { params: { id: string } }) => {
  const data = await getData(params.id);
  return <EditForm data={data} />;
};

export default EditRoute;
