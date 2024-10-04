"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules"; // à partir de swiper v11
import { Swiper, SwiperSlide } from "swiper/react";

import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  const images = [
    {
      src: "/assets/images/banner1.jpg",
      alt: "Actu 1",
      link: "/home/artists",
      title: "Nouvel album disponible !",
    },
    {
      src: "/assets/images/banner2.jpg",
      alt: "Actu 2",
      link: "/home/events",
      title: "Concert à venir",
    },
    {
      src: "/assets/images/artist_test.jpg",
      alt: "Actu 3",
      link: "/home/artists",
      title: "Les nouveaux artistes",
    },
  ];

  return (
    <div className="relative w-full h-[400px] md:h-[600px] xl:h-[800px]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={image.src}
                alt={image.alt}
                layout="fill"
                objectFit="cover"
                quality={100}
                className="opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {/* Welcome to Spinosor Records */}
                  Bienvenue chez Spinosor Records
                </h1>
                <p className="text-lg md:text-xl mb-6">
                  {/* Discover the best music, artists, and events with us. */}
                  Découvrez la meilleure musique, artistes et événements avec
                  nous.
                </p>
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  {image.title}
                </h2>
                <Link
                  href={image.link}
                  className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
