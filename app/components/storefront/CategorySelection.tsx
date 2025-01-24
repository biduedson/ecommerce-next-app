import Image from "next/image";
import Link from "next/link";
import all from "@/public/all.jpg";
import men from "@/public/men.jpg";
import women from "@/public/women.jpg";

const CategorySelection = () => {
  return (
    <div className="py-24 sm:py-32">
      <div className="flex  justify-between items-center">
        <h2 className="text-2xl font-extrabold tracking-tight">
          Shop by Category
        </h2>
        <Link
          className="text-sm font-semibold text-primary hover:text-primary/80"
          href="/products/all"
        >
          Browse all Products &rarr;
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
        <div
          className="group aspect-w-2 aspect-h-1 rounded-xl overflow-hidden
        sm:aspect-w-1 sm:row-span-2"
        >
          <Image
            src={all}
            alt="All Products Image"
            className="object-cover object-center"
          />
          <div className="bg-gradient-to-b from-transparent to-black opacity-50" />
          <div className="p-6 flex items-end">
            <div>
              <Link href="/products/all">
                <h3 className="text-white font-semibold">All Products</h3>
                <p className="mt-1 text-sm text-white">Shop Now</p>
              </Link>
            </div>
          </div>
        </div>

        <div
          className="group aspect-w-2 aspect-h-1 rounded-lg overflow-hidden sm:relative
        sm:aspect-none sm:h-full2"
        >
          <Image
            src={men}
            alt="Products for men Image"
            className="object-cover object-center sm:absolute sm:inset-0 sm:w-full"
          />
          <div className="bg-gradient-to-b from-transparent to-black opacity-55 sm:absolute sm:inset-0" />
          <div className="p-6 flex items-end sm:absolute sm:inset-0">
            <div>
              <Link href="/products/men">
                <h3 className="text-white font-semibold">Products for Men</h3>
                <p className="mt-1 text-sm text-white">Shop Now</p>
              </Link>
            </div>
          </div>
        </div>

        <div
          className="group aspect-w-2 aspect-h-1 rounded-lg overflow-hidden sm:relative
        sm:aspect-none sm:h-full2"
        >
          <Image
            src={women}
            alt="All Products Image"
            className="object-cover object-bottom sm:absolute sm:inset-0 sm:w-full"
          />
          <div className="bg-gradient-to-b from-transparent to-black opacity-55 sm:absolute sm:inset-0" />
          <div className="p-6 flex items-end sm:absolute sm:inset-0">
            <div>
              <Link href="/products/women">
                <h3 className="text-white font-semibold">Products for women</h3>
                <p className="mt-1 text-sm text-white">Shop Now</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;
