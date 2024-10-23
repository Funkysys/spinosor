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
        <div className="flex justify-center items-center ">
          {" "}
          {/* Conteneur flex pour centrer verticalement */}
          <Image
            className="object-cover"
            src={imageUrl}
            alt={name}
            width={500}
            height={500}
          />
        </div>
      )}

      {/* Default overlay with title and genre */}
      <div className="absolute inset-0 bg-slate-200 bg-opacity-50 flex flex-col justify-center items-center text-slate-900 p-4 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:-translate-x-full">
        <h3 className="font-bold text-5xl mb-2">{name}</h3>
        <p className="text-2xl">{genre}</p>
      </div>

      {/* Hidden overlay with description */}
      <div className="absolute inset-0 bg-slate-900 bg-opacity-80 flex items-center justify-center text-white p-10 translate-x-full transition-all duration-500 ease-in-out group-hover:translate-x-0 ">
        <p className="text-2xl ">
          {bio && <>{bio.length > 100 ? bio.substring(0, 100) + "..." : bio}</>}
        </p>
        <button
          onClick={handleReadMore}
          className="absolute bottom-4 right-4 bg-slate-200 text-slate-900 px-2 py-1 rounded"
        >
          En voir +
        </button>
      </div>
    </div>
  );
};

export default Card;
