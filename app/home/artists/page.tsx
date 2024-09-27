import Card from "@/app/components/Card";
import CardContainer from "@/app/components/CardContainer";

interface Artist {
  id: number;
  name: string;
  genre: string;
  description: string;
  imageUrl?: string;
}

// interface ArtistsPageProps {
//   artists: Artist[];
// }

const ArtistsPage = () => {
  const artists: Artist[] = [
    {
      id: 1,
      name: "Artist One",
      genre: "Rock",
      description: "This is a description for Artist One.",
      imageUrl: "/assets/images/artist_test.jpg",
    },
    {
      id: 2,
      name: "Artist Two",
      genre: "Pop",
      description: "This is a description for Artist Two.",
      imageUrl: "/assets/images/artist_test.jpg",
    },
    {
      id: 3,
      name: "Artist Three",
      genre: "Jazz",
      description:
        "This is a description for Artist Three. This is a description for Artist Three. This is a description for Artist Three. This is a description for Artist Three.",
      imageUrl: "/assets/images/artist_test.jpg",
    },
  ];
  return (
    <section className="w-[80vw] mb-[11vh]">
      <CardContainer>
        {artists.map((artist) => (
          <Card
            key={artist.id}
            title={artist.name}
            genre={artist.genre}
            description={artist.description}
            imageUrl={artist.imageUrl}
          />
        ))}
      </CardContainer>
    </section>
  );
};

export default ArtistsPage;
