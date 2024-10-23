import Image from "next/image";
import React from "react";

interface BannerFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  selectedImage: string | null;
  setSelectedImage: (imageUrl: string | null) => void;
  defaultValues?: {
    title: string;
    link: string;
    imageUrl?: string;
  };
}

const BannerForm: React.FC<BannerFormProps> = ({
  onSubmit,
  isLoading,
  selectedImage,
  setSelectedImage,
  defaultValues,
}) => {
  const handleImageSelection = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        onSubmit(formData);
      }}
      className="bg-gray-800 p-5 rounded-lg shadow-lg mb-10"
    >
      <input
        type="text"
        name="title"
        placeholder="Titre"
        required
        defaultValue={defaultValues?.title}
        className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
      />

      {/* Sélection de la page liée */}
      <div className="mb-4">
        <label htmlFor="link" className="block mb-1">
          Page liée:
        </label>
        <select
          name="link"
          id="link"
          required
          defaultValue={defaultValues?.link}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
        >
          <option value="/artists">Artists</option>
          <option value="/events">Events</option>
          <option value="/merch">Merch</option>
        </select>
      </div>

      {/* Sélection d'image ou upload */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">Sélectionner une image</h2>
        <button
          type="button"
          onClick={() => handleImageSelection("/event/image1.jpg")}
          className="bg-blue-500 text-perso-white-one px-4 py-2 rounded hover:bg-blue-400 mr-2"
          disabled={isLoading}
        >
          {`Choisir une image d'événement`}
        </button>
        <button
          type="button"
          onClick={() => handleImageSelection("/album/image1.jpg")}
          className="bg-blue-500 text-perso-white-one px-4 py-2 rounded hover:bg-blue-400 mr-2"
          disabled={isLoading}
        >
          {`Choisir une image d'album`}
        </button>
        <button
          type="button"
          onClick={() => handleImageSelection("/merch/image1.jpg")}
          className="bg-blue-500 text-perso-white-one px-4 py-2 rounded hover:bg-blue-400"
          disabled={isLoading}
        >
          Choisir une image de merch
        </button>
        <input
          type="file"
          name="imageFile"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImageSelection(URL.createObjectURL(file));
            }
          }}
          className="mt-2 ml-2"
          disabled={isLoading}
        />

        {/* Aperçu de l'image */}
        {selectedImage && (
          <div className="mt-3 w-32 h-32 relative">
            <Image
              src={selectedImage}
              alt="Aperçu"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className={`mt-5 bg-green-500 text-perso-white-one px-4 py-2 rounded hover:bg-green-400 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {defaultValues ? "Sauvegarder" : "Créer Bannière"}
      </button>
    </form>
  );
};

export default BannerForm;
