"use client";

import { getArtistsWithEvents } from "@/app/api/action/artists/artists";
import Card from "@/components/Card";
import CardContainer from "@/components/CardContainer";
import { ArtistWithEvents } from "@/types";
import { useEffect, useState } from "react";

const ArtistsPage = () => {
  const [artists, setArtists] = useState<ArtistWithEvents[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      const data = await getArtistsWithEvents();

      const sortedArtists = data.sort((a, b) => a.name.localeCompare(b.name));

      setArtists(sortedArtists);
      setLoading(false);
    };
    fetchArtists();

    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
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
              genre={artist.genre || "Non spécifié"}
              imageUrl={artist.imageUrl || "/assets/images/default_artist.jpg"}
              events={artist.events}
            />
          ))
        ) : (
          <div className="h-[90vh] w-[100vw] bg-perso-bg flex items-center justify-center">
            <h1 className="text-perso-white-two text-center text-2xl font-semibold">
              Aucun artiste trouvé
            </h1>
          </div>
        )}
      </CardContainer>
    </div>
  );
};

export default ArtistsPage;
