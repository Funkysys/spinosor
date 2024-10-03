import Card from "@/components/Card";
import CardContainer from "@/components/CardContainer";

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
    {
      id: 4,
      name: "Artist Four",
      genre: "Hip Hop",
      description: "This is a description for Artist Four.",
      imageUrl: "/assets/images/artist_test.jpg",
    },
    {
      id: 5,
      name: "Artist Five",
      genre: "Blues",
      description: "This is a description for Artist Five.",
      imageUrl: "/assets/images/artist_test.jpg",
    },
    {
      id: 6,
      name: "Artist Six",
      genre: "Country",
      description: "This is a description for Artist Six.",
      imageUrl: "/assets/images/artist_test.jpg",
    },
    {
      id: 7,
      name: "Artist Seven",
      genre: "Folk",
      description: "This is a description for Artist Seven.",
      imageUrl: "/assets/images/artist_test.jpg",
    },
    {
      id: 8,
      name: "Artist Eight",
      genre: "Classical",
      description: "This is a description for Artist Eight.",
      imageUrl: "/assets/images/artist_test.jpg",
    },
  ];
  return (
    <div>
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
    </div>
  );
};

export default ArtistsPage;
