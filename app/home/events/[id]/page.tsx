"use client";

import { EventWithArtists } from "@/types";
import { Artist } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EventPage = () => {
  const router = useRouter();
  const { id } = useParams(); // Récupérer l'id de l'URL
  const [event, setEvent] = useState<EventWithArtists | null>(null);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await fetch(`/api/events/${id}`).then((res) =>
          res.json()
        );

        if (eventData) {
          setEvent(eventData as EventWithArtists);
        } else {
          // Si l'événement n'existe pas, retour à la page des événements
          router.push("/home/events");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'événement:", error);
        // Optionnel : gérer l'erreur (par exemple, rediriger vers la page des événements)
        router.push("/home/events");
      }
    };

    fetchEvent();
  }, [id, router]);

  useEffect(() => {
    if (!event) {
      return;
    }
    const eventDate = new Date(event.date);
    setFormattedDate(eventDate.toLocaleDateString());
    setFormattedTime(
      eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }, [event]);

  if (!event) {
    return <div className="text-center text-2xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-5 bg-perso-bg text-perso-bg">
      <h1 className="text-4xl font-bold text-center mb-8 text-perso-white-one">
        {event.title} {/* Utilisation de 'title' comme dans votre modèle */}
      </h1>

      <div className="max-w-4xl mx-auto bg-perso-white-two p-8 shadow-md rounded-lg mb-20">
        {/* Image de l'événement */}
        <div className="mb-6">
          {event.imageUrl && (
            <Image
              src={event.imageUrl} // Vérifiez que 'imageUrl' est correct
              alt={event.title} // Utilisez 'title' pour l'attribut alt
              width={800}
              height={450}
              className="rounded-lg mx-auto"
            />
          )}
        </div>

        {/* Détails de l'événement */}
        <div className="text-lg mb-4">
          <p>
            <strong>Date:</strong> {formattedDate} {/* Affichage de la date */}
          </p>
          <p>
            <strong>Heure:</strong> {formattedTime} {/* Affichage de l'heure */}
          </p>
          <p>
            <strong>Lieu:</strong> {event.location}{" "}
            {/* Affichage du lieu de l'événement */}
          </p>
          <p className="mt-4">
            {event.description || "Pas de description disponible."}
          </p>

          <div className="mt-3 flex items-center ">
            <strong>Artistes:</strong>{" "}
            {
              (event.artists && event.artists.length) > 0 ? (
                <>
                  {event.artists.map((artist: Artist) => {
                    return (
                      <Link key={artist.id} href={`/home/artists/${artist.id}`}>
                        <button className="ml-3 bg-blue-300 px-3 py-2 text-sm rounded-lg hover:bg-blue-800 hover:text-perso-white-two transition">
                          {artist.name}
                        </button>
                      </Link>
                    );
                  })}
                </>
              ) : (
                "Aucun artiste associé"
              ) // Message si aucun artiste n'est associé
            }
          </div>
          {event.ticketLink && (
            <div className="w-full text-center">
              <Link href={event.ticketLink}>
                <button className="mt-6 bg-perso-yellow-one px-6 py-3 rounded-lg hover:bg-perso-yellow-two hover:text-perso-white-two transition">
                  Achetez vos billets ici !
                </button>
              </Link>
            </div>
          )}
          {/* Utilisation d'un message par défaut si la description est manquante */}
        </div>

        {/* Bouton pour retourner à la liste des événements */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/home/events")}
            className="bg-perso-yellow-one text-perso-white-two px-6 py-3 rounded-lg hover:bg-perso-yellow-two transition"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
