"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

interface CarouselProps {
  items: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  }[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 3000); // Change d'élément toutes les 3 secondes
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="relative flex justify-center items-center w-full h-[400px] overflow-hidden">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`relative m-auto w-[50vw] h-full transition-opacity duration-1000  ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={item.imageUrl}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            style={{ filter: "brightness(0.5)", borderRadius: "15px" }}
          />
          <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 p-4 text-white w-full">
            <h3 className="text-2xl">{item.name}</h3>
            <p className="text-xl">${item.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
