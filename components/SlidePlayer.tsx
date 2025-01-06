"use client";
import clsx from "clsx"; // Vous pouvez utiliser clsx pour gérer les classes conditionnelles si vous utilisez Tailwind CSS
import React, { useState } from "react";

const SlideModal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute h-screen w-screen">
      {/* Icône déclencheur */}
      <div
        className="fixed top-1/2 left-0 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-800 text-white transform -translate-y-1/2 hover:bg-gray-600"
        onMouseEnter={() => setIsOpen(true)}
      >
        <span className="text-lg">☰</span>
      </div>

      {/* Modale */}
      <div
        className={clsx(
          "fixed top-0 left-0 z-20 h-full transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0 " : "-translate-x-full"
        )}
        onMouseLeave={() => setIsOpen(false)}
        style={{ minWidth: "10%" }} // Assurez-vous que la largeur minimale est respectée
      >
        <div className="p-4 flex items-center justify-center h-full ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SlideModal;
