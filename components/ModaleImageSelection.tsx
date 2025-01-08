import Image from "next/image";
import React from "react";

interface ModaleImageSelectionProps {
  handleImageSelection: (imageUrl: string) => void;
  onClose: () => void;
  galerie: string[];
  setLoadImage: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModaleImageSelection: React.FC<ModaleImageSelectionProps> = ({
  handleImageSelection,
  onClose,
  galerie,
  setLoadImage,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full ">
        <button
          className="fixed top-5 bg-perso-red-two rounded-lg cursor-pointer focus:outline-none right-5 px-2 py-1 text-white hover:bg-perso-red-one transition-colors"
          onClick={() => onClose()}
        >
          X
        </button>
        <h2 className="text-lg font-semibold mb-4">{`Sélectionner une image d'artistes`}</h2>
        <div className="grid grid-cols-3 gap-4 h-[100vh] overflow-scroll">
          {galerie.map((imageUrl, index) => (
            <button
              key={index}
              onClick={() => {
                setLoadImage(true);
                handleImageSelection(imageUrl);
                onClose();
                setLoadImage(false);
              }}
              className="relative rounded-lg cursor-pointer focus:outline-none"
            >
              <Image
                src={imageUrl}
                alt={`Image ${index}`}
                width={200}
                height={200}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default ModaleImageSelection;
