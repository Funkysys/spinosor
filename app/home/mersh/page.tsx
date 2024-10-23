"use client";

import Carousel from "@/components/Carousel";
import MerchCard from "@/components/MerchCard";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  colors: { color: string; imageUrl: string }[];
  sizes: string[];
}

const MershPage = () => {
  const products: Product[] = [
    {
      id: 1,
      name: "T-Shirt Rock",
      description: "A cool rock t-shirt with amazing design.",
      price: 29.99,
      imageUrl: "/assets/images/rock-tshirt-black.jpg",
      colors: [
        { color: "Black", imageUrl: "/assets/images/rock-tshirt-black.jpg" },
        { color: "White", imageUrl: "/assets/images/rock-tshirt-white.jpg" },
      ],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 2,
      name: "Jazz Hat",
      description: "A stylish hat for jazz lovers.",
      price: 19.99,
      imageUrl: "/assets/images/jazz-hat-blue.jpg",
      colors: [
        { color: "Blue", imageUrl: "/assets/images/jazz-hat-blue.jpg" },
        { color: "Black", imageUrl: "/assets/images/jazz-hat-black.jpg" },
      ],
      sizes: ["One Size"],
    },
    // Ajoute plus d'articles ici...
  ];

  // Derniers articles pour la bannière défilante
  const latestProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-perso-white-two text-perso-bg mb-20">
      {/* Bannière défilante */}
      <section className="py-8 bg-perso-yellow-one">
        <h2 className="text-3xl text-center text-perso-white-one font-bold mb-6 border-b-2">
          Nos Dernières Nouveautées
        </h2>
        <Carousel items={latestProducts} />
      </section>

      {/* Liste des produits */}
      <section className="py-8">
        <h2 className="text-4xl text-center font-bold mb-6">Nos Produits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <MerchCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MershPage;
