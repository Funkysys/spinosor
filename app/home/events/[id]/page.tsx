"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Interface pour définir la structure d'un événement
interface Event {
  id: number;
  name: string;
  date: string;
  description: string;
  image: string;
}

const EventPage = () => {
  const router = useRouter();
  const { id } = useParams(); // Récupérer l'id de l'URL
  const [event, setEvent] = useState<Event | null>(null);

  // Liste factice d'événements avec description et image
  const eventsData: Event[] = [
    {
      id: 1,
      name: "Concert Rock",
      date: "2024-12-01",
      description: "A thrilling rock concert with famous bands.",
      image: "/assets/images/concert-rock.jpg",
    },
    {
      id: 2,
      name: "Festival Jazz",
      date: "2024-11-15",
      description: "Experience the best jazz music in town.",
      image: "/assets/images/festival-jazz.jpg",
    },
    {
      id: 3,
      name: "Expo Art",
      date: "2024-10-20",
      description: "An exhibition of modern and contemporary art.",
      image: "/assets/images/expo-art.jpg",
    },
    // ... autres événements
  ];

  useEffect(() => {
    // Trouver l'événement correspondant à l'id
    const eventData = eventsData.find((event) => event.id === Number(id));
    if (eventData) {
      setEvent(eventData);
    } else {
      // Si l'événement n'existe pas, retour à la page des événements
      router.push("/home/events");
    }
  }, [id, router]);

  if (!event) {
    return <div className="text-center text-2xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-5 bg-black text-black">
      <h1 className="text-4xl font-bold text-center mb-8 text-red-800">
        {event.name}
      </h1>

      <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg mb-20">
        {/* Image de l'événement */}
        <div className="mb-6">
          <Image
            src={event.image}
            alt={event.name}
            width={800}
            height={450}
            className="rounded-lg"
          />
        </div>

        {/* Détails de l'événement */}
        <div className="text-lg mb-4">
          <p>
            <strong>Date:</strong> {event.date}
          </p>
          <p className="mt-4">{event.description}</p>
        </div>

        {/* Bouton pour retourner à la liste des événements */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/home/events")}
            className="bg-red-800 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
