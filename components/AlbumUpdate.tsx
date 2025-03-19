import { Album, Prisma } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";

interface Link {
  id: number;
  name: string;
  url: string;
}

interface AlbumCreationProps {
  onAlbumDataChange: (albumData: Album) => void;
  artistId: string;
  albumData: Album;
}

const AlbumUpdate: React.FC<AlbumCreationProps> = ({
  onAlbumDataChange,
  artistId,
  albumData,
}) => {
  const [title, setTitle] = useState(albumData.title);
  const [imageUrl, setImageUrl] = useState<string>(albumData.imageUrl!);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [releaseDate, setReleaseDate] = useState<Date>(albumData.releaseDate);
  const [tempAlbumLinks, setTempAlbumLinks] = useState<Link[]>(
    albumData.links ? (albumData.links as unknown as Link[]) : []
  );

  const previousDataRef = useRef<Album | null>(null);

  useEffect(() => {
    const currentData: Album = {
      id: albumData.id,
      title,
      imageUrl,
      releaseDate,
      createdAt: albumData.createdAt,
      updatedAt: new Date(),
      links: tempAlbumLinks.map((link) => ({ ...link })) as Prisma.JsonArray,
      artistId,
      slug: albumData.slug,
    };

    if (
      !previousDataRef.current ||
      JSON.stringify(currentData) !== JSON.stringify(previousDataRef.current)
    ) {
      onAlbumDataChange(currentData);
      previousDataRef.current = currentData; // Met à jour la référence
    }
  }, [
    title,
    imageUrl,
    releaseDate,
    tempAlbumLinks,
    artistId,
    onAlbumDataChange,
    albumData.createdAt,
    albumData.id,
    albumData.slug,
  ]);

  const handleOnChangeAlbumLinkName = (
    data: React.ChangeEvent<HTMLInputElement>,
    el: Link
  ) => {
    const updatedLinks = tempAlbumLinks.map((item) =>
      item.id === el.id ? { ...item, name: data.target.value } : item
    );
    setTempAlbumLinks(updatedLinks);
  };

  const handleOnChangeAlbumLinkUrl = (
    data: React.ChangeEvent<HTMLInputElement>,
    el: Link
  ) => {
    const updatedLinks = tempAlbumLinks.map((item) =>
      item.id === el.id ? { ...item, url: data.target.value } : item
    );
    setTempAlbumLinks(updatedLinks);
  };

  const addNewAlbumLink = () => {
    setTempAlbumLinks([
      ...tempAlbumLinks,
      { id: tempAlbumLinks.length + 1, name: "", url: "" },
    ]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="mb-4">
        <label htmlFor="title" className="block text-white mb-2">
          Titre :
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="imageFile" className="underline mb-3 text-white">
          Image :
        </label>
        <input
          type="file"
          id="imageFile"
          name="imageFile"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="releaseDate" className="block text-white mb-2">
          Date de sortie :
        </label>
        <input
          type="date"
          id="releaseDate"
          value={releaseDate.toISOString().split("T")[0]}
          onChange={(e) => setReleaseDate(new Date(e.target.value))}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
      </div>
      <div className="mb-4">
        <h3 className="text-white mb-2">Liens :</h3>
        {tempAlbumLinks.map((el: Link, index) => (
          <div key={index} className="grid md:grid-cols-2 gap-2 mb-2">
            <div>
              <input
                type="text"
                placeholder="Nom du lien"
                value={el.name}
                onChange={(e) => handleOnChangeAlbumLinkName(e, el)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="URL du lien"
                value={el.url}
                onChange={(e) => handleOnChangeAlbumLinkUrl(e, el)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addNewAlbumLink}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
        >
          Ajouter un nouveau lien
        </button>
      </div>
    </div>
  );
};

export default AlbumUpdate;
