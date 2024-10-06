"use client";

import { useCart } from "@/context/CartContext"; // Context pour le panier
import Image from "next/image";
import React, { useState } from "react";

interface MerchCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    colors: { color: string; imageUrl: string }[];
    sizes: string[];
  };
}

const MerchCard: React.FC<MerchCardProps> = ({ product }) => {
  const { addToCart } = useCart(); // Hook pour ajouter au panier
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: selectedColor.imageUrl,
      color: selectedColor.color,
      size: selectedSize,
    };
    addToCart(productToAdd); // Ajouter au panier via le context
    alert(
      `${product.name} (Taille: ${selectedSize}, Couleur: ${selectedColor.color}) a été ajouté au panier !`
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-around items-center">
      {/* Image du produit */}
      <Image
        src={selectedColor.imageUrl}
        alt={product.name}
        width={400}
        height={300}
        className="rounded-lg"
      />
      <div>
        {/* Infos sur le produit */}
        <h3 className="text-2xl font-bold mt-4">{product.name}</h3>
        <p className="text-gray-700 mt-2">{product.description}</p>
        <p className="text-red-800 font-bold mt-4">${product.price}</p>

        {/* Sélection des couleurs */}
        <div className="mt-4">
          <h4 className="font-bold">Couleurs :</h4>
          <div className="flex space-x-2">
            {product.colors.map((colorOption) => (
              <button
                key={colorOption.color}
                onClick={() => setSelectedColor(colorOption)}
                className={`w-6 h-6 rounded-full ${
                  selectedColor.color === colorOption.color
                    ? "ring-2 ring-red-800"
                    : ""
                }`}
                style={{ backgroundColor: colorOption.color.toLowerCase() }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sélection des tailles */}
      <div className="mt-4">
        <h4 className="font-bold">Tailles disponibles :</h4>
        <div className="flex space-x-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`bg-gray-200 text-gray-700 px-2 py-1 rounded ${
                selectedSize === size ? "ring-2 ring-red-800" : ""
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Bouton Ajouter au panier */}
      <button
        onClick={handleAddToCart}
        className="bg-red-800 text-white mt-4 py-2 px-4 rounded-lg w-full hover:bg-red-600 transition"
      >
        Ajouter au panier
      </button>
    </div>
  );
};

export default MerchCard;
