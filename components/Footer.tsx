"use client";

import { getUser } from "@/app/api/action/user/user";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

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
    (await data?.role) !== "ADMIN";
  };
  if (status === "authenticated" && !user) {
    fetchUser();
  }
  return (
    <footer className="fixed bottom-0 px-4 py-2 w-[100vw] bg-perso-bg border-t-2 border-t-perso-yellow-one text-perso-white-two">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center">
          <div className="mr-3 cursor-pointer animate-fade-right animate-once animate-duration-[1000ms] animate-ease-in-out ">
            <Image
              src="/assets/images/logo.svg"
              alt="Spinosor Records logo"
              onClick={() => router.push("/")}
              width={70}
              height={70}
            />
          </div>
          <ul className="flex flex-col px-4 text-sm animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out">
            <li
              className={pathname == "/home" ? "font-extrabold  mr-3" : "mr-3 "}
            >
              <Link href="/home">Accueil</Link>
            </li>
            <li
              className={
                pathname == "/home/artists" ? "font-extrabold  mr-3" : "mr-3 "
              }
            >
              <Link href="/home/artists">Artistes</Link>
            </li>
          </ul>
          <ul className="flex flex-col px-4 text-sm animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out">
            <li
              className={
                pathname == "/home/events" ? "font-extrabold  mr-3" : "mr-3 "
              }
            >
              <Link href="/home/events">Événements</Link>
            </li>
            <li
              className={
                pathname == "/home/mersh" ? "font-extrabold  mr-3" : "mr-3 "
              }
            >
              <Link href="/home/mersh">Mersh</Link>
            </li>
          </ul>
          <ul className="flex flex-col px-4 text-sm animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out">
            <li
              className={
                pathname == "/home/about" ? "font-extrabold  mr-3" : "mr-3 "
              }
            >
              <Link href="/home/about">A propos</Link>
            </li>
            <li
              className={
                pathname == "/home/contact" ? "font-extrabold  mr-3" : "mr-3 "
              }
            >
              <Link href="/home/contact">Contact</Link>
            </li>
          </ul>
          {user && user.role === "ADMIN" && (
            <button
              onClick={() => router.push("/admin")}
              className="border py-1 px-2 rounded-md border-perso-yellow-one text-perso-yellow-one hover:bg-perso-yellow-two hover:text-perso-white-one transition duration-200"
            >
              Admin
            </button>
          )}
          {user && user.role === "USER" && (
            <button
              onClick={() => router.push("/user")}
              className="border py-1 px-2 rounded-md border-perso-yellow-one text-perso-yellow-one hover:bg-perso-yellow-two hover:text-perso-white-one transition duration-200"
            >
              Votre Espace
            </button>
          )}
        </div>
        <p className="md:absolute text-sm mt-3 md:mt-0 right-4">
          &copy; {new Date().getFullYear()} Spinosor Records. Tout droits
          réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
