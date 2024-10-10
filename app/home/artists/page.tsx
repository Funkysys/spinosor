import { getArtistsWithEvents } from "@/app/api/action/artists/artists"; // Vérifie le chemin d'import
import Card from "@/components/Card";
import CardContainer from "@/components/CardContainer";

const ArtistsPage = async () => {
  // Récupérer les artistes via la server action
  const artists = await getArtistsWithEvents();

  return (
    <div>
      <CardContainer>
        {artists.map((artist) => (
          <Card
            key={artist.id}
            title={artist.name}
            genre={artist.genre || "Non spécifié"}
            description={artist.bio || "Pas de description disponible"}
            imageUrl={artist.imageUrl || "/assets/images/default_artist.jpg"}
            socialLinks={artist.socialLinks}
            events={artist.events}
          />
        ))}
      </CardContainer>
    </div>
  );
};

export default ArtistsPage;
