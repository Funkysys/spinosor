"use client";

import { EventWithArtists } from "@/types";
import { Artist } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EventPage = () => {
  const router = useRouter();
  const { slug } = useParams();
  const [event, setEvent] = useState<EventWithArtists | null>(null);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await fetch(`/api/events/by-slug?slug=${slug}`).then(
          (res) => res.json(),
        );

        console.log("📅 [EventPage] Event reçu:", eventData);
        console.log("📅 [EventPage] Date brute:", eventData?.date);
        console.log("📅 [EventPage] Type de date:", typeof eventData?.date);

        if (eventData) {
          setEvent(eventData as EventWithArtists);
        } else {
          router.push("/home/events");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'événement:", error);
        router.push("/home/events");
      }
    };

    fetchEvent();
  }, [slug, router]);

  useEffect(() => {
    if (!event) {
      return;
    }
    console.log("📅 [EventPage] Formatage de la date pour:", event.date);
    const eventDate = new Date(event.date);
    console.log("📅 [EventPage] Date parsée:", eventDate);
    console.log("📅 [EventPage] Date valide?", !isNaN(eventDate.getTime()));
    setFormattedDate(eventDate.toLocaleDateString("fr-FR"));
    setFormattedTime(
      eventDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  }, [event]);

  if (!event) {
    return <div className="text-center text-2xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-5 bg-perso-bg text-perso-bg">
      <h1 className="text-4xl font-bold text-center mb-8 text-perso-white-one">
        {event.title}
      </h1>

      <div className="max-w-4xl mx-auto bg-perso-white-two p-8 shadow-md rounded-lg mb-20">
        <div className="mb-6">
          {event.imageUrl && (
            <Image
              src={event.imageUrl}
              alt={event.title}
              width={800}
              height={450}
              className="rounded-lg mx-auto"
            />
          )}
        </div>
        <div className="text-lg mb-4">
          <p>
            <strong>Date:</strong> {formattedDate}
          </p>
          <p>
            <strong>Heure:</strong> {formattedTime}
          </p>
          <p>
            <strong>Lieu:</strong> {event.location}{" "}
          </p>
          <p className="mt-4">
            {event.description || "Pas de description disponible."}
          </p>

          <div className="mt-3 flex items-center ">
            <strong>Artistes:</strong>{" "}
            {(event.artists && event.artists.length) > 0 ? (
              <>
                {event.artists.map((artist: Artist) => {
                  return (
                    <Link
                      key={artist.id}
                      href={`/home/artists/slug=${artist.slug}`}
                    >
                      <button className="ml-3 bg-blue-300 px-3 py-2 text-sm rounded-lg hover:bg-blue-800 hover:text-perso-white-two transition">
                        {artist.name}
                      </button>
                    </Link>
                  );
                })}
              </>
            ) : (
              "Aucun artiste associé"
            )}
          </div>
          {event.ticketLink && (
            <div className="w-full text-center">
              <Link href={event.ticketLink} target="_blank">
                <button className="mt-6 bg-perso-yellow-one px-6 py-3 rounded-lg hover:bg-perso-yellow-two hover:text-perso-white-two transition">
                  Achetez vos billets ici !
                </button>
              </Link>
            </div>
          )}
        </div>
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
