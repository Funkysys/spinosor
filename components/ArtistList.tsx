"use client";

import { deleteAlbum } from "@/app/api/action/albums/albums";
import { ArtistWithAlbums, Link } from "@/types";
import { Album } from "@prisma/client";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AlbumCreation, { AlbumData } from "./AlbumCreation";
import AlbumUpdate from "./AlbumUpdate";

// Import ReactQuill dynamiquement avec styles
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return RQ;
  },
  { ssr: false }
);

// Types
interface ArtistListProps {
  artists: ArtistWithAlbums[];
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

interface EditState {
  bio: string;
  links: Link[];
  albumFormsUpdate: Album[];
  albumFormsCreation: AlbumData[];
}

interface EditStates {
  [key: string]: EditState;
}

// Components
const LoadingState = () => (
  <div className="animate-pulse p-4 bg-gray-800 rounded-lg">
    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
  </div>
);

const SocialLinks: React.FC<{
  links: Link[];
  onRemove?: (id: number) => void;
  onChange?: {
    name: (data: any, link: Link) => void;
    url: (data: any, link: Link) => void;
  };
  isEditing?: boolean;
}> = ({ links, onRemove, onChange, isEditing }) => (
  <div className="mt-4">
    <h4 className="text-lg font-semibold mb-2">Liens sociaux</h4>
    {links.length > 0 ? (
      links.map((link) => (
        <div key={link.id} className={isEditing ? "grid md:grid-cols-2 gap-2 mb-4" : "mb-2"}>
          {isEditing ? (
            <>
              <div>
                <label className="text-sm text-slate-400">Nom :</label>
                <input
                  value={link.name}
                  type="text"
                  placeholder="Nom du lien"
                  onChange={(e) => onChange?.name(e, link)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">URL :</label>
                <div className="flex">
                  <input
                    value={link.url}
                    type="url"
                    placeholder="URL du lien"
                    onChange={(e) => onChange?.url(e, link)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => onRemove?.(link.id)}
                    className="ml-2 text-red-500"
                  >
                    x
                  </button>
                </div>
              </div>
            </>
          ) : (
            link.url && link.name && (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                {link.name}
              </a>
            )
          )}
        </div>
      ))
    ) : (
      <p className="text-gray-400">Aucun lien social disponible.</p>
    )}
  </div>
);

// Main Component
const ArtistList: React.FC<ArtistListProps> = ({ artists, onDelete, isLoading }) => {
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStates, setEditStates] = useState<EditStates>({});

  // Initialize edit states for all artists
  useEffect(() => {
    const initialStates: EditStates = {};
    artists.forEach((artist) => {
      let socialLinks: Link[] = [{ id: 1, name: "", url: "" }];

      if (artist.socialLinks) {
        try {
          // S'assurer que socialLinks est une chaîne JSON valide
          const linksStr = typeof artist.socialLinks === 'string' 
            ? artist.socialLinks 
            : JSON.stringify(artist.socialLinks);
          
          const parsedLinks = JSON.parse(linksStr);
          if (Array.isArray(parsedLinks)) {
            socialLinks = parsedLinks.map(link => ({
              id: link.id || Math.random(),
              name: link.name || "",
              url: link.url || ""
            }));
          }
        } catch (error) {
          console.error("Error parsing social links:", error);
        }
      }

      initialStates[artist.id] = {
        bio: artist.bio || "",
        links: socialLinks,
        albumFormsUpdate: artist.albums || [],
        albumFormsCreation: [],
      };
    });
    setEditStates(initialStates);
    setMounted(true);
  }, [artists]);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  // Handlers
  const handleStartEditing = (artist: ArtistWithAlbums) => {
    setEditingId(artist.id);
  };

  const handleUpdateArtist = async (e: React.FormEvent, artist: ArtistWithAlbums) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const artistState = editStates[artist.id];

    // Validation des champs de l'artiste
    const name = formData.get('title') as string;
    const genre = formData.get('genre') as string;
    const imageFile = formData.get('imageUrl') as File;

    if (!name?.trim()) {
      alert("Le nom de l'artiste est obligatoire");
      return;
    }
    if (!genre?.trim()) {
      alert("Le genre est obligatoire");
      return;
    }
    if (!imageFile && !artist.imageUrl) {
      alert("L'image est obligatoire");
      return;
    }

    // Validation des albums existants
    for (const album of artistState.albumFormsUpdate) {
      if (!album.title?.trim()) {
        alert("Le titre de l'album est obligatoire pour tous les albums");
        return;
      }
      if (!album.releaseDate) {
        alert("La date de sortie est obligatoire pour tous les albums");
        return;
      }
      if (!album.imageUrl) {
        alert("L'image est obligatoire pour tous les albums");
        return;
      }
    }

    // Validation des nouveaux albums
    for (const album of artistState.albumFormsCreation) {
      if (!album.title?.trim()) {
        alert("Le titre est obligatoire pour les nouveaux albums");
        return;
      }
      if (!album.releaseDate) {
        alert("La date de sortie est obligatoire pour les nouveaux albums");
        return;
      }
      if (!album.imageUrl) {
        alert("L'image est obligatoire pour les nouveaux albums");
        return;
      }
    }

    formData.append("bio", artistState.bio);
    formData.append("socialLinks", JSON.stringify(artistState.links));

    // TODO: Implement the rest of the update logic
    setEditingId(null);
  };

