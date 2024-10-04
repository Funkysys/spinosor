"use client"; // Garde le "use client" comme tu l'avais

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Login from "./Login"; // Assurez-vous que votre composant Login est importé correctement.

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full flex justify-between items-center border-b-2 py-4 border-b-red-800 bg-black text-slate-50">
      {/* Logo */}
      <div className="md:invisible pt-2 cursor-pointer animate-fade-right animate-once animate-duration-[1000ms] animate-ease-in-out">
        <Image
          src="/assets/images/logo.svg"
          alt="Spinosor Records logo"
          onClick={() => router.push("/")}
          width={135}
          height={135}
        />
      </div>

      {/* Menu burger (visible sur petits écrans) */}
      <div className="md:hidden flex items-center mr-5">
        <button onClick={toggleMenu} className="text-3xl focus:outline-none">
          &#9776; {/* Icone de menu burger */}
        </button>
      </div>

      {/* Menu pour grands écrans */}
      <ul
        className={`hidden md:flex  justify-between items-center px-4 text-2xl animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out`}
      >
        <div className="mr-5 pt-2 cursor-pointer animate-fade-right animate-once animate-duration-[1000ms] animate-ease-in-out">
          <Image
            src="/assets/images/logo.svg"
            alt="Spinosor Records logo"
            onClick={() => router.push("/")}
            width={135}
            height={135}
          />
        </div>
        <li
          className={
            pathname == "/home"
              ? "font-extrabold hover:text-3xl mr-3"
              : "mr-3 hover:text-3xl"
          }
        >
          <Link href="/home">Home</Link>
        </li>
        <li
          className={
            pathname == "/home/artists"
              ? "font-extrabold hover:text-3xl mr-3"
              : "mr-3 hover:text-3xl"
          }
        >
          <Link href="/home/artists">Artists</Link>
        </li>
        <li
          className={
            pathname == "/home/events"
              ? "font-extrabold hover:text-3xl mr-3"
              : "mr-3 hover:text-3xl"
          }
        >
          <Link href="/home/events">Events</Link>
        </li>
        <li
          className={
            pathname == "/home/mersh"
              ? "font-extrabold hover:text-3xl mr-3"
              : "mr-3 hover:text-3xl"
          }
        >
          <Link href="/home/mersh">Mersh</Link>
        </li>
        <li
          className={
            pathname == "/home/about"
              ? "font-extrabold hover:text-3xl mr-3"
              : "mr-3 hover:text-3xl"
          }
        >
          <Link href="/home/about">About</Link>
        </li>
        <li
          className={
            pathname == "/home/contact"
              ? "font-extrabold hover:text-3xl mr-3"
              : "mr-3 hover:text-3xl"
          }
        >
          <Link href="/home/contact">Contact</Link>
        </li>
      </ul>

      {/* Menu déroulant pour petits écrans */}
      <ul
        className={`${
          isOpen ? "flex" : "hidden"
        } flex-col items-center absolute top-16 left-0 w-full bg-black md:hidden py-4 border-t border-gray-700 text-2xl z-10`}
      >
        <li
          className={
            pathname == "/home"
              ? "font-extrabold hover:text-3xl mr-3"
              : "mr-3 hover:text-3xl"
          }
        >
          <Link href="/home" onClick={toggleMenu}>
            Home
          </Link>
        </li>
        <li
          className={
            pathname == "/home/artists"
              ? "font-extrabold hover:text-3xl mr-3"
              : "mr-3 hover:text-3xl"
          }
        >
          <Link href="/home/artists" onClick={toggleMenu}>
            Artists
          </Link>
        </li>
        <li
          className={
            pathname == "/home/events"
              ? "font-extrabold hover:text-3xl mr-3"
              : "mr-3 hover:text-3xl"
          }
        >
          <Link href="/home/events" onClick={toggleMenu}>
            Events
          </Link>
        </li>
        <li
          className={
            pathname == "/home/mersh"
              ? "font-extrabold hover:text-3xl mr-3"
              : "mr-3 hover:text-3xl"
          }
        >
          <Link href="/home/mersh" onClick={toggleMenu}>
            Mersh
          </Link>
        </li>
        <li
          className={
            pathname == "/home/about"
              ? "font-extrabold hover:text-3xl mr-3"
              : "mr-3 hover:text-3xl"
          }
        >
          <Link href="/home/about" onClick={toggleMenu}>
            About
          </Link>
        </li>
        <li
          className={
            pathname == "/home/contact"
              ? "font-extrabold hover:text-3xl mr-3"
              : "mr-3 hover:text-3xl"
          }
        >
          <Link href="/home/contact" onClick={toggleMenu}>
            Contact
          </Link>
        </li>
        <li>
          <Login />
        </li>
      </ul>

      {/* Composant Login */}
      <div className="hidden md:block ">
        <Login />
      </div>
    </nav>
  );
};

export default Navbar;
