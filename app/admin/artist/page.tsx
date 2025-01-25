"use client";

import { createAlbum, getAlbums } from "@/app/api/action/albums/albums";
import {
  createArtist,
  deleteArtist,
  getArtists,
} from "@/app/api/action/artists/artists";
import { AlbumData } from "@/components/AlbumCreation";
import ArtistCreationForm from "@/components/ArtistCreationForm";
import ArtistList from "@/components/ArtistList";
import { Album, Artist, Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface ArtistWithAlbums extends Artist {
  albums: Album[];
}

/**
 * Tableau de bord d'administration des artistes
 * Permet de créer, modifier et supprimer des artistes et leurs albums
 */
const ArtistsDashboard: React.FC = () => {
  const [artists, setArtists] = useState<ArtistWithAlbums[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Chargement initial des artistes et albums
  useEffect(() => {
    const fetchArtistsAndAlbums = async () => {
      try {
        setIsLoading(true);
        const [artistList, albumList] = await Promise.all([
          getArtists(),
          getAlbums(),
        ]);

        if (!artistList) {
          console.error("La liste des artistes est vide ou null");
          return;
        }

        const formattedArtists = artistList.map((artist: any) => ({
          ...artist,
          bio: artist.bio ?? null,
          genre: artist.genre ?? null,
          imageUrl: artist.imageUrl ?? null,
          videoUrl: artist.videoUrl ?? null,
          codePlayer: artist.codePlayer ?? null,
          urlPlayer: artist.urlPlayer ?? null,
          socialLinks: artist.socialLinks ? (
            typeof artist.socialLinks === 'string' 
              ? artist.socialLinks 
              : JSON.stringify(artist.socialLinks)
          ) : null,
          albums: albumList.filter((album) => album.artistId === artist.id),
        }));

        setArtists(formattedArtists);
      } catch (error) {
        console.error("Erreur lors de la récupération des artistes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistsAndAlbums();
  }, []);

  /**
   * Gère la création d'un nouvel artiste et de ses albums
   */
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

      // Création de l'artiste
      const artist = await createArtist(formData, links);
      if (!artist) {
        throw new Error("Échec de la création de l'artiste");
      }
      toast.success("Artiste créé avec succès !");
      
      // Création des albums
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
          toast.error("Erreur lors de la création des albums. Veuillez vérifier les informations saisies.");
          console.error("Erreur création albums:", error);
        }
      }

      // Rafraîchir la liste des artistes
      const updatedArtists = await getArtists();
      if (updatedArtists) {
        setArtists(updatedArtists as ArtistWithAlbums[]);
      }

    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Une erreur est survenue lors de la création. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gère la suppression d'un artiste
   */
  const handleArtistDeletion = async (id: string) => {
    try {
      setIsLoading(true);
      const artist = artists.find((a) => a.id === id);
      if (!artist) {
        toast.error("Artiste non trouvé");
        return;
      }

      await deleteArtist(id);
      toast.success("Artiste supprimé avec succès");
      
      // Mettre à jour la liste des artistes
      const updatedArtists = artists.filter((a) => a.id !== id);
      setArtists(updatedArtists);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de l'artiste");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-5 bg-perso-bg text-perso-white-one">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Gérer les Artistes
      </h1>

      {/* Formulaire de création d'artiste */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Créer un nouvel artiste</h2>
        <ArtistCreationForm
          onSubmit={handleArtistCreation}
          isLoading={isLoading}
        />
      </div>

      {/* Liste des artistes existants */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Artistes existants</h2>
        <ArtistList
          artists={artists}
          onDelete={handleArtistDeletion}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ArtistsDashboard;
