"use client";

import { deleteAlbum } from "@/app/api/action/albums/albums";
import { ArtistWithAlbums, Link } from "@/types";
import { Album } from "@prisma/client";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import AlbumCreation, { AlbumData } from "./AlbumCreation";
import AlbumUpdate from "./AlbumUpdate";

// Import ReactQuill dynamically with no SSR
const ReactQuill = dynamic(() => import("react-quill"), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-700 animate-pulse rounded"></div>
});

interface ArtistListProps {
  artists: ArtistWithAlbums[];
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

const ArtistList: React.FC<ArtistListProps> = ({ artists, onDelete, isLoading }) => {
  // Use useEffect to initialize state after component mounts
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStates, setEditStates] = useState<{
    [key: string]: {
      bio: string;
      links: Link[];
      albumFormsUpdate: Album[];
      albumFormsCreation: AlbumData[];
    };
  }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  // Initialize edit state for an artist
  const initializeEditState = (artist: ArtistWithAlbums) => {
    if (!editStates[artist.id]) {
      setEditStates((prev) => ({
        ...prev,
        [artist.id]: {
          bio: artist.bio || "",
          links: [{ id: 1, name: "", url: "" }],
          albumFormsUpdate: artist.albums || [],
          albumFormsCreation: [],
        },
      }));
    }
  };

  const handleStartEditing = (artist: ArtistWithAlbums) => {
    initializeEditState(artist);
    setEditingId(artist.id);
  };

  const handleCancelEditing = () => {
    setEditingId(null);
  };

  const handleUpdate = async (e: React.FormEvent, artist: ArtistWithAlbums) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("bio", editStates[artist.id].bio);
    formData.append("socialLinks", JSON.stringify(editStates[artist.id].links));

    const imageFile = formData.get("imageFile") as File | null;

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(imageFile);
      reader.onloadend = async () => {
        formData.append("imageFile", reader.result as string);

        // Mise à jour de l'artiste
        // await onUpdate(artist.id, formData);

        // Mise à jour des albums existants
        for (const album of editStates[artist.id].albumFormsUpdate) {
          const albumFormData = new FormData();
          albumFormData.append("title", album.title);
          albumFormData.append("artistId", artist.id);
          albumFormData.append("releaseDate", album.releaseDate.toISOString());

          // Ajouter les liens à la mise à jour
          if (album.links) {
            albumFormData.append("links", JSON.stringify(album.links));
          }

          if (album.imageUrl && album.imageUrl !== null && typeof album.imageUrl === 'object' && (album.imageUrl as File) instanceof File) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(album.imageUrl);
            reader.onloadend = async () => {
              albumFormData.append("imageFile", reader.result as string);
              // await updateAlbum(album.id, albumFormData, album.imageUrl);
            };
          } else {
            // Si pas de nouvelle image, mettre à jour avec les autres données
            // await updateAlbum(album.id, albumFormData, album.imageUrl);
          }
        }

        // Création des nouveaux albums
        for (const album of editStates[artist.id].albumFormsCreation) {
          const albumFormData = new FormData();
          albumFormData.append("title", album.title);
          albumFormData.append("artistId", artist.id);
          albumFormData.append("releaseDate", album.releaseDate);

          if (album.imageUrl) {
            albumFormData.append("imageFile", album.imageUrl as File);
            // await createAlbum(albumFormData, album.links);
          }
        }

