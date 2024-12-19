"use client";

import Image from "next/image";
import React from "react";

const AboutPage: React.FC = () => {
  const description = [,];

  const images = ["/assets/images/label_2.jpg"];

  return (
    <div className="container min:h-[100vh] mx-auto py-10 px-4 animate-fade-right animate-once animate-duration-[1000ms] animate-ease-in-out ">
      <h1 className="text-4xl font-bold font-ruda text-center mb-8">
        À Propos de Spinosor Records
      </h1>

      <div className="space-y-16">
        {images.map((image, index) => (
          <div
            key={index}
            className={`flex flex-col font-belleza md:flex-row ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            } items-center`}
          >
            <div className="md:w-1/2 p-4">
              <p className="text-xl font-semibold font-belleza text-gray-200 leading-relaxed">
                {`Spinosor Records est un label coopératif rassemblant des musiciens porteurs de créations originales.`}{" "}
                <br /> <br />
                {`Réunis autour de l’entraide mutuelle et du partage des compétences, Spinosor défend une vision artisanale de la musique, attentive à chaque étape de la conception des œuvres dans une démarche analogue à la production maraîchère ; limiter les intermédiaires, privilégier les circuits courts, veiller à une rémunération juste des artistes en explorant de nouveaux circuits économiques.`}{" "}
                <br /> <br />
                {` Tout en préservant l’indépendance de ses membres, le travail en collectif permet d’assurer l’exploration de nouveaux horizons, notamment dans le champ des musiques improvisées, ambiantes et électro-acoustiques. Il favorise l’éclosion d’une scène cohérente dans un cadre serein face à la transformation des arts en contenus.`}{" "}
                <br /> <br />
                {`Spinosor Records, c’est chercher la musique de demain avec les savoir-faire d’hier ; privilégier l’humain et l’authenticité, avec un usage restreint des correcteurs et une prohibition de l’IA dans l’intégralité du processus créatif. `}
              </p>
            </div>

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
