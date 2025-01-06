import { getArtists } from "@/app/api/action/events/events";
import { Artist as ArtistType, Event as EventType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Select from "react-select";

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
  const [selectedArtists, setSelectedArtists] = useState<any[]>([]); // Pour gérer les artistes sélectionnés
  const [updateArtists, setUpdateArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchArtists = async () => {
      const artistList = await getArtists();
      setUpdateArtists(artistList);
      setLoading(false);
    };
    fetchArtists();
  }, []);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.set("artists", JSON.stringify(selectedArtists));
    formData.delete("artists"); // Supprimer l'ancienne valeur
    selectedArtists.forEach((artistId) => formData.append("artists", artistId));
    onUpdate(event.id, formData);
    setIsEditing(false);
  };

  const handleArtistChange = (selectedArtists: any) => {
    setSelectedArtists(selectedArtists);
  };

  if (loading) {
    return (
      <div className="w-16 h-16 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
    );
  }
  return (
    <li className="bg-gray-800 p-5 mb-4 rounded-lg shadow-lg">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <label htmlFor="title" className="text-sm text-slate-400">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={event.title}
            required
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />
          <label htmlFor="description" className="text-sm text-slate-400">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={event.description || ""}
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          ></textarea>
          <label htmlFor="location" className="text-sm text-slate-400">
            Location
          </label>
          <input
            type="text"
            name="location"
            defaultValue={event.location}
            required
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />
          <label htmlFor="date" className="text-sm text-slate-400">
            Date
          </label>
          <input
            type="datetime-local"
            name="date"
            defaultValue={new Date(event.date).toISOString().slice(0, 16)}
            required
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />
          <label htmlFor="ticketLink" className="text-sm text-slate-400">
            Ticket Link
          </label>
          <input
            type="url"
            name="ticketLink"
            defaultValue={event.ticketLink || ""}
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />

          {/* Sélection des artistes */}
          <div className="mb-4">
            <label className="block mb-2">Artistes concernés :</label>
            <Select
              isMulti
              name="artists"
              options={updateArtists.map((artist) => ({
                value: artist.id, // La valeur de chaque artiste sera son ID
                label: artist.name, // Ce qui sera affiché dans la liste
              }))}
              className="w-full text-black" // Ajout de text-black pour bien voir les artistes sélectionnés
              classNamePrefix="select"
              onChange={handleArtistChange} // Gère la sélection
              placeholder="Sélectionnez des artistes"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-perso-white-one px-4 py-2 rounded hover:bg-blue-400"
          >
            Mettre à jour
          </button>
          <button
            type="button"
            className="ml-4 bg-gray-500 text-perso-white-one px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setIsEditing(false)}
          >
            Annuler
          </button>
        </form>
      ) : (
        <>
          <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
          <p>{event.description}</p>
          {event.imageUrl && (
            <Image
              src={event.imageUrl || "/default_artist.png"}
              alt={event.title}
              width={128}
              height={128}
              className="rounded"
            />
          )}
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
            className="mt-5 bg-red-500 text-perso-white-one px-4 py-2 rounded hover:bg-red-400"
            onClick={() => onDelete(event.id)}
          >
            Supprimer
          </button>
          <button
            className="ml-4 mt-5 bg-perso-yellow-one text-perso-white-one px-4 py-2 rounded hover:bg-perso-yellow-two"
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
