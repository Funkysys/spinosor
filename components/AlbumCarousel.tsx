"use client";

import { Album } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface AlbumCarouselProps {
  albums: Album[];
}

const AlbumCarousel: React.FC<AlbumCarouselProps> = ({ albums }) => {
  const [hoveredAlbum, setHoveredAlbum] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Nombre d'albums à afficher à la fois
  const itemsToShow = 4;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex + itemsToShow >= albums.length ? 0 : prevIndex + 1
    );
  }, [albums.length]);

  const previousSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, albums.length - itemsToShow) : prevIndex - 1
    );
  };

  // Rotation automatique
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextSlide, 3000); // Change toutes les 3 secondes
      return () => clearInterval(interval);
    }
  }, [isPaused, nextSlide]);

  // Calculer les albums visibles
  const visibleAlbums = albums.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div 
      className="w-full py-8 bg-gray-900 px-4 relative my-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h2 className="text-2xl font-bold mb-4 text-white px-4">Albums</h2>
      
      <div className="relative">
        {/* Bouton précédent */}
        {currentIndex > 0 && (
          <button
            onClick={previousSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-all"
          >
            <FaChevronLeft size={24} />
          </button>
        )}

        {/* Carousel */}
        <div className="flex justify-start items-center space-x-6 p-4 transition-all duration-300 ease-in-out">
          {visibleAlbums.map((album) => (
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

        {/* Bouton suivant */}
        {currentIndex + itemsToShow < albums.length && (
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-all"
          >
            <FaChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Indicateurs de position */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(albums.length / itemsToShow) }).map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === Math.floor(currentIndex / itemsToShow)
                ? "bg-white"
                : "bg-gray-500"
            }`}
            onClick={() => setCurrentIndex(idx * itemsToShow)}
          />       ))}
      </div>
    </div>
  );
};

export default AlbumCarousel;
