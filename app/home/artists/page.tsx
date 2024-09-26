import Head from "next/head";

interface Artist {
  id: number;
  name: string;
  genre: string;
}

// interface ArtistsPageProps {
//   artists: Artist[];
// }

const ArtistsPage = () => {
  return (
    <div>
      <Head>
        <title>Artists</title>
      </Head>
      <h1>Artists</h1>
      <ul>
        {/* {artists?.map((artist) => (
          <li key={artist.id}>
            {artist.name} - {artist.genre}
          </li>
        ))} */}
      </ul>
    </div>
  );
};

export default ArtistsPage;
