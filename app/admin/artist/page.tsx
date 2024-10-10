"use client"; // Assurez-vous que cela est nécessaire

import {
  createArtist,
  deleteArtist,
  getArtists,
  updateArtist,
} from "@/app/api/action/artists/artists";
import ArtistList from "@/components/ArtistList";
import { Link } from "@/types"; // Assurez-vous que le chemin est correct
import { Artist, Prisma } from "@prisma/client";
import { useEffect, useState } from "react";

const ArtistsDashboard: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [links, setLinks] = useState<Prisma.JsonArray>([]);
  const [tempLink, setTempLink] = useState<Link[]>([
    { id: 1, name: "", url: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      const artistList = await getArtists();

      const formattedArtists = artistList.map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        bio: artist.bio ?? null, // Ici, on s'assure que `bio` n'est jamais undefined
        genre: artist.genre ?? null,
        imageUrl: artist.imageUrl ?? null,
        socialLinks: artist.socialLinks ?? null,
      })) as Artist[];
      setArtists(formattedArtists);
    };

    fetchArtists();
  }, []);

  const resetForm = () => {
    setSelectedImage(null);
  };

  const handleArtistCreation = async (formData: FormData) => {
    setIsLoading(true);
    setLinks(tempLink as Prisma.JsonArray);
    const imageFile = formData.get("imageFile") as File | null;

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(imageFile); // Lire le fichier en tant que tableau de bytes
      reader.onloadend = async () => {
        formData.append("imageFile", reader.result as string);
        await createArtist(formData, links);
        resetForm();
        const result = await getArtists();
        setArtists(result as Artist[]);
        setIsLoading(false);
      };
    } else {
      await createArtist(formData, links);
      resetForm();
      const result = await getArtists();
      setArtists(result as Artist[]);
      setIsLoading(false);
    }
  };

  const handleArtistDeletion = async (id: string) => {
    setIsLoading(true);
    await deleteArtist(id);
    const result = await getArtists();
    setArtists(result as Artist[]);
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

  return (
    <div className="min-h-screen p-5 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Gérer les Artistes
      </h1>
      {/* Formulaire de création d'artiste */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleArtistCreation(formData);
        }}
        className="bg-gray-800 p-5 rounded-lg shadow-lg mb-10"
      >
        {/* Champs de formulaire */}
        <input
          type="text"
          name="name"
          placeholder="Nom de l'artiste"
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <textarea
          name="bio"
          placeholder="Description"
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <label htmlFor="Links" className="underline mb-3">
          Links{" "}
        </label>
        {tempLink.map((el: Link, index) => (
          <div key={index} className="grid md:grid-cols-2 gap-2 mt-2">
            <div>
              <label
                htmlFor="name"
                id="name"
                className="text-sm text-slate-200 mb-3"
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
                className="text-sm text-slate-200 mb-3"
              >
                Link :
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
            className="mt-5 bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-400 hover:text-black"
          >
            Add Another Link ?
          </button>
        </div>
        <button
          type="submit"
          className="mt-5 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
        >
          Créer Artiste
        </button>
      </form>

      {/* Liste des artistes */}
      <div className="mt-10">
        <h2 className="text-xl mb-3">Artistes existants</h2>
        <ul>
          {artists.map((artist) => (
            <ArtistList
              key={artist.id}
              artist={artist}
              onDelete={handleArtistDeletion}
              onUpdate={async (id: string, formData: FormData) => {
                await updateArtist(id, formData);
                const result = await getArtists();
                setArtists(result as Artist[]);
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ArtistsDashboard;
