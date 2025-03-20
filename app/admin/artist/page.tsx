"use client";

import { createAlbum } from "@/app/api/albums/albums";
import { createArtist, deleteArtist } from "@/app/api/artists/artists";
import { AlbumData } from "@/components/AlbumCreation";
import ArtistCreationForm from "@/components/ArtistCreationForm";
import ArtistList from "@/components/ArtistList";
import ButtonHome from "@/components/ButtonHome";
import { Album, Artist, Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface ArtistWithAlbums extends Artist {
  albums: Album[];
}

const ArtistsDashboard: React.FC = () => {
  const [artists, setArtists] = useState<ArtistWithAlbums[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlbumLoading, setIsAlbumLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchArtistsAndAlbums = async () => {
      try {
        setIsLoading(true);
        const artistList = await fetch(`/api/artists?t=${Date.now()}`, {
          cache: "no-store",
          next: { revalidate: 1 },
        }).then((res) => res.json());
        const albumList = await fetch(`/api/album?t=${Date.now()}`, {
          cache: "no-store",
          next: { revalidate: 1 },
        }).then((res) => res.json());

        if (!artistList) {
          console.error("La liste des artistes est vide ou null");
          return;
        }

        const formattedArtists: ArtistWithAlbums[] = artistList.map(
          (artist: Artist) => ({
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
            albums: albumList.filter(
              (album: Album) => album.artistId === artist.id
            ),
          })
        );

        setArtists(formattedArtists);
      } catch (error) {
        console.error("Erreur lors de la récupération des artistes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistsAndAlbums();
  }, []);

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

      if (artist && albumForms.length > 0) {
        try {
          await Promise.all(
            albumForms.map(async (album) => {
              const albumFormData = new FormData();
              albumFormData.append("artistId", artist.id);
              albumFormData.append("title", album.title);
              if (album.imageUrl) {
                albumFormData.append("imageFile", album.imageUrl);
              }
              return createAlbum(albumFormData, album.links);
            })
          );
          toast.success("Albums créés avec succès !");
        } catch (error) {
          toast.error(
            "Erreur lors de la création des albums. Veuillez vérifier les informations saisies."
          );
          console.error("Erreur création albums:", error);
        }
      }

      const updatedArtists = await fetch(`/api/artists?t=${Date.now()}`, {
        cache: "no-store",
        next: { revalidate: 1 },
      }).then((res) => res.json());
      if (updatedArtists) {
        setArtists(updatedArtists as ArtistWithAlbums[]);
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error(
        "Une erreur est survenue lors de la création. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    const artist = artists.find((a) => a.id === id);
    if (artist) {
      setArtistToDelete(artist);
      setDeleteDialogOpen(true);
    }
  };

  const handleArtistDeletion = async (artistId: string) => {
    if (!artistId) return;

    try {
      setIsLoading(true);
      await deleteArtist(artistId);
      toast.success("Artiste supprimé avec succès");
      const updatedArtists = await fetch(`/api/artists?t=${Date.now()}`, {
        cache: "no-store",
        next: { revalidate: 1 },
      }).then((res) => res.json());
      if (updatedArtists) {
        setArtists(updatedArtists as ArtistWithAlbums[]);
      }
      setDeleteDialogOpen(false);
      setArtistToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'artiste:", error);
      toast.error("Erreur lors de la suppression de l'artiste");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlbumUpdate = async () => {
    try {
      setIsAlbumLoading(true);
      console.log("Mise à jour des artistes...");

      toast.success("Artiste MAJ avec succès");
      const artistList = await fetch(`/api/artists?t=${Date.now()}`, {
        cache: "no-store",
        next: { revalidate: 1 },
      }).then((res) => res.json());
      console.log("Données artistes après mise à jour:", artistList);
      const albumList = await fetch(`/api/albums?t=${Date.now()}`, {
        cache: "no-store",
        next: { revalidate: 1 },
      }).then((res) => res.json());
      console.log("Données albums après mise à jour:", albumList);
      if (!artistList) {
        console.error("La liste des artistes est vide ou null");
        return;
      }

      if (!artistList || !albumList) {
        console.error("Les listes d'artistes ou d'albums sont vides ou null");
        return;
      }

      const formattedArtists: ArtistWithAlbums[] = artistList.map(
        (artist: Artist) => ({
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
          albums: albumList.filter(
            (album: Album) => album.artistId === artist.id
          ),
        })
      );

      setArtists(formattedArtists);
    } catch (error) {
      console.error("Erreur lors de la Maj de l'artiste:", error);
      toast.error("Erreur lors de la Maj de l'artiste");
    } finally {
      setIsAlbumLoading(false);
    }
  };

  const modalStyle = {
    overlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
      display: deleteDialogOpen ? "flex" : "none",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      position: "relative" as const,
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "500px",
      width: "90%",
    },
  };

  const DeleteConfirmationModal = () => (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.content}>
        <h2 className="text-lg text-black font-semibold mb-4">
          Confirmer la suppression
        </h2>
        <p className="mb-4 text-black">
          {`Êtes-vous sûr de vouloir supprimer l'artiste ${artistToDelete?.name} ?
          Cette action est irréversible.`}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setDeleteDialogOpen(false);
              setArtistToDelete(null);
            }}
            className="px-4 py-2 text-gray-600 bg-gray-200 border rounded hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            onClick={() =>
              artistToDelete && handleArtistDeletion(artistToDelete.id)
            }
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-5 bg-perso-bg text-perso-white-one">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Gestion des Artistes
      </h1>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Créer un nouvel artiste</h2>
        <ButtonHome />
        <ArtistCreationForm
          onSubmit={handleArtistCreation}
          isLoading={isLoading}
        />
      </div>

      {isAlbumLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-perso-white-one"></div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Artistes existants</h2>
          <ArtistList
            artists={artists}
            onDelete={handleDeleteClick}
            isLoading={isLoading}
            onAlbumUpdate={handleAlbumUpdate}
          />
        </div>
      )}

      <DeleteConfirmationModal />
    </div>
  );
};

export default ArtistsDashboard;
