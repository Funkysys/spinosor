"use client";

import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { FaBandcamp, FaFacebook, FaInstagram } from "react-icons/fa";
import Login from "./Login";

const Footer: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { data: session, status } = useSession();
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );

  const fetchUser = useCallback(async () => {
    if (status === "authenticated" && session?.user?.email) {
      const data = await fetch(
        `/api/user?email=${session?.user?.email as string}`
      ).then((res) => res.json());
      setUser(data);
    }
  }, [status, session?.user?.email]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <footer
      className={`fixed bottom-0 left-0 w-full bg-perso-bg bg-opacity-60 text-perso-white-two border-t-2 border-t-perso-yellow-one transition-transform duration-300 group ${
        scrollDirection === "down" ? "translate-y-full" : "translate-y-0"
      }`}
      aria-label="Footer"
    >
      {/* Conteneur principal du footer */}
      <div className="flex flex-col justify-center items-center h-12 md:h-16 group-hover:h-44 md:group-hover:h-40 overflow-hidden transition-all duration-300">
        {/* Section supérieure : Icônes sociales et lien admin */}
        <div className="flex space-x-6">
          {user?.role === "ADMIN" && (
            <Link href="/admin">
              <button className="btn-secondary py-1 px-2 mx-5 border rounded-md border-perso-yellow-one text-perso-yellow-one hover:bg-perso-yellow-two hover:text-perso-white-one text-sm md:text-md transition duration-200">
                Admin
              </button>
            </Link>
          )}
          {[
            {
              href: "https://facebook.com",
              icon: FaFacebook,
              label: "Facebook",
            },
            {
              href: "https://instagram.com",
              icon: FaInstagram,
              label: "Instagram",
            },
            {
              href: "https://bandcamp.com",
              icon: FaBandcamp,
              label: "Bandcamp",
            },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
              aria-label={label}
            >
              <Icon size={24} />
            </Link>
          ))}
        </div>

        {/* Section inférieure : Logo, mentions légales, et autres */}
        <div className="hidden group-hover:flex flex-col justify-between items-center mt-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <div className="mr-3 cursor-pointer">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/assets/images/SPINOSOR.png"
                  alt="Spinosor Records logo"
                  width={70}
                  height={70}
                />
              </Link>
              <Link href="/home/legal">
                <button className="btn-secondary py-1 px-2 mx-5 border rounded-md border-perso-yellow-one text-perso-yellow-one hover:bg-perso-yellow-two hover:text-perso-white-one text-sm md:text-md transition duration-200">
                  Mentions légales
                </button>
              </Link>
              <div className="ml-5 md:ml-0">
                <Login />
              </div>
              {user?.role === "USER" && (
                <Link href="/user">
                  <button className="btn-primary">Votre Espace</button>
                </Link>
              )}
            </div>
          </div>
          <button className="md:hidden border py-1 px-2 mt-2 rounded-md border-perso-yellow-one text-perso-yellow-one hover:bg-perso-yellow-two hover:text-perso-white-one text-sm md:text-md transition duration-200">
            Mentions légales
          </button>
          <div className="flex space-x-4 md:mt-0">
            <p className="text-sm mt-2 text-center">
              &copy; {new Date().getFullYear()} Spinosor Records. Tous droits
              réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
