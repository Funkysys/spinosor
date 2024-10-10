"use client";

import {
  createEvent,
  deleteEvent,
  getArtists,
  getEvents,
  updateEvent,
} from "@/app/api/action/events/events";
import EventList from "@/components/EventList";
import { EventType } from "@/types"; // Assurez-vous que le chemin est correct
import { useEffect, useState } from "react";

const EventsDashboard: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const result = await getEvents();
      setEvents(result);
    };

    const fetchArtists = async () => {
      const artistList = await getArtists();
      setArtists(artistList);
    };

    fetchEvents();
    fetchArtists();
  }, []);

  const handleEventCreation = async (formData: FormData) => {
    setIsLoading(true);
    await createEvent(formData);
    const result = await getEvents();
    setEvents(result);
    setIsLoading(false);
  };

  const handleEventDeletion = async (id: string) => {
    setIsLoading(true);
    await deleteEvent(id);
    const result = await getEvents();
    setEvents(result);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-5 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Gérer les Événements
      </h1>
      {/* Formulaire de création d'événement */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleEventCreation(formData);
        }}
        className="bg-gray-800 p-5 rounded-lg shadow-lg mb-10"
      >
        {/* Champs de formulaire */}
        <input
          type="text"
          name="title"
          placeholder="Titre"
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Lieu"
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <input
          type="datetime-local"
          name="date"
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <input
          type="text"
          name="ticketLink"
          placeholder="Lien vers la billetterie"
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />

        {/* Sélection des artistes */}
        <div className="mb-4">
          <label className="block mb-2">Artistes concernés :</label>
          {artists.map((artist) => (
            <label key={artist.id} className="block mb-2">
              <input
                type="checkbox"
                name="artists"
                value={artist.id}
                className="mr-2"
              />
              {artist.name}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="mt-5 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
        >
          Créer Événement
        </button>
      </form>

      {/* Liste des événements */}
      <div className="mt-10">
        <h2 className="text-xl mb-3">Événements existants</h2>
        <ul>
          {events.map((event) => (
            <EventList
              key={event.id}
              event={event}
              artists={artists} // Passe les artistes ici
              onDelete={handleEventDeletion}
              onUpdate={async (id: string, formData: FormData) => {
                await updateEvent(id, formData);
                const result = await getEvents();
                setEvents(result);
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventsDashboard;
