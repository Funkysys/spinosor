import { deleteAlbum } from "@/app/api/action/albums/albums";
import { ArtistWithAlbums, Link } from "@/types";
import { Album } from "@prisma/client";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import AlbumCreation, { AlbumData } from "./AlbumCreation";
import AlbumUpdate from "./AlbumUpdate";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ArtistListProps {
  artist: ArtistWithAlbums;
  onDelete: (id: string) => void;
  onUpdate: (id: string, formData: FormData) => void;
  updateAlbum: (id: string, formData: FormData, actualImage: string | null) => void;
  createAlbum: (formData: FormData, links: any) => void;
  getArtists: () => Promise<ArtistWithAlbums[]>;
  setArtists: (artists: ArtistWithAlbums[]) => void;
}

const ArtistList: React.FC<ArtistListProps> = ({
  artist,
  onDelete,
  onUpdate,
  updateAlbum,
  createAlbum,
  getArtists,
  setArtists,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBio, setTempBio] = useState(artist.bio || "");
  const [tempLink, setTempLink] = useState<Link[]>([
    { id: 1, name: "", url: "" },
  ]);
  const [albumFormsUpdate, setAlbumFormsUpdate] = useState<Album[]>([]);
  const [albumFormsCreation, setAlbumFormsCreation] = useState<AlbumData[]>([]);

  useEffect(() => {
    if (artist.albums) {
      setAlbumFormsUpdate([]);
    }
  }, [artist.albums]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("bio", tempBio);
    formData.append("socialLinks", JSON.stringify(tempLink));

    const imageFile = formData.get("imageFile") as File | null;

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(imageFile);
      reader.onloadend = async () => {
        formData.append("imageFile", reader.result as string);

        // Mise à jour de l'artiste
        await onUpdate(artist.id, formData);

        // Mise à jour des albums existants
        for (const album of albumFormsUpdate) {
          const albumFormData = new FormData();
          albumFormData.append("title", album.title);
          albumFormData.append("artistId", artist.id);
          albumFormData.append("releaseDate", album.releaseDate.toISOString());

          if (album.imageUrl) {
            albumFormData.append("imageFile", album.imageUrl as unknown as File);
            await updateAlbum(album.id, albumFormData, album.imageUrl);
          }
        }

        // Création des nouveaux albums
        for (const album of albumFormsCreation) {
          const albumFormData = new FormData();
          albumFormData.append("title", album.title);
          albumFormData.append("artistId", artist.id);
          albumFormData.append("releaseDate", album.releaseDate);

          if (album.imageUrl) {
            albumFormData.append("imageFile", album.imageUrl as File);
            await createAlbum(albumFormData, album.links);
          }
        }

        // Rafraîchir la liste des artistes
        const updatedArtists = await getArtists();
        setArtists(updatedArtists);
        setIsEditing(false);
      };
    } else {
      // Mise à jour de l'artiste sans nouvelle image
      await onUpdate(artist.id, formData);

      // Mise à jour des albums existants
      for (const album of albumFormsUpdate) {
        const albumFormData = new FormData();
        albumFormData.append("title", album.title);
        albumFormData.append("artistId", artist.id);
        albumFormData.append("releaseDate", album.releaseDate.toISOString());
        
        if (album.imageUrl && album.imageUrl !== null && typeof album.imageUrl === 'object' && (album.imageUrl as File) instanceof File) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(album.imageUrl);
          reader.onloadend = async () => {
            albumFormData.append("imageFile", reader.result as string);
            await updateAlbum(album.id, albumFormData, album.imageUrl);
          };
        }
      }

      // Création des nouveaux albums
      for (const album of albumFormsCreation) {
        const albumFormData = new FormData();
        albumFormData.append("title", album.title);
        albumFormData.append("artistId", artist.id);
        albumFormData.append("releaseDate", album.releaseDate);
        albumFormData.append("links", JSON.stringify(album.links));

        if (album.imageUrl) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(album.imageUrl as File);
          reader.onloadend = async () => {
            albumFormData.append("imageFile", reader.result as string);
            await createAlbum(albumFormData, album.links);
          };
        }
      }

      // Rafraîchir la liste des artistes
      const updatedArtists = await getArtists();
      setArtists(updatedArtists);
      setIsEditing(false);
    }
  };

  const handleAddNewAlbum = () => {
    setAlbumFormsCreation([...albumFormsCreation, {} as AlbumData]);
  };

  const handleOnChangeLinkName = (data: any, el: Link) => {
    const updatedLinks = tempLink.map((item) =>
      item.id === el.id ? { ...item, name: data.target.value } : item
    );
    setTempLink(updatedLinks);
  };

  const handleDeleteAlbum = async (album: Album) => {
    await deleteAlbum(album);
    const updatedAlbums = artist.albums.filter((elt) => elt.id !== album.id);
    setAlbumFormsUpdate(updatedAlbums);
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

  console.log("albumForms", albumFormsCreation);

  return (
    <li className="bg-gray-800 p-5 mb-4 rounded-lg shadow-lg">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <label htmlFor="title" className="text-sm text-slate-400">
            Title
          </label>
          <input
            data-testid="artist-name-input"
            type="text"
            name="title"
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
            data-testid="artist-image-input"
            type="file"
            name="imageUrl"
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />
          <div className="mt-4">
            <h4 className="text-lg font-bold">Albums</h4>
            {artist.albums?.map((album, index) => (
              <div key={album.id} className="bg-gray-700 p-3 rounded mt-2">
                <AlbumUpdate
                  key={album.id}
                  onAlbumDataChange={(data) => {
                    const updatedForms = [...albumFormsUpdate];
                    updatedForms[index] = data;
                    setAlbumFormsUpdate(updatedForms);
                  }}
                  artistId={artist.id}
                  albumData={album}
                />
                <button
                  onClick={() => handleDeleteAlbum(album)}
                  data-testid="delete-album-button"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}

            {albumFormsCreation.map((albumData, index) => (
              <AlbumCreation
                key={index}
                onAlbumDataChange={(data) => {
                  const updatedForms = [...albumFormsCreation];
                  updatedForms[index] = data;
                  setAlbumFormsCreation(updatedForms);
                }}
                artistId={artist.id}
              />
            ))}
            <button
              type="button"
              onClick={handleAddNewAlbum}
              className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
            >
              Add Album
            </button>
          </div>

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
            data-testid="save-artist-button"
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
          >
            Mettre à jour
          </button>
          <button
            data-testid="cancel-edit-button"
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
                data-testid="delete-artist-button"
                className="mt-5 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => onDelete(artist.id)}
              >
                Supprimer
              </button>
              <button
                data-testid="edit-artist-button"
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
