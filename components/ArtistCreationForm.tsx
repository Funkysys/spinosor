"use client";

import { Link } from "@/types";
import { Prisma } from "@prisma/client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import AlbumCreation, { AlbumData } from "./AlbumCreation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ArtistCreationFormProps {
  onSubmit: (
    formData: FormData,
    links: Prisma.JsonArray,
    bio: string,
    albumForms: AlbumData[]
  ) => Promise<void>;
  isLoading: boolean;
}

const ArtistCreationForm: React.FC<ArtistCreationFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [bio, setBio] = useState<string>("");
  const [tempLink, setTempLink] = useState<Link[]>([
    { id: 1, name: "", url: "" },
  ]);
  const [albumForms, setAlbumForms] = useState<AlbumData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Gestionnaire des liens sociaux
  const handleOnChangeLinkName = (
    data: React.ChangeEvent<HTMLInputElement>,
    el: Link
  ) => {
    const tempLinkName = tempLink.map((item) =>
      item.id === el.id ? { ...item, name: data.target.value } : item
    );
    setTempLink(tempLinkName);
  };

  const handleOnChangeLinkUrl = (
    data: React.ChangeEvent<HTMLInputElement>,
    el: Link
  ) => {
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-400">{`Nom de l'artiste`}</label>
          <input
            type="text"
            name="name"
            placeholder="Nom de l'artiste"
            required
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">{`Genre musical`}</label>
          <input
            type="text"
            name="genre"
            placeholder="Genre musical"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">{`Bio de l'artiste`}</label>
          {typeof window !== "undefined" && mounted && (
            <div className="bg-gray-400 rounded border border-gray-600">
              <ReactQuill
                className="text-slate-900"
                value={bio}
                onChange={setBio}
                theme="snow"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link"],
                    ["clean"],
                  ],
                }}
              />
            </div>
          )}
        </div>
        <div>
          <label className="text-sm text-slate-400">{`Image de l'artiste`}</label>
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">{`URL de la vidéo`}</label>
          <input
            type="text"
            name="videoUrl"
            placeholder="URL de la vidéo"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">{`Code du player`}</label>
          <input
            type="text"
            name="codePlayer"
            placeholder="Code du player"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">{`URL du player`}</label>
          <input
            type="text"
            name="urlPlayer"
            placeholder="URL du player"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>
      </div>

      {/* Liens sociaux */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Liens sociaux</h3>
        {tempLink.map((el) => (
          <div key={el.id} className="flex gap-2">
            <input
              type="text"
              value={el.name}
              onChange={(e) => handleOnChangeLinkName(e, el)}
              placeholder="Nom du réseau social"
              className="w-1/2 p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
            <input
              type="text"
              value={el.url}
              onChange={(e) => handleOnChangeLinkUrl(e, el)}
              placeholder="URL"
              className="w-1/2 p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addNewLink}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Ajouter un lien
        </button>
      </div>

      {/* Albums */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Albums</h3>
        {albumForms.map((_, index) => (
          <AlbumCreation
            key={index}
            onAlbumDataChange={(data) => handleAlbumDataChange(index, data)}
          />
        ))}
        <button
          type="button"
          onClick={handleCreateAnotherAlbum}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Ajouter un album
        </button>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-2 bg-yellow-500 text-gray-800 rounded hover:bg-yellow-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Création en cours..." : "Créer l'artiste"}
        </button>
      </div>
    </form>
  );
};

export default ArtistCreationForm;
