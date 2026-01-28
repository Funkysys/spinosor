"use client";

import { Artist } from "@prisma/client";
import Image from "next/image";

interface ArtistBasicInfoFormProps {
  artist: Artist;
  formData: {
    name: string;
    genre: string;
    videoUrl: string;
    codePlayer: string;
    urlPlayer: string;
  };
  onChange: (field: string, value: string) => void;
}

export const ArtistBasicInfoForm: React.FC<ArtistBasicInfoFormProps> = ({
  artist,
  formData,
  onChange,
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Informations de base</h2>

      {artist.imageUrl && (
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Image actuelle</label>
          <div className="relative w-48 h-48">
            <Image
              src={artist.imageUrl}
              alt={artist.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block mb-2 font-semibold">Nom *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">Genre *</label>
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={(e) => onChange("genre", e.target.value)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">Nouvelle image</label>
        <input
          type="file"
          name="imageUrl"
          accept="image/*"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">URL Vidéo</label>
        <input
          type="text"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={(e) => onChange("videoUrl", e.target.value)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">Code Player</label>
        <input
          type="text"
          name="codePlayer"
          value={formData.codePlayer}
          onChange={(e) => onChange("codePlayer", e.target.value)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">URL Player</label>
        <input
          type="text"
          name="urlPlayer"
          value={formData.urlPlayer}
          onChange={(e) => onChange("urlPlayer", e.target.value)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
        />
      </div>
    </div>
  );
};
