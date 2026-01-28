"use client";

import clsx from "clsx"; // Vous pouvez utiliser clsx pour gérer les classes conditionnelles si vous utilisez Tailwind CSS
import Link from "next/link";
import { useState } from "react";
import { FaMusic } from "react-icons/fa"; // Icône musicale

const SlideModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute h-screen w-screen pointer-events-none">
      {/* Icône déclencheur */}
      <div
        className="fixed top-1/2 left-0 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-800 text-white transform-translate-y-1/2 hover:bg-gray-600 pointer-events-auto"
        onMouseEnter={() => setIsOpen(!isOpen)}
      >
        <FaMusic className="text-2xl text-perso-yellow-two" />{" "}
        {/* Nouvelle icône */}
      </div>

      {/* Modale */}
      <div
        className={clsx(
          "fixed top-0 left-0 z-20 h-full transition-transform duration-300 ease-in-out pointer-events-auto",
          isOpen ? "translate-x-0 " : "-translate-x-full",
        )}
        onMouseLeave={() => setIsOpen(false)}
        style={{ minWidth: "10%" }} // Assurez-vous que la largeur minimale est respectée
      >
        <div className=" flex items-center justify-center h-full">
          <iframe
            style={{ border: 0, width: "350px", height: "470px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=766049808/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/"
            seamless
          >
            <Link
              href="https://spinosor-records.bandcamp.com/album/spinosor-playlist-2"
              target="_blank"
            >
              Spinosor Playlist by Spinosor Records
            </Link>
          </iframe>{" "}
          <div
            className="md:hidden z-20 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-800 text-white transform-translate-y-1/2 hover:bg-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaMusic className="text-2xl text-perso-yellow-two" />{" "}
            {/* Nouvelle icône */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideModal;
