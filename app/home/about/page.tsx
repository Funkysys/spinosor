"use client";

import Image from "next/image";
import React from "react";

const AboutPage: React.FC = () => {
  const description = `Spinosor Records est un label de musique indépendant dédié à découvrir et promouvoir des talents uniques. Nous offrons une plateforme pour les artistes émergents de différents genres musicaux, et mettons un point d'honneur à favoriser l'originalité et la créativité dans chaque projet que nous soutenons.`;

  const images = [
    "/assets/images/label_1.jpg",
    "/assets/images/label_2.jpg",
    "/assets/images/label_3.jpg",
  ];

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-right animate-once animate-duration-[1000ms] animate-ease-in-out">
      <h1 className="text-4xl font-bold text-center mb-8">
        About Spinosor Records
      </h1>

      <div className="space-y-16">
        {images.map((image, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            } items-center`}
          >
            {/* Texte à gauche/droite en fonction de l'index */}
            <div className="md:w-1/2 p-4">
              <p className="text-xl font-semibold text-gray-200 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Image à droite/gauche */}
            <div className="md:w-1/2 p-4">
              <Image
                src={image}
                alt={`About Spinosor Records ${index + 1}`}
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
