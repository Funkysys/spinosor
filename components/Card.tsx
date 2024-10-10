import { ArtistWithEvents } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Card: React.FC<ArtistWithEvents> = ({
  id,
  name,
  genre,
  bio,
  imageUrl,
  events,
}) => {
  return (
    <div className="bg-gray-800 p-5 mb-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">{name}</h2>
      <p>Genre : {genre}</p>
      <p>{bio}</p>
      {imageUrl && (
        <Image
          src={imageUrl || ""}
          alt={name}
          fill
          className="w-32 h-32 rounded"
        />
      )}

      <h3 className="mt-4 text-lg font-semibold">Événements :</h3>
      <ul>
        {events.map((event) => (
          <li key={event.id} className="mb-2">
            <strong>{event.title}</strong> - {event.date}
            <br />
            {event.location}
            <br />
            {event.ticketLink && (
              <Link href={event.ticketLink} className="text-blue-400">
                Billetterie
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Card;
