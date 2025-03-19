"use client";

import Card from "@/components/Card";
import CardContainer from "@/components/CardContainer";
import { ArtistWithEvents } from "@/types";
import { useEffect, useState } from "react";

const ArtistsPage = () => {
  const [artists, setArtists] = useState<ArtistWithEvents[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const data = await fetch("/api/artists/with-events").then((res) => {
          return res.json();
        });

        const sortedArtists: ArtistWithEvents[] = data.sort(
          (a: ArtistWithEvents, b: ArtistWithEvents) =>
            a.name.localeCompare(b.name)
        );
        setArtists(sortedArtists);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        console.error("Erreur lors du chargement des artistes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] w-full bg-perso-bg">
      <CardContainer>
        {artists.length > 0 ? (
          artists.map((artist) => (
            <Card
              key={artist.id}
              id={artist.id}
              name={artist.name}
              slug={artist.slug}
              genre={artist.genre || "Non spécifié"}
              imageUrl={artist.imageUrl || "/assets/images/default_artist.jpg"}
              bio={artist.bio || ""}
              events={(artist.events || []).map((event) => ({
                ...event,
                ticketLink: event.ticketLink || undefined,
              }))}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">Aucun artiste trouvé</p>
        )}
      </CardContainer>
    </div>
  );
};

export default ArtistsPage;
