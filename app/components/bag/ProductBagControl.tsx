"use client";
import { downQuantityItemBag, upQuantityItemBag } from "@/app/actions";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useState, useTransition } from "react";
import { ShoppingBagButton } from "../SubmitButtons";

interface iAppProps {
  productId: string;
  qtd: number;
}

const ProductBagControl = ({ productId, qtd }: iAppProps) => {
  const [quantity, setQuantity] = useState<number>(qtd);
  const [isPending, startTransition] = useTransition();

  const upProductToShoppingCart = () => {
    startTransition(async () => {
      await upQuantityItemBag(productId, quantity);
    });
  };
  const downProductToShoppingCart = () => {
    startTransition(async () => {
      await downQuantityItemBag(productId, quantity);
    });
  };

  const upQuantity = (): void => {
    upProductToShoppingCart();
    setQuantity(quantity + 1);
  };

  const downQuantity = (): void => {
    downProductToShoppingCart();
    setQuantity(quantity - 1);
  };

  return (
    <div className="flex gap-5 items-center w-full ">
      <div className="px-2 lg:px-5 flex justify-between  items-center w-[100px] h-[34px] lg:w-[130px] lg:h-[34px]  bg-[#efefef] rounded-full">
        <CircleMinus
          className="cursor-pointer"
          onClick={() => downQuantity()}
        />
        <p className="text-sm lg:text-[16px] font-semibold">{quantity}</p>
        <CirclePlus className="cursor-pointer" onClick={() => upQuantity()} />
      </div>
    </div>
  );
};

export default ProductBagControl;
