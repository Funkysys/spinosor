"use client";

import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "@/app/api/action/banner/banner";
import BannerList from "@/components/BannerList";
import { Banner as BannerType } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

const BannerDashboard: React.FC = () => {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      const result = await getBanners();
      setBanners(result);
    };
    fetchBanners();
  }, []);

  const handleImageSelection = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const resetForm = () => {
    setSelectedImage(null);
  };

  const handleBannerCreation = async (formData: FormData) => {
    setIsLoading(true);
    const imageFile = formData.get("imageFile") as File | null;

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        formData.append("imageFile", reader.result as string);
        await createBanner(formData);
        resetForm();
        const result = await getBanners();
        setBanners(result);
        setIsLoading(false);
      };
    } else {
      await createBanner(formData);
      resetForm();
      const result = await getBanners();
      setBanners(result);
      setIsLoading(false);
    }
  };

  const handleBannerDeletion = async (id: string) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("id", id);
    await deleteBanner(formData);
    const result = await getBanners();
    setBanners(result);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-5 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Gérer les Bannières
      </h1>

      {/* Formulaire de création de bannière */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Créer un objet FormData à partir du formulaire
          const formData = new FormData(e.target as HTMLFormElement);

          // Gérer les valeurs des checkboxes car elles ne sont pas incluses par défaut dans FormData
          const isActive = (e.target as HTMLFormElement).isActive.checked; // Accéder à l'état de isActive
          const isSquare = (e.target as HTMLFormElement).isSquare.checked; // Accéder à l'état de isSquare

          // Ajouter les valeurs des checkboxes au formData
          formData.append("isActive", String(isActive));
          formData.append("isSquare", String(isSquare));

          // Appeler la fonction de création de bannière
          handleBannerCreation(formData);
        }}
        className="bg-gray-800 p-5 rounded-lg shadow-lg mb-10"
      >
        <input
          type="text"
          name="title"
          placeholder="Titre"
          required
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
        />
        <div className="mb-4">
          <label htmlFor="link" className="block mb-1">
            Page liée:
          </label>
          <select
            name="link"
            id="link"
            required
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          >
            <option value="/artists">Artists</option>
            <option value="/events">Events</option>
            <option value="/merch">Merch</option>
          </select>
        </div>

        {/* Ajout des cases à cocher */}
        <div className="mb-4">
          <label className="block mb-2">
            <input type="checkbox" name="isActive" className="mr-2" />
            Activer la bannière
          </label>
          <label className="block mb-4">
            <input type="checkbox" name="isSquare" className="mr-2" />
            Format carré
          </label>
        </div>

        <div className="mb-4">
          <h2 className="text-lg mb-2">Sélectionner une image</h2>
          <button
            type="button"
            onClick={() => handleImageSelection("/event/image1.jpg")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 mr-2"
            disabled={isLoading}
          >
            {`Choisir une image d'événement`}
          </button>
          <button
            type="button"
            onClick={() => handleImageSelection("/album/image1.jpg")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
            disabled={isLoading}
          >
            {`Choisir une image d'album`}
          </button>
          <button
            type="button"
            onClick={() => handleImageSelection("/merch/image1.jpg")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 ml-2"
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
          className="mt-5 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
        >
          Créer Bannière
        </button>
      </form>

      {/* Liste des bannières */}
      <div className="mt-10">
        <h2 className="text-xl mb-3">Bannières existantes</h2>
        <ul>
          {banners.map((banner) => (
            <BannerList
              key={banner.id}
              banner={banner}
              onDelete={handleBannerDeletion}
              onUpdate={async (formData: FormData) => {
                await updateBanner(formData);
                const result = await getBanners();
                setBanners(result);
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BannerDashboard;
