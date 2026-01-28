"use client";

import { createArtist } from "@/app/api/artists/artists";
import { AlbumData } from "@/components/AlbumCreation";
import ArtistCreationForm from "@/components/ArtistCreationForm";
import ButtonHome from "@/components/ButtonHome";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import { Album, Artist, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface ArtistWithAlbums extends Artist {
  albums: Album[];
}

const ArtistsDashboard: React.FC = () => {
  const [artists, setArtists] = useState<ArtistWithAlbums[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

  const fetchArtists = async () => {
    try {
      setIsLoading(true);
      const artistList = await fetch(`/api/artists?t=${Date.now()}`, {
        cache: "no-store",
        next: { revalidate: 0 },
      }).then((res) => res.json());

      if (!artistList || !Array.isArray(artistList)) {
        console.error("La liste des artistes est vide ou null");
        return;
      }

      const formattedArtists: ArtistWithAlbums[] = artistList.map(
        (artist: Artist & { albums?: Album[] }) => ({
          ...artist,
          bio: artist.bio ?? null,
          genre: artist.genre ?? null,
          imageUrl: artist.imageUrl ?? null,
          videoUrl: artist.videoUrl ?? null,
          codePlayer: artist.codePlayer ?? null,
          urlPlayer: artist.urlPlayer ?? null,
          socialLinks: artist.socialLinks
            ? typeof artist.socialLinks === "string"
              ? artist.socialLinks
              : JSON.stringify(artist.socialLinks)
            : null,
          albums: artist.albums || [],
        })
      );

      setArtists(formattedArtists);
    } catch (error) {
      console.error("Erreur lors de la récupération des artistes:", error);
      toast.error("Erreur lors du chargement des artistes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const { loading } = useProtectedRoute("ADMIN");

  const handleArtistCreation = async (
    formData: FormData,
    links: Prisma.JsonArray,
    bio: string,
    albumForms: AlbumData[]
  ) => {
    try {
      setIsLoading(true);
      formData.append("bio", bio);

      const imageFile = formData.get("imageFile") as File | null;
      if (imageFile) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(imageFile);

        await new Promise((resolve) => {
          reader.onloadend = async () => {
            formData.append("imageFile", reader.result as string);
            resolve(null);
          };
        });
      }

      const artist = await createArtist(formData, links);
      if (!artist) {
        throw new Error("Échec de la création de l'artiste");
      }
      toast.success("Artiste créé avec succès !");

      // Redirection vers la page d'édition pour ajouter les albums
      router.push(`/admin/artist/${artist.id}`);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error(
        "Une erreur est survenue lors de la création. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-perso-bg text-perso-white-one p-6">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-perso-bg text-perso-white-one">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion des Artistes</h1>
          <ButtonHome />
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="mb-6 px-6 py-3 bg-perso-green hover:bg-perso-green/80 text-white rounded-lg transition-colors"
        >
          {showCreateForm ? "Masquer le formulaire" : "Créer un nouvel artiste"}
        </button>

        {showCreateForm && (
          <div className="mb-10 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Créer un nouvel artiste
            </h2>
            <ArtistCreationForm
              onSubmit={handleArtistCreation}
              isLoading={isLoading}
            />
          </div>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-6">Liste des artistes</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-perso-white-one"></div>
            </div>
          ) : artists.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              Aucun artiste pour le moment
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/admin/artist/${artist.id}`}
                  className="group bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="aspect-square relative bg-gray-900">
                    {artist.imageUrl ? (
                      <Image
                        src={artist.imageUrl}
                        alt={artist.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <span className="text-6xl">🎵</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-1 group-hover:text-perso-green transition-colors">
                      {artist.name}
                    </h3>
                    {artist.genre && (
                      <p className="text-sm text-gray-400">{artist.genre}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {artist.albums?.length || 0} album(s)
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistsDashboard;
