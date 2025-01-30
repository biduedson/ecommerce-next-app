"use client";

interface iAppProps {
  productId: string;
}

import { CircleMinus, CirclePlus } from "lucide-react";
import { useState, useTransition } from "react";
import { ShoppingBagButton } from "../SubmitButtons";
import { addItem } from "@/app/actions";

const ProductOrderControl = ({ productId }: iAppProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isPending, startTransition] = useTransition();

  const addProductToShoppingCart = () => {
    startTransition(async () => {
      await addItem(productId, quantity);
    });
    setQuantity(1);
  };

  const upQuantity = (): void => {
    setQuantity(quantity + 1);
  };

  const downQuantity = (): void => {
    setQuantity(() => (quantity === 1 ? 1 : quantity - 1));
  };

  return (
    <div className="flex gap-5 items-center w-full ">
      <div className="px-5 flex justify-between  items-center w-[170px] h-[44px] mt-5  bg-[#efefef] rounded-full">
        <CircleMinus
          className="cursor-pointer"
          onClick={() => downQuantity()}
        />
        <p className="text-xl font-semibold">{quantity}</p>
        <CirclePlus className="cursor-pointer" onClick={() => upQuantity()} />
      </div>
      <form action={addProductToShoppingCart} className="flex w-full">
        <ShoppingBagButton />
      </form>
    </div>
  );
};

export default ProductOrderControl;
