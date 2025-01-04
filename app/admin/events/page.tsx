"use client";

import {
  createEvent,
  deleteEvent,
  getArtists,
  getEvents,
  updateEvent,
} from "@/app/api/action/events/events";
import { getArtistImages } from "@/app/api/services/getArtistsImages";
import EventList from "@/components/EventList";
import ModaleImageSelection from "@/components/ModaleImageSelection";
import { EventType } from "@/types"; // Assurez-vous que le chemin est correct
import Image from "next/image";
import { useEffect, useState } from "react";
import Select from "react-select";

const EventsDashboard: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedArtists, setSelectedArtists] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [galerie, setGalerie] = useState<string[]>([]);
  const [loadImage, setLoadImage] = useState(false);

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

  const resetForm = () => {
    setSelectedImage(null);
  };

  const handleEventCreation = async (formData: FormData) => {
    setIsLoading(true);
    if (selectedImage) {
      formData.append("url", selectedImage);
    } else {
      const imageFile = formData.get("imageFile") as File | null;

      if (imageFile) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(imageFile); // Lire le fichier en tant que tableau de bytes
        reader.onloadend = async () => {
          formData.append("imageFile", reader.result as string);
          await createEvent(formData);
          resetForm();
          const result = await getEvents();
          setEvents(result as EventType[]);
          setIsLoading(false);
        };
      }
    }
    await createEvent(formData);
    resetForm();
    const result = await getEvents();
    setEvents(result as EventType[]);
    setIsLoading(false);
  };

  const handleImageSelection = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleEventDeletion = async (id: string) => {
    setIsLoading(true);
    await deleteEvent(id);
    const result = await getEvents();
    setEvents(result);
    setIsLoading(false);
  };

  const handleArtistChange = (selectedOptions: any) => {
    setSelectedArtists(selectedOptions);
  };
  const showModalFunc = (value: boolean, string: string) => {
    setShowModal(value);
    if (string === "artistes") {
      const fetchGalerie = async () => {
        const images = await getArtistImages();
        setGalerie(images);
      };
      fetchGalerie();
    }
  };
  return (
    <div className="min-h-screen p-5 bg-perso-bg text-perso-white-one">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Gérer les Événements
      </h1>
      {/* Formulaire de création d'événement */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          // Obtenir les artistes sélectionnés à partir du menu déroulant
          const selectedArtists = formData.getAll("artists") as string[];

          // S'assurer qu'ils sont bien ajoutés dans le FormData sous forme de tableau JSON
          formData.set("artists", JSON.stringify(selectedArtists));
          formData.delete("artists"); // Supprimer l'ancienne valeur
          selectedArtists.forEach((artistId) =>
            formData.append("artists", artistId)
          );
          handleEventCreation(formData);
        }}
        className="bg-gray-800 p-5 rounded-lg shadow-lg mb-10"
      >
        {/* Champs de formulaire */}
        <label htmlFor="title" className="text-sm text-slate-400">
          Title
        </label>
        <input
          type="text"
          name="title"
          placeholder="Titre"
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <label htmlFor="description" className="text-sm text-slate-400">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <label htmlFor="location" className="text-sm text-slate-400">
          Location
        </label>
        <input
          type="text"
          name="location"
          placeholder="Lieu"
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <label htmlFor="date" className="text-sm text-slate-400">
          Date
        </label>
        <input
          type="datetime-local"
          name="date"
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <label htmlFor="ticketLink" className="text-sm text-slate-400">
          Ticket Link
        </label>
        <input
          type="text"
          name="ticketLink"
          placeholder="Lien vers la billetterie"
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <div className="mb-4">
          <h2 className="text-lg mb-2">Sélectionner une image</h2>
          <button
            type="button"
            onClick={() => showModalFunc(true, "artistes")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 mr-2"
            disabled={isLoading}
          >
            {`Choisir une image d'artistes`}
          </button>
          <label htmlFor="imageFile" className="text-sm text-slate-400">
            Image
          </label>
          <input
            type="file"
            name="imageFile"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageSelection(URL.createObjectURL(file));
              }
            }}
            className="mt-2 ml-2"
            disabled={isLoading}
          />
          {selectedImage && !loadImage && (
            <div className="mt-3 w-32 h-32 relative">
              <Image
                src={selectedImage}
                alt="Aperçu"
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
            </div>
          )}

          {/* Modale de sélection d'image d'artistes */}
          {showModal && (
            <ModaleImageSelection
              galerie={galerie}
              handleImageSelection={handleImageSelection}
              onClose={() => setShowModal(false)}
              setLoadImage={setLoadImage}
            />
          )}
        </div>

        {/* Sélection des artistes */}
        <div className="mb-4">
          <label className="block mb-2">Artistes concernés :</label>
          <Select
            isMulti
            name="artists"
            options={artists.map((artist) => ({
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
