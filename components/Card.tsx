import { ArtistWithEvents } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Card: React.FC<ArtistWithEvents> = ({
  id,
  name,
  genre,
  bio,
  imageUrl,
  events,
}) => {
  const router = useRouter();
  const handleReadMore = () => {
    router.push(`/home/artists/${id}`); // Navigate to the dynamic artist page
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

      {/* Default overlay with title and genre */}
      {/* <div className="absolute inset-0 bg-slate-200 bg-opacity-50 flex flex-col justify-center items-center text-slate-900 p-4 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:-translate-x-full">
  </div> */}

      {/* Hidden overlay with description */}
      <div className="absolute inset-0 bg-slate-900 bg-opacity-80 flex items-center justify-center text-white p-10 translate-x-full transition-all duration-500 ease-in-out group-hover:translate-x-0  flex-col">
        <h3 className="font-bold text-5xl mb-2 font-belleza">{name}</h3>
        <p className="text-3xl text-slate-400 font-belleza">{genre}</p>
        <button
          onClick={handleReadMore}
          className="absolute bottom-4 right-4 bg-perso-yellow-one hover:bg-perso-yellow-two hover:text-perso-white-one text-slate-900 px-2 py-1 rounded font-belleza"
        >
          En voir +
        </button>
      </div>
    </div>
  );
};

export default Card;
