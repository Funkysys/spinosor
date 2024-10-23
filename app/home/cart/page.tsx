"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-10 mb-20">
        <h1 className="text-3xl font-bold">Votre panier est vide</h1>
        <p className="mt-4 text-lg">
          Ajoutez des articles à votre panier pour commencer.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 mb-20">
      <h1 className="text-3xl font-bold mb-6">Votre panier</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cart.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-around items-center bg-perso-white-one shadow-lg rounded-lg py-10 relative"
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={400}
              height={300}
              className="rounded-lg"
            />
            <div>
              <h3 className="text-2xl font-bold mt-4">{item.name}</h3>
              <p className="text-gray-700 mt-2">
                Couleur : {item.color} <br />
                Taille : {item.size}
              </p>
              <p className="text-perso-yellow-one font-bold mt-4">
                ${item.price}
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-perso-yellow-one text-perso-white-one mt-4 py-2 px-4 rounded-lg w-full hover:bg-perso-yellow-two transition"
              >
                Retirer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <button className="bg-green-600 text-perso-white-one py-2 px-4 rounded-lg w-full hover:bg-green-800 transition">
          Procéder au paiement
        </button>
      </div>
    </div>
  );
};

export default CartPage;
