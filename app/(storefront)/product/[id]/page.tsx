import { addItem } from "@/app/actions";
import FeaturedProducts from "@/app/components/storefront/FeaturedProducts";
import ImageSlider from "@/app/components/storefront/ImageSlider";
import { ShoppingBagButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { StarIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache"; // Importa um método experimental // para desativar o cache.
import ChromePicker from "react-color/lib/components/chrome/Chrome";
import ColorPicker from "@/app/components/products/ColorPicker";
import { formatCurrency } from "@/util/formatPrice";
import ProductOrderControl from "@/app/components/products/ProductOrderControl";

//import { ChromePicker } from "react-color";

const getData = async (productId: string) => {
  noStore();
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      price: true,
      images: true,
      description: true,
      name: true,
      id: true,
    },
  });

  if (!data) return notFound();

  return data;
};

const StarRatingQuantity = (quantity: number) => {
  const arrayringstar: React.ReactElement[] = [];
  for (let i = 0; i < quantity; i++) {
    arrayringstar.push(
      <StarIcon
        key={i}
        className=" h-6 w-6 text-yellow-500  fill-yellow-500 cursor-pointer"
      />
    );
  }
  return arrayringstar;
};

const ProductIdRoute = async ({ params }: { params: { id: string } }) => {
  const data = await getData(params.id);
  const addProductToShoppingCart = addItem.bind(null, data.id);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
        <ImageSlider images={data.images} />

        <div>
          <h1 className="text-[40px] font-bold uppercase tracking-tight text-gray-900">
            {data.name}
          </h1>
          <p className="text-4xl font-bold mt-2 text-gray-900">
            {formatCurrency(data.price * 100)}
          </p>
          <div className="mt-3 flex items-center gap-1">
            {StarRatingQuantity(5)}
          </div>
          <p className="text-base text-gray-700 mt-6">{data.description}</p>
          <div className="flex gap-5 items-center ">
            <ProductOrderControl productId={data.id} />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <FeaturedProducts />
      </div>
    </>
  );
};

export default ProductIdRoute;
