"use client";

import { getArtist } from "@/app/api/action/artists/artists";
import { ArtistWithEvents } from "@/types";
import { Event } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Si vous souhaitez utiliser html-react-parser
import parse from "html-react-parser";

const ArtistPage = () => {
  const router = useRouter();
  const [Loading, setLoading] = useState(false);
  const [artist, setArtist] = useState<ArtistWithEvents>();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    const fetchArtist = async () => {
      if (typeof id === "string") {
        const artistData = await getArtist(id);

        // Vérifiez que artistData n'est pas un tableau vide et que la propriété 'events' existe
        if (artistData && !Array.isArray(artistData) && artistData.events) {
          const artistWithFormattedDates = {
            ...artistData,
            events: artistData.events.map((event: Event) => ({
              ...event,
              date: event.date.toISOString(), // Conversion en chaîne ISO
            })),
          };

          setArtist(artistWithFormattedDates);
        } else {
          console.error("Artist data not found or events is empty.");
          return alert("Il n'y a pas d'artiste à cette adresse."); // Dans le cas où artistData est vide ou malformé
        }
      }
      setLoading(false);
    };
    fetchArtist();
  }, [id]);

  if (Loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <div className="w-[66vw] min-h-[90vh] mx-auto p-8 bg-perso-bg mb-20">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {artist.imageUrl && (
          <Image
            className="rounded"
            src={artist.imageUrl}
            alt={artist.name}
            width={400}
            height={400}
          />
        )}
        <div>
          <h1 className="text-4xl font-bold">{artist.name}</h1>
          <p className="text-xl text-slate-600">{artist.genre}</p>
          <div className="mt-4">
            {/* Afficher le bio avec html-react-parser */}
            {artist.bio ? parse(artist.bio) : <p>Pas de bio disponible.</p>}
          </div>
        </div>
      </div>

      {artist.socialLinks && (
        <div className="mt-8">
          <h2 className="text-3xl font-semibold">Liens :</h2>
          <ul className="list-disc ml-5 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {(() => {
              let socialLinksArray = [];

              if (typeof artist.socialLinks === "string") {
                try {
                  socialLinksArray = JSON.parse(artist.socialLinks);
                } catch (error) {
                  console.error("Erreur lors du parsing de socialLinks", error);
                }
              } else if (Array.isArray(artist.socialLinks)) {
                socialLinksArray = artist.socialLinks;
              }

              if (socialLinksArray.length > 0) {
                return socialLinksArray.map(
                  (link: any) =>
                    link.id &&
                    link.url &&
                    link.url !== "" &&
                    link.name &&
                    link.name !== "" && (
                      <div key={link.id} className="">
                        <Link href={link.url}>
                          <button className="mt-6 bg-blue-300 text-perso-bg px-4 py-2 rounded-lg hover:bg-blue-800 hover:text-perso-white-two transition">
                            {link.name}
                          </button>
                        </Link>
                      </div>
                    )
                );
              } else {
                return <li>Aucun lien social disponible.</li>;
              }
            })()}
          </ul>
        </div>
      )}
      {artist.events && artist.events.length > 0 && (
        <div className="mt-8">
          <h2 className="text-3xl font-semibold">Événements à venir :</h2>
          <ul className="list-disc ml-5 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-2">
            {artist.events.map(
              (event) =>
                new Date(event.date).getTime() > new Date().getTime() && (
                  <div key={event.id} className="">
                    <Link href={`/home/events/${event.id}`}>
                      <button className="mt-6 bg-perso-yellow-one text-black px-4 py-2 rounded-lg hover:bg-perso-yellow-one hover:text-perso-white-two transition">
                        {event.title} -{" "}
                        {new Date(event.date).toLocaleDateString()}
                      </button>
                    </Link>
                  </div>
                )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArtistPage;
