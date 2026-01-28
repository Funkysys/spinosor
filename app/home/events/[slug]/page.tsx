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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-perso-yellow-one rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-perso-bg">
      {/* Hero section */}
      <div className="max-w-6xl mx-auto">
        {/* Titre et infos */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-perso-white-one mb-4">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-perso-white-two/90 text-lg">
            <span className="flex items-center gap-2">
              📅 {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              🕐 {formattedTime}
            </span>
            <span className="flex items-center gap-2">
              📍 {event.location}
            </span>
          </div>
        </div>

        {/* Image de l'événement */}
        {event.imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={event.imageUrl}
              alt={event.title}
              width={1200}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        )}

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-perso-white-two p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-perso-bg flex items-center gap-2">
                📝 Description
              </h2>
              <p className="text-lg text-perso-bg/80 leading-relaxed">
                {event.description || "Pas de description disponible."}
              </p>
            </div>

            {/* Artistes */}
            {event.artists && event.artists.length > 0 && (
              <div className="bg-perso-white-two p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-perso-bg flex items-center gap-2">
                  🎵 Artistes
                </h2>
                <div className="flex flex-wrap gap-3">
                  {event.artists.map((artist: Artist) => (
                    <Link
                      key={artist.id}
                      href={`/home/artists/${artist.slug}`}
                    >
                      <button className="bg-perso-yellow-one text-perso-bg px-6 py-3 text-base font-semibold rounded-lg hover:bg-perso-yellow-two hover:scale-105 transition-all duration-200 shadow-md">
                        {artist.name}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations pratiques */}
            <div className="bg-perso-white-two p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-perso-bg">
                ℹ️ Infos pratiques
              </h2>
              <div className="space-y-3 text-perso-bg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-sm text-perso-bg/70">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <p className="font-semibold">Heure</p>
                    <p className="text-sm text-perso-bg/70">{formattedTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold">Lieu</p>
                    <p className="text-sm text-perso-bg/70">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Billetterie */}
            {event.ticketLink && (
              <Link href={event.ticketLink} target="_blank">
                <button className="w-full bg-perso-yellow-one text-perso-bg px-6 py-4 text-lg font-bold rounded-lg hover:bg-perso-yellow-two hover:scale-105 transition-all duration-200 shadow-lg">
                  🎟️ Acheter des billets
                </button>
              </Link>
            )}

            {/* Retour */}
            <button
              onClick={() => router.push("/home/events")}
              className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
            >
              ← Retour aux événements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
