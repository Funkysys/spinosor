"use client";

import { Album } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FaBandcamp,
  FaChevronLeft,
  FaChevronRight,
  FaSoundcloud,
  FaSpotify,
  FaYoutube,
} from "react-icons/fa";

interface AlbumCarouselProps {
  albums: Album[];
}

const AlbumCarousel: React.FC<AlbumCarouselProps> = ({ albums }) => {
  const [hoveredAlbum, setHoveredAlbum] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sortedAlbums = [...albums].sort(
    (a, b) =>
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );

  const getItemsToShow = () => {
    if (windowWidth < 640) return 2;
    if (windowWidth < 1024) return 3;
    return 4;
  };

  const itemsToShow = getItemsToShow();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsToShow >= sortedAlbums.length ? 0 : prevIndex + 1
    );
  }, [sortedAlbums.length, itemsToShow]);

  const previousSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, sortedAlbums.length - itemsToShow)
        : prevIndex - 1
    );
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextSlide, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, nextSlide]);

  const visibleAlbums = sortedAlbums.slice(
    currentIndex,
    currentIndex + itemsToShow
  );

  const getLinkIcon = (url: string) => {
    const lowercaseUrl = url.toLowerCase();
    if (lowercaseUrl.includes("spotify"))
      return {
        icon: <FaSpotify className="w-7 h-7" />,
        color: "text-[#2EE65F]",
        bg: "bg-black/20",
      };
    if (lowercaseUrl.includes("bandcamp"))
      return {
        icon: <FaBandcamp className="w-7 h-7" />,
        color: "text-[#7BE0FF]",
        bg: "bg-black/40",
      };
    if (lowercaseUrl.includes("soundcloud"))
      return {
        icon: <FaSoundcloud className="w-7 h-7" />,
        color: "text-[#FF7700]",
        bg: "bg-black/20",
      };
    if (lowercaseUrl.includes("youtube"))
      return {
        icon: <FaYoutube className="w-7 h-7" />,
        color: "text-[#FF0000]",
        bg: "bg-black/20",
      };
    return null;
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div
      className="w-full py-4 sm:py-8 bg-gray-900 rounded-lg px-1 sm:px-4 relative my-6 sm:my-10 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        {currentIndex > 0 && (
          <button
            onClick={previousSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 p-1 sm:p-2 rounded-full text-white hover:bg-opacity-75 transition-all"
          >
            <FaChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        )}
        <div className="flex justify-start items-center space-x-2 sm:space-x-4 md:space-x-6 px-1 sm:px-4 transition-all duration-300 ease-in-out">
          {visibleAlbums.map((album) => (
            <div
              key={album.id}
              className="relative flex-shrink-0 transition-all duration-300 ease-in-out"
              style={{
                transform:
                  hoveredAlbum === album.id ? "scale(1.05)" : "scale(1)",
              }}
              onMouseEnter={() => setHoveredAlbum(album.id)}
              onMouseLeave={() => setHoveredAlbum(null)}
            >
              <div className="relative w-28 h-28 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                <Image
                  src={album.imageUrl || "/placeholder-album.jpg"}
                  alt={album.title}
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
              {hoveredAlbum === album.id && album.links && (
                <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg flex items-center justify-center p-2 xs:p-3 sm:p-4">
                  <div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 w-full max-w-[100px] xs:max-w-[130px] sm:max-w-[160px] md:max-w-[180px]">
                    {Array(4)
                      .fill(null)
                      .map((_, index) => {
                        const link = (album.links as any[])[index];
                        if (!link)
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-center"
                            />
                          );

                        const iconData = getLinkIcon(link.url);
                        return (
                          <Link
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center group"
                          >
                            {iconData ? (
                              <>
                                <div
                                  className={`p-1 sm:p-1.5 rounded-full ${
                                    iconData?.bg || "bg-black/40"
                                  } ${
                                    iconData?.color || "text-white"
                                  } transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
                                >
                                  {iconData && iconData.icon}
                                </div>
                                <span
                                  className={`text-[10px] sm:text-xs mt-1 sm:mt-1.5 text-${
                                    iconData?.color || "text-white"
                                  } opacity-80 group-hover:opacity-100 px-1.5 sm:px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm transition-colors duration-300 ${
                                    iconData
                                      ? `group-hover:${iconData.color}`
                                      : "group-hover:text-white"
                                  }`}
                                >
                                  {capitalize(link.name)}
                                </span>
                              </>
                            ) : (
                              <span
                                className={`text-[8px] xs:text-[10px] sm:text-xs md:text-sm mt-0.5 xs:mt-1 sm:mt-1.5 text-yellow-200 opacity-80 group-hover:opacity-100 px-1 xs:px-1.5 sm:px-2 py-1 xs:py-1.5 sm:py-2 rounded bg-black/40 backdrop-blur-sm transition-colors duration-300`}
                              >
                                {capitalize(link.name)}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {currentIndex + itemsToShow < sortedAlbums.length && (
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 p-1 sm:p-2 rounded-full text-white hover:bg-opacity-75 transition-all"
          >
            <FaChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>
      <div className="flex justify-center mt-2 sm:mt-4 space-x-1 sm:space-x-2">
        {Array.from({
          length: Math.ceil(sortedAlbums.length / itemsToShow),
        }).map((_, idx) => (
          <button
            key={idx}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
              idx === Math.floor(currentIndex / itemsToShow)
                ? "bg-white"
                : "bg-gray-500"
            }`}
            onClick={() => setCurrentIndex(idx * itemsToShow)}
          />
        ))}
      </div>
    </div>
  );
};

export default AlbumCarousel;
