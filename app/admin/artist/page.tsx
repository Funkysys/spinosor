"use client";

import { createAlbum, getAlbums, updateAlbum } from "@/app/api/action/albums/albums";
import {
  createArtist,
  deleteArtist,
  getArtists,
  updateArtist,
} from "@/app/api/action/artists/artists";
import AlbumCreation, { AlbumData } from "@/components/AlbumCreation";
import ArtistList from "@/components/ArtistList";
import { Link } from "@/types";
import { Album, Artist, Prisma } from "@prisma/client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ArtistWithAlbums extends Artist {
  albums: Album[];
}

const ArtistsDashboard: React.FC = () => {
  const [artists, setArtists] = useState<ArtistWithAlbums[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [links, setLinks] = useState<Prisma.JsonArray>([]);
  const [tempLink, setTempLink] = useState<Link[]>([
    { id: 1, name: "", url: "" },
  ]);
  const [albumForms, setAlbumForms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bio, setBio] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

        console.log("Artistes récupérés:", artistList);

        const formattedArtists = artistList.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
          bio: artist.bio ?? null,
          genre: artist.genre ?? null,
          imageUrl: artist.imageUrl ?? null,
          videoUrl: artist.videoUrl ?? null,
          codePlayer: artist.codePlayer ?? null,
          urlPlayer: artist.urlPlayer ?? null,
          socialLinks: artist.socialLinks ?? null,
          albums: albumList.filter((album) => album.artistId === artist.id),
        }));

        setArtists(formattedArtists);
        setAlbums(albumList);
      } catch (error) {
        console.error("Erreur lors de la récupération des artistes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistsAndAlbums();
  }, []);
  const resetForm = () => {
    setBio("");
  };

  const handleAlbumDataChange = useCallback(
    (index: number, albumData: AlbumData) => {
      const updatedAlbumForms = [...albumForms];
      updatedAlbumForms[index] = albumData;
      setAlbumForms(updatedAlbumForms);
    },
    [albumForms]
  );

  const handleArtistCreation = async (formData: FormData) => {
    setIsLoading(true);
    setLinks(tempLink as Prisma.JsonArray);

    formData.append("bio", bio);
    const imageFile = formData.get("imageFile") as File | null;

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(imageFile);
      reader.onloadend = async () => {
        formData.append("imageFile", reader.result as string);

        const artist = await createArtist(formData, links);
        if (!artist || albumForms.length === 0) {
          return;
        }
        for (const album of albumForms) {
          const albumFormData = new FormData();
          albumFormData.append("name", album.title);
          albumFormData.append("artistId", artist.id);
          albumFormData.append("releaseDate", album.releaseDate);

          if (album.imageUrl) {
            albumFormData.append("imageFile", album.imageUrl as File); // Directement le fichier

            await createAlbum(albumFormData, album.links);
          }
        }

        const updatedArtists = await getArtists();
        setArtists(updatedArtists as ArtistWithAlbums[]);
        resetForm();
      };
    } else {
      const artist = await createArtist(formData, links);
      for (const album of albumForms) {
        const albumFormData = new FormData();
        albumFormData.append("name", album.title);
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

      const updatedArtists = await getArtists();
      setArtists(updatedArtists as ArtistWithAlbums[]);
      resetForm();
    }
  };

  const handleArtistDeletion = async (id: string) => {
    setIsLoading(true);
    await deleteArtist(id);
    const result = await getArtists();
    setArtists(result as ArtistWithAlbums[]);
    setIsLoading(false);
  };

  const handleOnChangeLinkName = (data: any, el: Link) => {
    const tempLinkName = tempLink.map((item) => {
      if (item.id === el.id) {
        return { ...item, name: data.target.value };
      }
      return item;
    });
    setTempLink(tempLinkName);
    setLinks(tempLinkName as Prisma.JsonArray);
  };
  const handleOnChangeLinkUrl = (data: any, el: Link) => {
    const tempLinkUrl = tempLink.map((item) => {
      if (item.id === el.id) {
        return { ...item, url: data.target.value };
      }
      return item;
    });
    setTempLink(tempLinkUrl);
    setLinks(tempLinkUrl as Prisma.JsonArray);
  };

  const AddNewLink = () => {
    setTempLink([...tempLink, { id: tempLink.length + 1, name: "", url: "" }]);
  };

  const handleCreateAnotherAlbum = () => {
    setAlbumForms([...albumForms, {}]); // Ajoute un nouveau formulaire vide
  };


  return (
    <div className="min-h-screen p-5 bg-perso-bg text-perso-white-one">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Gérer les Artistes
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleArtistCreation(formData);
        }}
        className="bg-gray-800 p-5 rounded-lg shadow-lg mb-10"
      >
        <label htmlFor="name" className="underline mb-3">
          Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Nom de l'artiste"
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <label htmlFor="bio" className="underline mb-3">
          Bio
        </label>
        {isClient && (
          <ReactQuill
            value={bio}
            onChange={setBio}
            className="mb-4 bg-gray-900 border border-gray-600 text-perso-white-one rounded"
            theme="snow"
          />
        )}
        <label htmlFor="genre" className="underline mb-3">
          Genre
        </label>
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <label htmlFor="imageFile" className="underline mb-3">
          Image
        </label>
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <label htmlFor="videoUrl" className="underline mb-3">
          Video
        </label>
        <input
          type="text"
          name="videoUrl"
          placeholder="Video link"
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <label htmlFor="codePlayer" className="underline mb-3">
          Code Player
        </label>
        <input
          type="text"
          name="codePlayer"
          placeholder="code player like 1755679268"
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <label htmlFor="urlPlayer" className="underline mb-3">
          Url Player
        </label>
        <input
          type="text"
          name="urlPlayer"
          placeholder="url player"
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <label htmlFor="Links" className="underline mb-3">
          Links{" "}
        </label>
        <h3 className="text-lg font-bold mt-5 mb-3">Créer un albums</h3>
        {albumForms.map((_, index) => (
          <AlbumCreation
            key={index}
            onAlbumDataChange={(albumData) =>
              handleAlbumDataChange(index, albumData)
            }
            artistId={selectedArtistId || ""}
          />
        ))}

        <button
          type="button"
          onClick={handleCreateAnotherAlbum}
          className="my-5 bg-perso-yellow-two text-perso-white-two px-4 py-2 rounded hover:bg-perso-yellow-one hover:text-perso-bg"
        >
          Créer un autre album
        </button>
        {tempLink.map((el: Link, index) => (
          <div key={index} className="grid md:grid-cols-2 gap-2 mt-2">
            <div>
              <label
                htmlFor="name"
                id="name"
                className="text-sm text-perso-white-two mb-3"
              >
                Name :
              </label>
              <input
                type="text"
                placeholder="Link's name"
                onChange={(data) => handleOnChangeLinkName(data, el)}
                required={false}
                className="bg-gray-700 border border-gray-600 rounded-md px-2 ml-2"
              />
            </div>
            <div>
              <label
                htmlFor="link"
                id="link"
                className="text-sm text-perso-white-two mb-3"
              >
                Liens :
              </label>
              <input
                type="text"
                placeholder="Link's url"
                onChange={(data) => handleOnChangeLinkUrl(data, el)}
                required={false}
                className="bg-gray-700 border border-gray-600 rounded-md px-2 ml-2"
              />
            </div>
          </div>
        ))}
        <div className="flex mb-5">
          <button
            type="button"
            onClick={AddNewLink}
            className="mt-5 bg-perso-yellow-two text-perso-white-two px-4 py-2 rounded hover:bg-perso-yellow-one hover:text-perso-bg"
          >
            Ajouter un lien ?
          </button>
        </div>
        <button
          type="submit"
          className="mt-5 bg-green-500 text-perso-white-two px-4 py-2 rounded hover:bg-green-400"
        >
          Créer Artiste
        </button>
      </form>

      {/* Liste des artistes */}
      <div className="mt-10">
        <h2 className="text-xl mb-3">Artistes existants</h2>
        <ul>
          {" "}
          {artists.map((artist) => (
            <ArtistList
              key={artist.id}
              artist={artist}
              onDelete={handleArtistDeletion}
              onUpdate={async (id: string, formData: FormData) => {
                await updateArtist(id, formData, artist.imageUrl);
                const result = await getArtists();
                setArtists(result as ArtistWithAlbums[]);
              }}
              updateAlbum={async (id: string, formData: FormData, actualImage: string | null) => {
                await updateAlbum(id, formData, actualImage);
              }}
              createAlbum={createAlbum}
              getArtists={getArtists}
              setArtists={setArtists}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
export default ArtistsDashboard;
