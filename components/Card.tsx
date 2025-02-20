import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface CardProps {
  id: string;
  name: string;
  genre?: string;
  bio?: string;
  imageUrl?: string;
  events: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
    ticketLink?: string | null;
  }>;
}

const Card: React.FC<CardProps> = ({
  id,
  name,
  genre,
  bio,
  imageUrl,
  events,
}) => {
  const router = useRouter();
  const handleReadMore = () => {
    router.push(`/home/artists/${name.replace(/\s/g, "-").toLowerCase()}`);
  };

  return (
    <div className="relative max-h-[50vh] bg-slate-300 rounded overflow-hidden shadow-lg group">
      {imageUrl && (
        <div className="relative w-full aspect-square">
          {/* Conteneur carré grâce à aspect-square */}
          <Image
            className="object-cover"
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-slate-900 bg-opacity-80 flex items-center justify-center text-white p-10 translate-x-full transition-all duration-500 ease-in-out group-hover:translate-x-0  flex-col">
        <h3 className="font-bold text-5xl mb-2 font-belleza">{name}</h3>
        <p className="text-3xl text-slate-400 font-belleza">{genre}</p>
        <button
          onClick={handleReadMore}
          className="absolute bottom-5 right-5 bg-perso-yellow-one hover:bg-perso-yellow-two hover:text-perso-white-one text-slate-900 px-3 pb-1 rounded-full font-belleza text-2xl lg:text-4xl"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Card;
