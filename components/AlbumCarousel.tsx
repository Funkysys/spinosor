"use client";

import { Album } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface AlbumCarouselProps {
  albums: Album[];
}

const AlbumCarousel: React.FC<AlbumCarouselProps> = ({ albums }) => {
  const [hoveredAlbum, setHoveredAlbum] = useState<string | null>(null);

  return (
    <div className="w-full py-8">
      <div className="flex overflow-x-auto space-x-6 p-4 scrollbar-hide">
        {albums.map((album) => (
          <div
            key={album.id}
            className="relative flex-shrink-0 transition-all duration-300 ease-in-out"
            style={{
              transform: hoveredAlbum === album.id ? "scale(1.1)" : "scale(1)",
            }}
            onMouseEnter={() => setHoveredAlbum(album.id)}
            onMouseLeave={() => setHoveredAlbum(null)}
          >
            {/* Album Image */}
            <div className="relative w-48 h-48">
              <Image
                src={album.imageUrl || "/placeholder-album.jpg"}
                alt={album.title}
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Links Overlay */}
            {hoveredAlbum === album.id && album.links && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex flex-col items-center justify-center p-4">
                
                {(album.links as any[]).map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-400 mb-2 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumCarousel;
