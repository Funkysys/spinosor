"use client";

import { getActiveBanners } from "@/app/api/action/banner/banner"; // Importation de l'action server
import { Banner as BannerType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const BannerHome = () => {
  const [banners, setBanners] = useState<BannerType[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const activeBanners = await getActiveBanners();
        console.log("Bannières actives récupérées :", activeBanners);
        setBanners(activeBanners);
      } catch (error) {
        console.error("Erreur lors de la récupération des bannières :", error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[400px] xl:h-[800px] mb-20">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={banners.length > 1} // Permettre le défilement en boucle uniquement si plusieurs bannières
        className="w-full h-full"
      >
        {banners.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={image.imageUrl}
                alt={image.title}
                layout="fill"
                objectFit={image.isSquare ? "contain" : "cover"}
                className={`${
                  image.isSquare ? "w-auto h-full" : "w-full h-full"
                }`}
                quality={100}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-20">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Bienvenue chez Spinosor Records
                </h1>
                <p className="text-lg md:text-xl mb-6">
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

export default BannerHome;
