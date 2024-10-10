import { getArtists } from "@/app/api/action/artists/artists";
import Card from "@/components/Card";
import CardContainer from "@/components/CardContainer";

const ArtistsPage = async () => {
  // Récupérer les artistes via la server action
  const artists = await getArtists();

  return (
    <div>
      <CardContainer>
        {artists.map((artist) => (
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
