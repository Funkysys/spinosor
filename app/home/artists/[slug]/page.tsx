"use client";

import AlbumCarousel from "@/components/AlbumCarousel";
import Player from "@/components/Player";
import { ArtistWithEvents } from "@/types";
import { Event } from "@prisma/client";
import parse from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import {
  FaBandcamp,
  FaFacebook,
  FaInstagram,
  FaSoundcloud,
  FaSpotify,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const ArtistPage = () => {
  const router = useRouter();
  const [Loading, setLoading] = useState(false);
  const [artist, setArtist] = useState<ArtistWithEvents>();
  const { slug } = useParams();
  const [artistesSlug, setArtistesSlug] = useState<{ slug: string }[] | null>(
    null
  );

  const socialIcons: Record<string, IconType> = {
    Facebook: FaFacebook,
    Twitter: FaTwitter,
    Instagram: FaInstagram,
    YouTube: FaYoutube,
    Bandcamp: FaBandcamp,
    Spotify: FaSpotify,
    Soundcloud: FaSoundcloud,
  };

  useEffect(() => {
    setLoading(true);
    const fetchArtist = async () => {
      if (typeof slug === "string") {
        const artistData = await fetch(`/api/artists/by-slug?slug=${slug}`, {
          method: "GET",
        }).then((res) => res.json());

        if (artistData && !Array.isArray(artistData) && artistData.events) {
          const artistWithFormattedDates = {
            ...artistData,
            events: artistData.events.map((event: Event) => ({
              ...event,
              date: event.date.toISOString(), // Conversion en chaîne ISO
            })),
          };

          setArtist(artistWithFormattedDates);
        } else {
          console.error("Artist data not found or events is empty.");
          return alert("Il n'y a pas d'artiste à cette adresse.");
        }
      }
      setLoading(false);
    };
    fetchArtist();
  }, [slug]);

  useEffect(() => {
    const fetchArtistsNames = async () => {
      const artistesSlug = await fetch(`/api/artists/slugs`, {
        method: "GET",
      }).then((res) => res.json());
      setArtistesSlug(artistesSlug);
    };
    fetchArtistsNames();
  }, []);

  const goToNextArtist = () => {
    if (artistesSlug && slug) {
      const currentIndex = artistesSlug.findIndex(
        (artist) => artist.slug === slug
      );
      const nextIndex = (currentIndex + 1) % artistesSlug.length;
      const nextArtistId = artistesSlug[nextIndex]?.slug;

      if (nextArtistId) {
        router.push(`/home/artists/${nextArtistId}`);
      }
    }
  };

  if (Loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <div className="w-[100vw] md:w-[66vw] min-h-[100vh] md:mx-auto md:px-8 bg-perso-bg2 border-x-2 border-sky-950">
      <button
        onClick={goToNextArtist}
        className=" md:w-auto md:fixed text-sm mb-5 md:top-32 md:right-8 lg:right-12 xl:right-48 font-ruda bg-perso-yellow-one text-perso-bg px-4 py-2 rounded-lg hover:bg-blue-800 hover:text-perso-white-two transition"
      >
        Artiste suivant
      </button>
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {artist.imageUrl && (
          <Image
            className="rounded"
            src={artist.imageUrl}
            alt={artist.name}
            width={400}
            height={400}
          />
        )}
        <div>
          <h1 className="text-4xl font-bold">{artist.name}</h1>
          <p className="text-xl text-slate-600">{artist.genre}</p>
          <div className="mt-4">
            {artist.bio ? parse(artist.bio) : <p>Pas de bio disponible.</p>}
          </div>
        </div>
      </div>

      {artist.codePlayer && artist.urlPlayer && (
        <Player codePlayer={artist.codePlayer} urlPlayer={artist.urlPlayer} />
      )}

      {artist.videoUrl && (
        <div className="w-full my-8 flex justify-center">
          <iframe
            className="border-4 border-gray-600 rounded-lg"
            width="1120"
            height="630"
            src={artist.videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {artist.albums && artist.albums.length > 0 && (
        <div className="mt-8">
          <AlbumCarousel albums={artist.albums} />
        </div>
      )}

      {artist.socialLinks && (
        <div className="w-[100%] flex justify-center ">
          <ul className="list-none flex gap-4">
            {(() => {
              let socialLinksArray = [];

              if (typeof artist.socialLinks === "string") {
                try {
                  socialLinksArray = JSON.parse(artist.socialLinks);
                } catch (error) {
                  console.error("Erreur lors du parsing de socialLinks", error);
                }
              } else if (Array.isArray(artist.socialLinks)) {
                socialLinksArray = artist.socialLinks;
              }

              if (socialLinksArray.length > 0) {
                return socialLinksArray.map(
                  (link: any) =>
                    link.id &&
                    link.url &&
                    link.url !== "" &&
                    link.name &&
                    link.name !== "" && (
                      <div key={link.id} className="text-center">
                        <Link href={link.url} target="_blank">
                          <button className="my-8  bg-perso-yellow-one text-perso-bg px-2 py-2 rounded-full hover:bg-blue-800 hover:text-perso-white-two transition ">
                            {socialIcons[
                              link.name.charAt(0).toUpperCase() +
                                link.name.slice(1).toLowerCase()
                            ] ? (
                              React.createElement(
                                socialIcons[
                                  link.name.charAt(0).toUpperCase() +
                                    link.name.slice(1).toLowerCase()
                                ],
                                {
                                  size: 28,
                                }
                              )
                            ) : (
                              <span>
                                {link.name.charAt(0).toUpperCase() +
                                  link.name.slice(1)}
                              </span>
                            )}
                          </button>
                        </Link>
                      </div>
                    )
                );
              } else {
                return <li>Aucun lien social disponible.</li>;
              }
            })()}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArtistPage;
