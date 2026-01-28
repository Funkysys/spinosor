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
  const [releaseDate, setReleaseDate] = useState<Date>(
    albumData.releaseDate ? new Date(albumData.releaseDate) : new Date()
  );
  const [tempAlbumLinks, setTempAlbumLinks] = useState<Link[]>(
    albumData.links ? (albumData.links as unknown as Link[]) : []
  );

  const previousDataRef = useRef<Album | null>(null);

  const serializedLinks = JSON.stringify(tempAlbumLinks);

  useEffect(() => {
    const currentData: Album = {
      id: albumData.id,
      title,
      imageUrl: albumData.imageUrl,
      releaseDate,
      createdAt: albumData.createdAt,
      updatedAt: releaseDate,
      links: tempAlbumLinks.map((link) => ({ ...link })) as Prisma.JsonArray,
      artistId,
      slug: albumData.slug,
    };

    if (
      !previousDataRef.current ||
      JSON.stringify(currentData) !== JSON.stringify(previousDataRef.current)
    ) {
      onAlbumDataChange(currentData);
      previousDataRef.current = currentData;
    }
  }, [
    title,
    albumData.slug,
    albumData.imageUrl,
    releaseDate,
    tempAlbumLinks,
    artistId,
    onAlbumDataChange,
    albumData.createdAt,
    albumData.id,
    serializedLinks,
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

  const removeAlbumLink = (id: number) => {
    setTempAlbumLinks(tempAlbumLinks.filter((link) => link.id !== id));
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
          // onChange={handleImageChange}
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
          value={
            releaseDate instanceof Date
              ? releaseDate.toISOString().split("T")[0]
              : ""
          }
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
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="URL du lien"
                value={el.url}
                onChange={(e) => handleOnChangeAlbumLinkUrl(e, el)}
                className="flex-1 p-2 rounded bg-gray-700 border border-gray-600"
              />
              <button
                type="button"
                onClick={() => removeAlbumLink(el.id)}
                className="text-red-500 hover:text-red-400 px-2"
              >
                ✕
              </button>
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
