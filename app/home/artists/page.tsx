"use client";
import {
  getArtists,
  getArtistsWithEvents,
} from "@/app/api/action/artists/artists";
import Card from "@/components/Card";
import CardContainer from "@/components/CardContainer";
import { ArtistWithEvents } from "@/types";
import { useEffect, useState } from "react";

const ArtistsPage = () => {
  const [artists, setArtists] = useState<ArtistWithEvents[]>([]);

  // Récupérer les artistes via la server action
  useEffect(() => {
    const fetchArtists = async () => {
      const artists = await getArtists();
      const artistsWithEvents = await getArtistsWithEvents();
      console.log(artists);
      setArtists([
        ...artists.map((artist) => {
          return { ...artist, events: [] };
        }),
        ...artistsWithEvents,
      ]);
    };

    fetchArtists();

    const fetchArtistsWithEvents = async () => {
      console.log(artists);
      setArtists(artists);
    };
    fetchArtistsWithEvents();
  }, []);

  return (
    <div>
      <CardContainer>
        {artists?.map((artist) => (
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
        ))}
        {artists?.map((artist) => (
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
        ))}
      </CardContainer>
    </div>
  );
};

export default ArtistsPage;