        // Rafraîchir la liste des artistes
        // const updatedArtists = await getArtists();
        // setArtists(updatedArtists);
        handleCancelEditing();
      };
    } else {
      // Mise à jour de l'artiste sans nouvelle image
      // await onUpdate(artist.id, formData);

      // Mise à jour des albums existants
      for (const album of editStates[artist.id].albumFormsUpdate) {
        const albumFormData = new FormData();
        albumFormData.append("title", album.title);
        albumFormData.append("artistId", artist.id);
        albumFormData.append("releaseDate", album.releaseDate.toISOString());
        
        // Ajouter les liens à la mise à jour
        if (album.links) {
          albumFormData.append("links", JSON.stringify(album.links));
        }

        if (album.imageUrl && album.imageUrl !== null && typeof album.imageUrl === 'object' && (album.imageUrl as File) instanceof File) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(album.imageUrl);
          reader.onloadend = async () => {
            albumFormData.append("imageFile", reader.result as string);
            // await updateAlbum(album.id, albumFormData, album.imageUrl);
          };
        } else {
          // Si pas de nouvelle image, mettre à jour avec les autres données
          // await updateAlbum(album.id, albumFormData, album.imageUrl);
        }
      }

      // Création des nouveaux albums
      for (const album of editStates[artist.id].albumFormsCreation) {
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
            // await createAlbum(albumFormData, album.links);
          };
        }
      }

      // Rafraîchir la liste des artistes
      // const updatedArtists = await getArtists();
      // setArtists(updatedArtists);
      handleCancelEditing();
    }
  };

  const handleAddNewAlbum = (artist: ArtistWithAlbums) => {
    setEditStates((prev) => ({
      ...prev,
      [artist.id]: {
        ...prev[artist.id],
        albumFormsCreation: [...prev[artist.id].albumFormsCreation, {} as AlbumData],
      },
    }));
  };

  const handleOnChangeLinkName = (data: any, el: Link, artist: ArtistWithAlbums) => {
    const updatedLinks = editStates[artist.id].links.map((item) =>
      item.id === el.id ? { ...item, name: data.target.value } : item
    );
    setEditStates((prev) => ({
      ...prev,
      [artist.id]: {
        ...prev[artist.id],
        links: updatedLinks,
      },
    }));
  };

  const handleDeleteAlbum = async (album: Album, artist: ArtistWithAlbums) => {
    await onDelete(album.id);
    const updatedAlbums = artist.albums.filter((elt) => elt.id !== album.id);
    setEditStates((prev) => ({
      ...prev,
      [artist.id]: {
        ...prev[artist.id],
        albumFormsUpdate: updatedAlbums,
      },
    }));
  };

  const handleOnChangeLinkUrl = (data: any, el: Link, artist: ArtistWithAlbums) => {
    const updatedLinks = editStates[artist.id].links.map((item) =>
      item.id === el.id ? { ...item, url: data.target.value } : item
    );
    setEditStates((prev) => ({
      ...prev,
      [artist.id]: {
        ...prev[artist.id],
        links: updatedLinks,
      },
    }));
  };

  const AddNewLink = (artist: ArtistWithAlbums) => {
    setEditStates((prev) => ({
      ...prev,
      [artist.id]: {
        ...prev[artist.id],
        links: [...prev[artist.id].links, { id: prev[artist.id].links.length + 1, name: "", url: "" }],
      },
    }));
  };

  const removeLink = (id: number, artist: ArtistWithAlbums) => {
    setEditStates((prev) => ({
      ...prev,
      [artist.id]: {
        ...prev[artist.id],
        links: prev[artist.id].links.filter((link) => link.id !== id),
      },
    }));
  };

  return (
    <div className="space-y-8">
      {artists.map((artist) => (
        <div key={artist.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
          {editingId === artist.id ? (
            <form onSubmit={(e) => handleUpdate(e, artist)}>
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
                value={editStates[artist.id].bio}
                onChange={(value) =>
                  setEditStates((prev) => ({
                    ...prev,
                    [artist.id]: {
                      ...prev[artist.id],
                      bio: value,
                    },
                  }))
                }
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
                        const updatedForms = [...editStates[artist.id].albumFormsUpdate];
                        updatedForms[index] = data;
                        setEditStates((prev) => ({
                          ...prev,
                          [artist.id]: {
                            ...prev[artist.id],
                            albumFormsUpdate: updatedForms,
                          },
                        }));
                      }}
                      artistId={artist.id}
                      albumData={album}
                    />
                    <button
                      onClick={() => handleDeleteAlbum(album, artist)}
                      data-testid="delete-album-button"
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {editStates[artist.id].albumFormsCreation.map((albumData, index) => (
                  <AlbumCreation
                    key={index}
                    onAlbumDataChange={(data) => {
                      const updatedForms = [...editStates[artist.id].albumFormsCreation];
                      updatedForms[index] = data;
                      setEditStates((prev) => ({
                        ...prev,
                        [artist.id]: {
                          ...prev[artist.id],
                          albumFormsCreation: updatedForms,
                        },
                      }));
                    }}
                    artistId={artist.id}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => handleAddNewAlbum(artist)}
                  className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
                >
                  Add Album
                </button>
              </div>

              {editStates[artist.id].links.map((el: Link, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-2 mb-4">
                  <div>
                    <label htmlFor={el.name} className="text-sm text-slate-400">
                      Nom :
                    </label>
                    <input
                      value={el.name}
                      type="text"
                      placeholder="Nom du lien"
                      onChange={(data) => handleOnChangeLinkName(data, el, artist)}
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
                        onChange={(data) => handleOnChangeLinkUrl(data, el, artist)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(el.id, artist)}
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
                  onClick={() => AddNewLink(artist)}
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
                onClick={handleCancelEditing}
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
                {mounted && editStates[artist.id]?.links ? (
                  editStates[artist.id].links.length > 0 ? (
                    editStates[artist.id].links.map((link) => (
                      <div key={link.id}>
                        {link.url && link.name && (
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                            {link.name}
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>Aucun lien social disponible.</p>
                  )
                ) : (
                  <p>Chargement des liens...</p>
                )}
              </div>
              <div className="mt-4 space-x-4">
                <button
                  data-testid="delete-artist-button"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => onDelete(artist.id)}
                >
                  Supprimer
                </button>
                <button
                  data-testid="edit-artist-button"
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400"
                  onClick={() => handleStartEditing(artist)}
                >
                  Modifier
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ArtistList;
