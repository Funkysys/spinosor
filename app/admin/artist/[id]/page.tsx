"use client";

import { createAlbum, updateAlbum } from "@/app/api/albums/albums";
import { deleteArtist, updateArtist } from "@/app/api/artists/artists";
import { ArtistBasicInfoForm } from "@/components/admin/ArtistBasicInfoForm";
import { ArtistBioEditor } from "@/components/admin/ArtistBioEditor";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { ExistingAlbumsSection } from "@/components/admin/ExistingAlbumsSection";
import { NewAlbumForm } from "@/components/admin/NewAlbumForm";
import { SocialLinksEditor } from "@/components/admin/SocialLinksEditor";
import { AlbumData } from "@/components/AlbumCreation";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import { Link as LinkType } from "@/types";
import { Album, Artist } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ArtistWithAlbums extends Artist {
  albums: Album[];
}

const ArtistEditPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const artistId = params.id as string;

  const [artist, setArtist] = useState<ArtistWithAlbums | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // États d'édition
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState<LinkType[]>([]);
  const [albumFormsUpdate, setAlbumFormsUpdate] = useState<Album[]>([]);
  const [albumFormsCreation, setAlbumFormsCreation] = useState<AlbumData[]>([]);

  const { loading } = useProtectedRoute("ADMIN");

  const fetchArtist = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/artists?t=${Date.now()}`, {
        cache: "no-store",
      });
      
      if (!response.ok) {
        throw new Error("Impossible de charger les artistes");
      }

      const artists = await response.json();
      const foundArtist = artists.find((a: Artist) => a.id === artistId);
      
      if (!foundArtist) {
        throw new Error("Artiste non trouvé");
      }

      setArtist(foundArtist);
      setBio(foundArtist.bio || "");
      
      const parsedLinks = foundArtist.socialLinks
        ? typeof foundArtist.socialLinks === "string"
          ? JSON.parse(foundArtist.socialLinks)
          : foundArtist.socialLinks
        : [];
      setLinks(parsedLinks);
      setAlbumFormsUpdate(foundArtist.albums || []);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'artiste:", error);
      toast.error("Impossible de charger l'artiste");
      router.push("/admin/artist");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (artistId) {
      fetchArtist();
    }
  }, [artistId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!artist) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const genre = formData.get("genre") as string;
    const imageFile = formData.get("imageUrl") as File;
    const videoUrl = formData.get("videoUrl") as string;
    const codePlayer = formData.get("codePlayer") as string;
    const urlPlayer = formData.get("urlPlayer") as string;

    if (!name?.trim()) {
      toast.error("Le nom de l'artiste est obligatoire");
      return;
    }
    if (!genre?.trim()) {
      toast.error("Le genre est obligatoire");
      return;
    }

    try {
      setIsSaving(true);

      const validUpdatedAlbums = albumFormsUpdate.filter(
        (album) => album.title?.trim() && album.releaseDate && album.imageUrl
      );

      const validNewAlbums = albumFormsCreation.filter(
        (album) => album.title?.trim() && album.releaseDate && album.imageUrl
      );

      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("socialLinks", JSON.stringify(links));
      formData.append("genre", genre);
      formData.append("videoUrl", videoUrl);
      formData.append("codePlayer", codePlayer);
      formData.append("urlPlayer", urlPlayer);

      await updateArtist(artist.id, formData, artist.imageUrl);

      // Mise à jour des albums existants
      for (const album of validUpdatedAlbums) {
        const albumFormData = new FormData();
        albumFormData.append("title", album.title);
        albumFormData.append("releaseDate", album.releaseDate.toISOString());
        albumFormData.append("links", JSON.stringify(album.links || []));

        await updateAlbum(album.id, albumFormData, album.imageUrl);
      }

      // Création des nouveaux albums
      for (const album of validNewAlbums) {
        const albumFormData = new FormData();
        albumFormData.append("title", album.title);
        albumFormData.append("artistId", artist.id);
        albumFormData.append(
          "releaseDate",
          new Date(album.releaseDate).toISOString()
        );

        if (album.imageUrl) {
          if (album.imageUrl instanceof File) {
            albumFormData.append("imageFile", album.imageUrl);
          } else {
            const response = await fetch(album.imageUrl);
            const blob = await response.blob();
            const file = new File([blob], "album-image.jpg", {
              type: "image/jpeg",
            });
            albumFormData.append("imageFile", file);
          }
        }

        await createAlbum(albumFormData, album.links || []);
      }

      toast.success("Artiste mis à jour avec succès !");
      
      // Recharger les données
      await fetchArtist();
      
      // Réinitialiser les formulaires de création
      setAlbumFormsCreation([]);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Une erreur est survenue lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArtist = async () => {
    if (!artist) return;

    try {
      setIsSaving(true);
      await deleteArtist(artist.id);
      toast.success("Artiste supprimé avec succès");
      router.push("/admin/artist");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de l'artiste");
      setIsSaving(false);
    }
  };

  const handleDeleteAlbum = async (album: Album) => {
    try {
      const { deleteAlbum } = await import("@/app/api/albums/albums");
      await deleteAlbum(album);
      toast.success("Album supprimé");
      await fetchArtist();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'album:", error);
      toast.error("Erreur lors de la suppression de l'album");
    }
  };

  const handleUpdateAlbum = (album: Album, index: number) => {
    setAlbumFormsUpdate((prev) =>
      prev.map((a, i) => (i === index ? album : a))
    );
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-perso-bg text-perso-white-one p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-perso-white-one"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-perso-bg text-perso-white-one p-6">
        <p>Artiste non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-perso-bg text-perso-white-one">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push("/admin/artist")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            ← Retour à la liste
          </button>
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Supprimer l'artiste
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6">Éditer : {artist.name}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ArtistBasicInfoForm artist={artist} />

          <ArtistBioEditor bio={bio} onBioChange={setBio} />

          <SocialLinksEditor links={links} onLinksChange={setLinks} />

          <ExistingAlbumsSection
            albums={albumFormsUpdate}
            onUpdate={handleUpdateAlbum}
            onDelete={handleDeleteAlbum}
          />

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Ajouter des albums</h2>
            <NewAlbumForm
              albumForms={albumFormsCreation}
              setAlbumForms={setAlbumFormsCreation}
            />
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.push("/admin/artist")}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-perso-green hover:bg-perso-green/80 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>

        <DeleteConfirmModal
          isOpen={deleteDialogOpen}
          itemName={artist.name}
          onConfirm={handleDeleteArtist}
          onCancel={() => setDeleteDialogOpen(false)}
          isDeleting={isSaving}
        />
      </div>
    </div>
  );
};

export default ArtistEditPage;
