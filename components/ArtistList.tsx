import { Link } from "@/types";
import { Artist } from "@prisma/client";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ArtistListProps {
  artist: Artist;
  onDelete: (id: string) => void;
  onUpdate: (id: string, formData: FormData) => void;
}

const ArtistList: React.FC<ArtistListProps> = ({
  artist,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBio, setTempBio] = useState(artist.bio || ""); // Temp value for bio
  const [tempLink, setTempLink] = useState<Link[]>([
    { id: 1, name: "", url: "" },
  ]);

  useEffect(() => {
    if (Array.isArray(artist.socialLinks)) {
      setTempLink(
        artist.socialLinks.map((link: any, index: number) => ({
          id: index + 1,
          name: link.name,
          url: link.url,
        }))
      );
    }
  }, [artist.socialLinks]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("bio", tempBio);

    formData.append("socialLinks", JSON.stringify(tempLink));
    onUpdate(artist.id, formData);
    setIsEditing(false);
  };

  const handleOnChangeLinkName = (data: any, el: Link) => {
    const updatedLinks = tempLink.map((item) =>
      item.id === el.id ? { ...item, name: data.target.value } : item
    );
    setTempLink(updatedLinks);
  };

  const handleOnChangeLinkUrl = (data: any, el: Link) => {
    const updatedLinks = tempLink.map((item) =>
      item.id === el.id ? { ...item, url: data.target.value } : item
    );
    setTempLink(updatedLinks);
  };

  const AddNewLink = () => {
    setTempLink([...tempLink, { id: tempLink.length + 1, name: "", url: "" }]);
  };

  const removeLink = (id: number) => {
    setTempLink(tempLink.filter((link) => link.id !== id));
  };

  return (
    <li className="bg-gray-800 p-5 mb-4 rounded-lg shadow-lg">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <label htmlFor="name" className="text-sm text-slate-400">
            Name
          </label>
          <input
            type="text"
            name="name"
            defaultValue={artist.name}
            required
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />

          <label htmlFor="bio" className="text-sm text-slate-400">
            Bio
          </label>
          <ReactQuill
            value={tempBio}
            onChange={setTempBio}
            className="mb-4 bg-gray-900 border border-gray-600 text-perso-white-one rounded"
            theme="snow"
          />

          <label htmlFor="genre" className="text-sm text-slate-400">
            Genre
          </label>
          <input
            type="text"
            name="genre"
            defaultValue={artist.genre || ""}
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />
          <label htmlFor="videoUrl" className="underline mb-3">
            Video
          </label>
          <input
            type="text"
            name="videoUrl"
            placeholder="Video link"
            defaultValue={artist.videoUrl || ""}
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />
          <label htmlFor="codePlayer" className="underline mb-3">
            code_player
          </label>
          <input
            type="text"
            name="codePlayer"
            placeholder="Code player like 1755679268"
            defaultValue={artist.codePlayer || ""}
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />
          <label htmlFor="urlPlayer" className="underline mb-3">
            Url_Player
          </label>
          <input
            type="text"
            name="urlPlayer"
            placeholder="url player "
            defaultValue={artist.urlPlayer || ""}
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />
          <label htmlFor="imageUrl" className="text-sm text-slate-400">
            Image
          </label>
          <input
            type="file"
            name="imageUrl"
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />

          {tempLink.map((el: Link, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-2 mb-4">
              <div>
                <label htmlFor={el.name} className="text-sm text-slate-400">
                  Nom :
                </label>
                <input
                  value={el.name}
                  type="text"
                  placeholder="Nom du lien"
                  onChange={(data) => handleOnChangeLinkName(data, el)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                />
              </div>
              <div>
                <label
                  htmlFor={`url-${el.id}`}
                  className="text-sm text-slate-400"
                >
                  URL :
                </label>
                <div className="flex">
                  <input
                    value={el.url}
                    type="url"
                    placeholder="URL du lien"
                    onChange={(data) => handleOnChangeLinkUrl(data, el)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(el.id)}
                    className="ml-2 text-red-500"
                  >
                    x
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex mb-5">
            <button
              type="button"
              onClick={AddNewLink}
              className="border-1 px-4 py-2 rounded-md bg-yellow-300 text-black hover:bg-yellow-500"
            >
              Ajouter un autre lien ?
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
          >
            Mettre à jour
          </button>
          <button
            type="button"
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setIsEditing(false)}
          >
            Annuler
          </button>
        </form>
      ) : (
        <>
          <h3 className="text-2xl font-bold mb-2">{artist.name}</h3>
          <div dangerouslySetInnerHTML={{ __html: artist.bio || "" }} />
          <p>Genre : {artist.genre}</p>
          {artist.imageUrl && (
            <Image
              src={artist.imageUrl || "/default_artist.png"}
              alt={artist.name}
              width={128}
              height={128}
              className="rounded"
            />
          )}
          <div>
            <h4 className="mt-3 text-lg font-semibold">Liens sociaux :</h4>
            {tempLink.length > 0 ? (
              tempLink.map((link) => (
                <div key={link.id}>
                  <a href={link.url} target="_blank" className="text-blue-400">
                    {link.name}
                  </a>
                </div>
              ))
            ) : (
              <p>Aucun lien social disponible.</p>
            )}
          </div>
          {!isEditing && (
            <>
              <button
                className="mt-5 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
                onClick={() => onDelete(artist.id)}
              >
                Supprimer
              </button>
              <button
                className="ml-4 mt-5 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400"
                onClick={() => setIsEditing(true)}
              >
                Modifier
              </button>
            </>
          )}
        </>
      )}
    </li>
  );
};

export default ArtistList;
