"use client";

import { getUser } from "@/app/api/action/user/user";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaBandcamp, FaFacebook, FaInstagram } from "react-icons/fa"; // Import des icônes

const Footer: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>();
  const { data: session, status } = useSession();

  const fetchUser = async () => {
    const email = session?.user?.email;
    if (!email) return;
    const data = await getUser(email);
    setUser(data);
  };

  if (status === "authenticated" && !user) {
    fetchUser();
  }

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-perso-bg bg-opacity-60 text-perso-white-two border-t-2 border-t-perso-yellow-one transition-all duration-300 group">
      {/* Footer container */}
      <div className="flex flex-col justify-center items-center h-12 group-hover:h-36 overflow-hidden transition-all duration-300">
        {/* Social Media Icons */}
        <div className="flex space-x-6">
          {user?.role === "ADMIN" && (
            <button
              onClick={() => router.push("/admin")}
              className="border py-1 px-2 rounded-md border-perso-yellow-one text-perso-yellow-one hover:bg-perso-yellow-two hover:text-perso-white-one transition duration-200"
            >
              Admin
            </button>
          )}
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-perso-yellow-one hover:text-perso-yellow-two hover:scale-110 transition-transform duration-200"
          >
            <FaFacebook size={24} />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-perso-yellow-one hover:text-perso-yellow-two hover:scale-110 transition-transform duration-200"
          >
            <FaInstagram size={24} />
          </Link>
          <Link
            href="https://bandcamp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-perso-yellow-one hover:text-perso-yellow-two hover:scale-110 transition-transform duration-200"
          >
            <FaBandcamp size={24} />
          </Link>
        </div>

        {/* Main Navigation */}
        <div className="hidden group-hover:flex flex-col  justify-between items-center mt-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <div className="mr-3 cursor-pointer">
            <div className="flex items-center">
              <Image
                src="/assets/images/SPINOSOR.png"
                alt="Spinosor Records logo"
                onClick={() => router.push("/")}
                width={70}
                height={70}
              />
              <Link href="/home/legal">
                <button
                  onClick={() => router.push("/admin")}
                  className="border py-1 px-2 ml-5 rounded-md border-perso-yellow-one text-perso-yellow-one hover:bg-perso-yellow-two hover:text-perso-white-one transition duration-200"
                >
                  {" "}
                  Mentions légales
                </button>
              </Link>
              {user?.role === "USER" && (
                <button
                  onClick={() => router.push("/user")}
                  className="border py-1 px-2 rounded-md border-perso-yellow-one text-perso-yellow-one hover:bg-perso-yellow-two hover:text-perso-white-one transition duration-200"
                >
                  Votre Espace
                </button>
              )}
            </div>
          </div>
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
