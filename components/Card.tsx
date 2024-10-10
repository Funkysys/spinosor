import { JsonValue } from "@prisma/client/runtime/library";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  ticketLink?: string;
}

interface CardProps {
  title: string;
  genre: string;
  description: string;
  imageUrl?: string;
  socialLinks?: JsonValue;
  events: Event[];
}

const Card: React.FC<CardProps> = ({
  title,
  genre,
  description,
  imageUrl,
  events,
}) => {
  return (
    <div className="bg-gray-800 p-5 mb-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p>Genre : {genre}</p>
      <p>{description}</p>
      {imageUrl && (
        <Image
          src={imageUrl || ""}
          alt={title}
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
