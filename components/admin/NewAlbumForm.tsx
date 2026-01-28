"use client";

import { AlbumData } from "@/components/AlbumCreation";
import { Prisma } from "@prisma/client";
import { useState } from "react";

interface Link {
  id: number;
  name: string;
  url: string;
}

interface NewAlbumFormProps {
  albumForms: AlbumData[];
  setAlbumForms: (albums: AlbumData[]) => void;
}

export const NewAlbumForm: React.FC<NewAlbumFormProps> = ({
  albumForms,
  setAlbumForms,
}) => {
  const [currentAlbum, setCurrentAlbum] = useState<AlbumData>({
    title: "",
    imageUrl: null,
    releaseDate: "",
    links: [] as Prisma.JsonArray,
  });
  const [tempLinks, setTempLinks] = useState<Link[]>([]);

  const handleAddAlbum = () => {
    if (
      !currentAlbum.title ||
      !currentAlbum.releaseDate ||
      !currentAlbum.imageUrl
    ) {
      alert(
        "Veuillez remplir tous les champs obligatoires (titre, date, image)",
      );
      return;
    }

    setAlbumForms([
      ...albumForms,
      {
        ...currentAlbum,
        links: tempLinks.map((link) => ({
          ...link,
        })) as unknown as Prisma.JsonArray,
      },
    ]);

    // Réinitialiser le formulaire
    setCurrentAlbum({
      title: "",
      imageUrl: null,
      releaseDate: "",
      links: [] as Prisma.JsonArray,
    });
    setTempLinks([]);
  };

  const handleRemoveAlbum = (index: number) => {
    setAlbumForms(albumForms.filter((_, i) => i !== index));
  };

  const addLink = () => {
    const newId =
      tempLinks.length > 0 ? Math.max(...tempLinks.map((l) => l.id)) + 1 : 1;
    setTempLinks([...tempLinks, { id: newId, name: "", url: "" }]);
  };

  const removeLink = (id: number) => {
    setTempLinks(tempLinks.filter((link) => link.id !== id));
  };

  const updateLinkName = (id: number, value: string) => {
    setTempLinks(
      tempLinks.map((l) => (l.id === id ? { ...l, name: value } : l)),
    );
  };

  const updateLinkUrl = (id: number, value: string) => {
    setTempLinks(
      tempLinks.map((l) => (l.id === id ? { ...l, url: value } : l)),
    );
  };

  return (
    <div className="space-y-6">
      {/* Formulaire de nouvel album */}
      <div className="border border-gray-600 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Nouvel album</h3>

        <div className="space-y-3">
          <div>
            <label className="block mb-1 text-sm">Titre *</label>
            <input
              type="text"
              value={currentAlbum.title}
              onChange={(e) =>
                setCurrentAlbum({ ...currentAlbum, title: e.target.value })
              }
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              placeholder="Nom de l'album"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Date de sortie *</label>
            <input
              type="date"
              value={currentAlbum.releaseDate}
              onChange={(e) =>
                setCurrentAlbum({
                  ...currentAlbum,
                  releaseDate: e.target.value,
                })
              }
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setCurrentAlbum({ ...currentAlbum, imageUrl: file });
              }}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            />
          </div>

          {/* Liens de l'album */}
          <div className="mt-4">
            <label className="block mb-2 text-sm font-semibold">
              Liens de streaming
            </label>
            {tempLinks.map((link) => (
              <div key={link.id} className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => updateLinkName(link.id, e.target.value)}
                  placeholder="Plateforme (ex: Spotify)"
                  className="p-2 bg-gray-700 border border-gray-600 rounded text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLinkUrl(link.id, e.target.value)}
                    placeholder="URL"
                    className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            >
              + Ajouter un lien
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddAlbum}
            className="w-full mt-4 px-4 py-2 bg-perso-green hover:bg-perso-green/80 rounded"
          >
            Ajouter cet album
          </button>
        </div>
      </div>

      {/* Liste des albums ajoutés */}
      {albumForms.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Albums à créer ({albumForms.length})
          </h3>
          {albumForms.map((album, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-700 rounded"
            >
              <div>
                <p className="font-semibold">{album.title}</p>
                <p className="text-sm text-gray-400">
                  {new Date(album.releaseDate).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveAlbum(index)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
