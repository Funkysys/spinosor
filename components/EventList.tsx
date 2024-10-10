import { Artist as ArtistType, Event as EventType } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";

interface EventListProps {
  event: EventType & { artists: ArtistType[] }; // Assurez-vous que les artistes sont inclus
  onDelete: (id: string) => void;
  onUpdate: (id: string, formData: FormData) => void;
  artists: ArtistType[]; // Pour gérer les artistes lors de la mise à jour
}

const EventList: React.FC<EventListProps> = ({
  event,
  onDelete,
  onUpdate,
  artists,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onUpdate(event.id, formData);
    setIsEditing(false);
  };

  return (
    <li className="bg-gray-800 p-5 mb-4 rounded-lg shadow-lg">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="title"
            defaultValue={event.title}
            required
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />
          <textarea
            name="description"
            defaultValue={event.description || ""}
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          ></textarea>
          <input
            type="text"
            name="location"
            defaultValue={event.location}
            required
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />
          <input
            type="datetime-local"
            name="date"
            defaultValue={new Date(event.date).toISOString().slice(0, 16)}
            required
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />
          <input
            type="url"
            name="ticketLink"
            defaultValue={event.ticketLink || ""}
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />

          {/* Sélection des artistes */}
          <div className="mb-4">
            <label htmlFor="artists" className="block mb-1">
              Artistes participants :
            </label>
            <select
              name="artists"
              id="artists"
              multiple
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              defaultValue={event.artists.map((artist) => artist.id)}
            >
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
          >
            Mettre à jour
          </button>
          <button
            type="button"
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setIsEditing(false)}
          >
            Annuler
          </button>
        </form>
      ) : (
        <>
          <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
          <p>{event.description}</p>
          <p>Lieu : {event.location}</p>
          <p>Date : {new Date(event.date).toLocaleString()}</p>
          <p>
            Billetterie :{" "}
            <Link href={event.ticketLink || ""} className="text-blue-400">
              {event.ticketLink}
            </Link>
          </p>
          <p>
            Artistes : {event.artists.map((artist) => artist.name).join(", ")}
          </p>

          <button
            className="mt-5 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
            onClick={() => onDelete(event.id)}
          >
            Supprimer
          </button>
          <button
            className="ml-4 mt-5 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400"
            onClick={() => setIsEditing(true)}
          >
            Modifier
          </button>
        </>
      )}
    </li>
  );
};

export default EventList;
