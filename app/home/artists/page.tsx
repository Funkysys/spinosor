"use client";
import { getArtistsWithEvents } from "@/app/api/action/artists/artists";
import Card from "@/components/Card";
import CardContainer from "@/components/CardContainer";
import { ArtistWithEvents } from "@/types";
import { useEffect, useState } from "react";

const ArtistsPage = () => {
  const [artists, setArtists] = useState<ArtistWithEvents[]>([]);
  const [loading, setloading] = useState<boolean>(false);

  // Récupérer les artistes via la server action
  useEffect(() => {
    setloading(true);
    const fetchArtists = async () => {
      const data = await getArtistsWithEvents();

      // Trier les artistes par ordre alphabétique
      const sortedArtists = data.sort((a, b) => a.name.localeCompare(b.name));

      setArtists(sortedArtists);
      setloading(false);
    };
    fetchArtists();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <CardContainer>
        {artists.length > 0 ? (
          artists.map((artist) => (
            <Card
              key={artist.id}
              id={artist.id}
              name={artist.name}
              genre={artist.genre || "Non spécifié"}
              bio={artist.bio || "Pas de description disponible"}
              imageUrl={artist.imageUrl || "/assets/images/default_artist.jpg"}
              socialLinks={artist.socialLinks}
              events={artist.events.length > 0 ? artist.events : []}
            />
          ))
        ) : (
          <p>Aucun artiste trouvé</p>
        )}
      </CardContainer>
    </div>
  );
};

export default ArtistsPage;