  const handleUpdateAlbum = (album: Album, index: number, artistId: string) => {
    setEditStates((prev) => ({
      ...prev,
      [artistId]: {
        ...prev[artistId],
        albumFormsUpdate: prev[artistId].albumFormsUpdate.map((a, i) =>
          i === index ? album : a
        ),
      },
    }));
  };

  const handleDeleteAlbum = async (album: Album, artistId: string) => {
    await deleteAlbum(album);
    setEditStates((prev) => ({
      ...prev,
      [artistId]: {
        ...prev[artistId],
        albumFormsUpdate: prev[artistId].albumFormsUpdate.filter((a) => a.id !== album.id),
      },
    }));
  };

  const handleAddNewAlbum = (artistId: string) => {
    setEditStates((prev) => ({
      ...prev,
      [artistId]: {
        ...prev[artistId],
        albumFormsCreation: [
          ...prev[artistId].albumFormsCreation,
          {
            title: "",
            imageUrl: null,
            releaseDate: new Date().toISOString().split("T")[0],
            links: [],
            artistId,
          },
        ],
      },
    }));
  };

  const handleAlbumCreationChange = (data: AlbumData, index: number, artistId: string) => {
    setEditStates((prev) => ({
      ...prev,
      [artistId]: {
        ...prev[artistId],
        albumFormsCreation: prev[artistId].albumFormsCreation.map((a, i) =>
          i === index ? { ...data, artistId } : a
        ),
      },
    }));
  };

  // Render
  return (
    <div className="space-y-8">
      {artists.map((artist) => {
        const artistState = editStates[artist.id];
        if (!artistState) return null;

        return (
          <div key={artist.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            {editingId === artist.id ? (
              <form onSubmit={(e) => handleUpdateArtist(e, artist)} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">Nom</label>
                  <input
                    name="title"
                    defaultValue={artist.name}
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400">Bio</label>
                  {mounted && (
                    <div className="bg-gray-900 rounded">
                      <ReactQuill
                        value={artistState.bio}
                        onChange={(value) =>
                          setEditStates((prev) => ({
                            ...prev,
                            [artist.id]: { ...prev[artist.id], bio: value },
                          }))
                        }
                        theme="snow"
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            ['link'],
                            ['clean']
                          ],
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-slate-400">Genre</label>
                  <input
                    name="genre"
                    defaultValue={artist.genre || ""}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400">Image</label>
                  <input
                    type="file"
                    name="imageUrl"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                </div>

                <div className="mt-4">
                  <h4 className="text-lg font-bold mb-2">Albums</h4>
                  <div className="space-y-4">
                    {artistState.albumFormsUpdate.map((album, index) => (
                      <div key={album.id} className="bg-gray-700 p-4 rounded">
                        <AlbumUpdate
                          albumData={album}
                          artistId={artist.id}
                          onAlbumDataChange={(data) => handleUpdateAlbum(data, index, artist.id)}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteAlbum(album, artist.id)}
                          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}

                    {artistState.albumFormsCreation.map((albumData, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded">
                        <AlbumCreation
                          key={index}
                          artistId={artist.id}
                          onAlbumDataChange={(data) => handleAlbumCreationChange(data, index, artist.id)}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddNewAlbum(artist.id)}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Ajouter un album
                  </button>
                </div>

                <SocialLinks
                  links={artistState.links}
                  isEditing={true}
                  onRemove={(id) =>
                    setEditStates((prev) => ({
                      ...prev,
                      [artist.id]: {
                        ...prev[artist.id],
                        links: prev[artist.id].links.filter((link) => link.id !== id),
                      },
                    }))
                  }
                  onChange={{
                    name: (e, link) =>
                      setEditStates((prev) => ({
                        ...prev,
                        [artist.id]: {
                          ...prev[artist.id],
                          links: prev[artist.id].links.map((l) =>
                            l.id === link.id ? { ...l, name: e.target.value } : l
                          ),
                        },
                      })),
                    url: (e, link) =>
                      setEditStates((prev) => ({
                        ...prev,
                        [artist.id]: {
                          ...prev[artist.id],
                          links: prev[artist.id].links.map((l) =>
                            l.id === link.id ? { ...l, url: e.target.value } : l
                          ),
                        },
                      })),
                  }}
                />

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Sauvegarder
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h3 className="text-2xl font-bold mb-2">{artist.name}</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: artist.bio || "" }}
                  className="prose prose-invert max-w-none"
                />
                {artist.genre && <p className="mt-2">Genre : {artist.genre}</p>}
                {artist.imageUrl && (
                  <Image
                    src={artist.imageUrl}
                    alt={artist.name}
                    width={128}
                    height={128}
                    className="rounded mt-4"
                  />
                )}

                <div className="mt-4">
                  <h4 className="text-lg font-bold mb-2">Albums</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {artist.albums?.map((album) => (
                      <div key={album.id} className="bg-gray-700 p-4 rounded">
                        <h5 className="font-semibold">{album.title}</h5>
                        {album.imageUrl && (
                          <Image
                            src={album.imageUrl}
                            alt={album.title}
                            width={100}
                            height={100}
                            className="rounded mt-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <SocialLinks links={artistState.links} />

                <div className="mt-4 space-x-4">
                  <button
                    onClick={() => onDelete(artist.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => handleStartEditing(artist)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ArtistList;
