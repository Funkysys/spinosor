"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const controls = useAnimation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      // Scrolling down
      controls.start({ y: "-100%", transition: { duration: 0.3 } });
    } else {
      // Scrolling up
      controls.start({ y: "0%", transition: { duration: 0.3 } });
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex font-ruda justify-center items-center border-b-2 py-2 border-b-perso-yellow-one bg-perso-bg text-perso-white-two"
      animate={controls}
    >
      {/* Logo */}
      <div className="md:hidden cursor-pointer animate-fade-right animate-once animate-duration-[1000ms] animate-ease-in-out">
        <Image
          src="/assets/images/SPINOSOR.png"
          alt="Spinosor Records logo"
          onClick={() => router.push("/")}
          width={135}
          height={135}
        />
      </div>

      {/* Menu burger (visible sur petits écrans) */}
      <div className="md:hidden flex items-center bg-perso-bg bg-opacity-85 rounded-full px-5 py-4 z-20 fixed right-5 top-5 mr-5">
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
        <div className="cursor-pointer animate-fade-right animate-once animate-duration-[1000ms] animate-ease-in-out mr-5">
          <Image
            src="/assets/images/SPINOSOR.png"
            alt="Spinosor Records logo"
            onClick={() => router.push("/")}
            width={95}
            height={80}
          />
        </div>
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
      </ul>

      {/* Menu déroulant pour petits écrans */}
      <ul
        className={`${
          isOpen ? "flex" : "hidden"
        } fixed flex-col items-center top-28 left-0 w-full bg-perso-bg bg-opacity-85 text-perso-white-two md:hidden  border-t border-gray-700 text-2xl z-10`}
      >
        <li className="mr-4 border-b-2 border-perso-yellow-two w-full text-center py-3">
          <Link href="/home/artists" onClick={toggleMenu}>
            Artistes
          </Link>
        </li>
        <li className="mr-4 border-b-2 border-perso-yellow-two w-full text-center py-3">
          <Link href="/home/events" onClick={toggleMenu}>
            Événements
          </Link>
        </li>
        <li className="mr-4 border-b-2 border-perso-yellow-two w-full text-center py-3">
          <Link href="/home/about" onClick={toggleMenu}>
            A propos
          </Link>
        </li>
        <li className="mr-4 border-b-2 border-perso-yellow-two w-full text-center py-3">
          <Link href="/home/contact" onClick={toggleMenu}>
            Contact
          </Link>
        </li>
      </ul>
    </motion.nav>
  );
};

export default Navbar;
