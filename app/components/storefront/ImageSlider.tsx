"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
interface iAppProps {
  images: string[];
}

const ImageSlider = ({ images }: iAppProps) => {
  const [mainImageIndex, setmainImageIndex] = useState(0);

  const handlePreviousClick = () => {
    setmainImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setmainImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row  gap-6 md:gap-3 items-start">
      <div className="flex  lg:flex-col   gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setmainImageIndex(index)}
            className={`cursor-pointer ${cn(
              index === mainImageIndex
                ? "border-2 border-primary"
                : "border border-gray-200",
              "relative overflow-hidden rounded-lg"
            )}`}
          >
            <Image
              src={image}
              alt="Product Image"
              width={100}
              height={100}
              className="object-cover w-[100px] h-[100px]"
            />
          </div>
        ))}
      </div>
      <div className="relative overflow-hidden rounded-lg ">
        <Image
          width={400}
          height={400}
          src={images[mainImageIndex]}
          alt="Product Image"
          className=" object-cover w-[444px] h-[530px] "
        />

        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePreviousClick()}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleNextClick()}>
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
