"use client";

import { Link } from "@/types";
import { Prisma } from "@prisma/client";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import AlbumCreation, { AlbumData } from "./AlbumCreation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ArtistCreationFormProps {
  onSubmit: (formData: FormData, links: Prisma.JsonArray, bio: string, albumForms: AlbumData[]) => Promise<void>;
  isLoading: boolean;
}

const ArtistCreationForm: React.FC<ArtistCreationFormProps> = ({ onSubmit, isLoading }) => {
  const [bio, setBio] = useState<string>("");
  const [tempLink, setTempLink] = useState<Link[]>([{ id: 1, name: "", url: "" }]);
  const [albumForms, setAlbumForms] = useState<AlbumData[]>([]);

  // Gestionnaire des liens sociaux
  const handleOnChangeLinkName = (data: React.ChangeEvent<HTMLInputElement>, el: Link) => {
    const tempLinkName = tempLink.map((item) =>
      item.id === el.id ? { ...item, name: data.target.value } : item
    );
    setTempLink(tempLinkName);
  };

  const handleOnChangeLinkUrl = (data: React.ChangeEvent<HTMLInputElement>, el: Link) => {
    const tempLinkUrl = tempLink.map((item) =>
      item.id === el.id ? { ...item, url: data.target.value } : item
    );
    setTempLink(tempLinkUrl);
  };

  const addNewLink = () => {
    setTempLink([...tempLink, { id: tempLink.length + 1, name: "", url: "" }]);
  };

  // Gestionnaire des albums
  const handleAlbumDataChange = (index: number, albumData: AlbumData) => {
    const updatedAlbumForms = [...albumForms];
    updatedAlbumForms[index] = albumData;
    setAlbumForms(updatedAlbumForms);
  };

  const handleCreateAnotherAlbum = () => {
    setAlbumForms([...albumForms, {} as AlbumData]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData, tempLink as Prisma.JsonArray, bio, albumForms);
    // Reset form
    setBio("");
    setTempLink([{ id: 1, name: "", url: "" }]);
    setAlbumForms([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nom de l'artiste"
          required
          className="w-full p-2 rounded bg-perso-bg-two text-perso-white-one"
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre musical"
          className="w-full p-2 rounded bg-perso-bg-two text-perso-white-one"
        />
        <div>
          <label className="block mb-2">Bio de l'artiste</label>
          {typeof window !== "undefined" && (
            <ReactQuill
              value={bio}
              onChange={setBio}
              className="bg-perso-bg-two text-perso-white-one"
            />
          )}
        </div>
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          className="w-full p-2 rounded bg-perso-bg-two text-perso-white-one"
        />
        <input
          type="text"
          name="videoUrl"
          placeholder="URL de la vidéo"
          className="w-full p-2 rounded bg-perso-bg-two text-perso-white-one"
        />
        <input
          type="text"
          name="codePlayer"
          placeholder="Code du player"
          className="w-full p-2 rounded bg-perso-bg-two text-perso-white-one"
        />
        <input
          type="text"
          name="urlPlayer"
          placeholder="URL du player"
          className="w-full p-2 rounded bg-perso-bg-two text-perso-white-one"
        />
      </div>

      {/* Liens sociaux */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Liens sociaux</h3>
        {tempLink.map((el) => (
          <div key={el.id} className="flex gap-2">
            <input
              type="text"
              value={el.name}
              onChange={(e) => handleOnChangeLinkName(e, el)}
              placeholder="Nom du réseau social"
              className="w-1/2 p-2 rounded bg-perso-bg-two"
            />
            <input
              type="text"
              value={el.url}
              onChange={(e) => handleOnChangeLinkUrl(e, el)}
              placeholder="URL"
              className="w-1/2 p-2 rounded bg-perso-bg-two"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addNewLink}
          className="px-4 py-2 bg-perso-bg-two rounded hover:bg-opacity-80"
        >
          Ajouter un lien
        </button>
      </div>

      {/* Albums */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Albums</h3>
        {albumForms.map((_, index) => (
          <AlbumCreation
            key={index}
            onAlbumDataChange={(data) => handleAlbumDataChange(index, data)}
          />
        ))}
        <button
          type="button"
          onClick={handleCreateAnotherAlbum}
          className="px-4 py-2 bg-perso-bg-two rounded hover:bg-opacity-80"
        >
          Ajouter un album
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-perso-bg-two rounded hover:bg-opacity-80 disabled:opacity-50"
      >
        {isLoading ? "Création en cours..." : "Créer l'artiste"}
      </button>
    </form>
  );
};

export default ArtistCreationForm;
