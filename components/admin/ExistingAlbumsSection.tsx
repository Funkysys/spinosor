"use client";

import { Album } from "@prisma/client";
import AlbumUpdate from "../AlbumUpdate";

interface ExistingAlbumsSectionProps {
  albums: Album[];
  onUpdate: (album: Album, index: number) => void;
  onDelete: (album: Album) => Promise<void>;
}

export const ExistingAlbumsSection: React.FC<ExistingAlbumsSectionProps> = ({
  albums,
  onUpdate,
  onDelete,
}) => {
  if (albums.length === 0) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Albums existants</h2>
      <div className="space-y-4">
        {albums.map((album, index) => (
          <AlbumUpdateWrapper
            key={album.id}
            album={album}
            index={index}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

interface AlbumUpdateWrapperProps {
  album: Album;
  index: number;
  onUpdate: (album: Album, index: number) => void;
  onDelete: (album: Album) => Promise<void>;
}

const AlbumUpdateWrapper: React.FC<AlbumUpdateWrapperProps> = ({
  album,
  index,
  onUpdate,
  onDelete,
}) => {
  const handleAlbumDataChange = (updatedAlbum: Album) => {
    onUpdate(updatedAlbum, index);
  };

  return (
    <div className="border border-gray-600 p-4 rounded-lg">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">{album.title}</h3>
        <button
          type="button"
          onClick={() => onDelete(album)}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
        >
          Supprimer
        </button>
      </div>
      <AlbumUpdate
        onAlbumDataChange={handleAlbumDataChange}
        artistId={album.artistId}
        albumData={album}
      />
    </div>
  );
};
