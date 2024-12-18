"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa"; // Importer une icône de panier
import Login from "./Login";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex font-ruda justify-center items-center border-b-2 py-2 border-b-perso-yellow-one bg-perso-bg text-perso-white-two">
      {/* Logo */}
      <div className="md:hidden cursor-pointer animate-fade-right animate-once animate-duration-[1000ms] animate-ease-in-out">
        <Image
          src="/assets/images/6.png"
          alt="Spinosor Records logo"
          onClick={() => router.push("/")}
          width={135}
          height={135}
        />
      </div>

      {/* Menu burger (visible sur petits écrans) */}
      <div className="md:hidden flex items-center absolute right-5 top-5 mr-5">
        <button
          onClick={toggleMenu}
          className={`${isOpen && "text-red-400"} text-3xl focus:outline-none`}
        >
          &#9776; {/* Icone de menu burger */}
        </button>
      </div>

      {/* Menu pour grands écrans */}
      <ul
        className={`hidden md:flex items-center text-xl animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out`}
      >
        <div className="pt-2 cursor-pointer animate-fade-right animate-once animate-duration-[1000ms] animate-ease-in-out">
          <Image
            src="/assets/images/6.png"
            alt="Spinosor Records logo"
            onClick={() => router.push("/")}
            width={80}
            height={80}
          />
        </div>
        <li
          className={
            pathname == "/home"
              ? "ml-5 font-extrabold  text-perso-yellow-one hover:text-perso-yellow-two mr-4"
              : "ml-5 mr-4 hover:text-perso-yellow-one"
          }
        >
          <Link href="/home">Accueil</Link>
        </li>
        <li
          className={
            pathname == "/home/artists"
              ? "ml-5 font-extrabold  text-perso-yellow-one hover:text-perso-yellow-two mr-4"
              : "ml-5 mr-4   hover:text-perso-yellow-one"
          }
        >
          <Link href="/home/artists">Artistes</Link>
        </li>
        <li
          className={
            pathname == "/home/events"
              ? "ml-5 font-extrabold  text-perso-yellow-one hover:text-perso-yellow-two mr-4"
              : "ml-5 mr-4   hover:text-perso-yellow-one"
          }
        >
          <Link href="/home/events">Événements</Link>
        </li>
        <li
          className={
            pathname == "/home/mersh"
              ? "ml-5 font-extrabold  text-perso-yellow-one hover:text-perso-yellow-two mr-4"
              : "ml-5 mr-4   hover:text-perso-yellow-one"
          }
        >
          <Link href="/home/mersh">Mersh</Link>
        </li>
        <li
          className={
            pathname == "/home/about"
              ? "ml-5 font-extrabold  text-perso-yellow-one hover:text-perso-yellow-two mr-4"
              : "ml-5 mr-4   hover:text-perso-yellow-one"
          }
        >
          <Link href="/home/about">A propos</Link>
        </li>
        <li
          className={
            pathname == "/home/contact"
              ? "ml-5 font-extrabold  text-perso-yellow-one hover:text-perso-yellow-two mr-4"
              : "ml-5 mr-4   hover:text-perso-yellow-one"
          }
        >
          <Link href="/home/contact">Contact</Link>
        </li>
        {/* Lien vers le panier avec une icône */}
        <li className="ml-5">
          <Link href="/home/cart">
            <FaShoppingCart className="text-3xl hover:text-perso-yellow-two transition-colors" />
          </Link>
        </li>
      </ul>

      {/* Menu déroulant pour petits écrans */}
      <ul
        className={`${
          isOpen ? "flex" : "hidden"
        } flex-col items-center absolute top-16 left-0 w-full bg-black md:hidden py-4 border-t border-gray-700 text-2xl z-10`}
      >
        <li className="mr-4 border-b-2 border-white w-full text-center pb-3">
          <Link href="/home" onClick={toggleMenu}>
            Acceuil
          </Link>
        </li>
        <li className="mr-4 border-b-2 border-white w-full text-center py-3">
          <Link href="/home/artists" onClick={toggleMenu}>
            Artistes
          </Link>
        </li>
        <li className="mr-4 border-b-2 border-white w-full text-center py-3">
          <Link href="/home/events" onClick={toggleMenu}>
            Événements
          </Link>
        </li>
        <li className="mr-4 border-b-2 border-white w-full text-center py-3">
          <Link href="/home/mersh" onClick={toggleMenu}>
            Mersh
          </Link>
        </li>
        <li className="mr-4 border-b-2 border-white w-full text-center py-3">
          <Link href="/home/about" onClick={toggleMenu}>
            A propos
          </Link>
        </li>
        <li className="mr-4 border-b-2 border-white w-full text-center py-3">
          <Link href="/home/contact" onClick={toggleMenu}>
            Contact
          </Link>
        </li>
        {/* Lien vers le panier pour petits écrans */}
        <li className="mt-4 text-green-500">
          <Link href="/home/cart" onClick={toggleMenu}>
            <FaShoppingCart className="text-3xl" />
          </Link>
        </li>
      </ul>

      {/* Composant Login */}
      <div className="hidden md:block ml-10">
        <Login />
      </div>
    </nav>
  );
};

export default Navbar;
