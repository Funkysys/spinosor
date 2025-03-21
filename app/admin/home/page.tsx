"use client";

import {
  createBanner,
  deleteBanner,
  updateBanner,
} from "@/app/api/banner/banner";
import BannerList from "@/components/BannerList";
import ButtonHome from "@/components/ButtonHome";
import ModaleImageSelection from "@/components/ModaleImageSelection";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import { Banner as BannerType } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

const BannerDashboard: React.FC = () => {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [galerie, setGalerie] = useState<string[]>([]);
  const [loadImage, setLoadImage] = useState(false);
  const [artists, setArtists] = useState<{ id: string; name: string }[]>([]);
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      const result = await fetch("/api/banners").then((res) => res.json());
      setBanners(result);
    };
    fetchBanners();
    const fetchArtistAndEvents = async () => {
      const artists = await fetch("/api/artists/ids-and-names").then((res) =>
        res.json()
      );
      const events = await fetch("/api/events/ids-and-names").then((res) =>
        res.json()
      );
      setArtists(artists);
      setEvents(events);
    };
    fetchArtistAndEvents();
  }, []);

  const { loading } = useProtectedRoute("ADMIN");

  if (loading) {
    return <p>Chargement...</p>;
  }

  const handleImageSelection = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const resetForm = () => {
    setSelectedImage(null);
  };

  const handleBannerCreation = async (formData: FormData) => {
    setIsLoading(true);

    // Si une image est sélectionnée (à partir de la galerie ou de l'upload)
    if (selectedImage) {
      formData.append("url", selectedImage);
    } else {
      const imageFile = formData.get("imageFile") as File | null;

      if (imageFile) {
        // Vérifiez que le fichier n'est pas vide
        if (imageFile.size === 0) {
          console.error("Le fichier est vide.");
          setIsLoading(false);
          return; // Sortir de la fonction si le fichier est vide
        }

        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = async () => {
          // Vérifiez que reader.result est une chaîne valide
          if (reader.result) {
            formData.append("imageFile", reader.result as string);
          } else {
            console.error("Le résultat de FileReader est vide.");
            setIsLoading(false);
            return; // Sortir de la fonction si le résultat est vide
          }

          try {
            await createBanner(formData);
            resetForm();
            const result = await fetch("/api/banners").then((res) =>
              res.json()
            );
            setBanners(result);
          } catch (error) {
            console.error("Erreur lors de la création de la bannière :", error);
          }
        };
        return; // Sortir de la fonction après avoir déclenché FileReader
      } else {
        console.error("Aucun fichier sélectionné.");
        setIsLoading(false);
        return; // Sortir de la fonction si aucun fichier n'est sélectionné
      }
    }

    // Si l'image est ajoutée (par selectedImage), on crée la bannière
    try {
      await createBanner(formData);
      resetForm();
      const result = await fetch("/api/banners").then((res) => res.json());
      setBanners(result);
    } catch (error) {
      console.error("Erreur lors de la création de la bannière :", error);
    }

    setIsLoading(false);
  };

  const handleBannerDeletion = async (id: string) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("id", id);
    await deleteBanner(formData);
    const result = await fetch("/api/banners").then((res) => res.json());
    setBanners(result);
    setIsLoading(false);
  };
  const showModalFunc = (value: boolean, string: string) => {
    setShowModal(value);
    if (string === "artistes") {
      const fetchGalerie = async () => {
        const images = await fetch("/api/artists-img").then((res) =>
          res.json()
        );
        setGalerie(images);
      };
      fetchGalerie();
    }
    if (string === "events") {
      const fetchGalerie = async () => {
        const images = await fetch("/api/events-img").then((res) => res.json());
        setGalerie(images);
      };
      fetchGalerie();
    }
  };

  return (
    <div className="min-h-screen p-5 bg-perso-bg text-perso-white-one">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Gérer les Bannières
      </h1>
      <ButtonHome />
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
        <label htmlFor="title" className="text-sm text-slate-400">
          Title
        </label>
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
            <option value="/artists">Page Artists</option>
            <option value="/events">Page Events</option>
            <option value="/merch">Page Merch</option>
            <optgroup label="Artistes">
              {artists.map((artist) => (
                <option key={artist.id} value={`/artists/${artist.id}`}>
                  {artist.name}
                </option>
              ))}
            </optgroup>

            <optgroup label="Événements">
              {events.map((event) => (
                <option key={event.id} value={`/events/${event.id}`}>
                  {event.title}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Ajout des cases à cocher */}
        <div className="mb-4">
          <label className="block mb-2">Activer la bannière</label>
          <input type="checkbox" name="isActive" className="mr-2" />
          <label className="block mb-4">Format carré</label>
          <input type="checkbox" name="isSquare" className="mr-2" />
        </div>

        <div className="mb-4">
          <h2 className="text-lg mb-2">Sélectionner une image</h2>
          <button
            type="button"
            onClick={() => showModalFunc(true, "artistes")}
            className="bg-blue-500 text-perso-white-two px-4 py-2 rounded hover:bg-blue-400 mr-2"
            disabled={isLoading}
          >
            {`Choisir une image d'artistes`}
          </button>
          <button
            type="button"
            onClick={() => showModalFunc(true, "events")}
            className="bg-blue-500 text-perso-white-two px-4 py-2 rounded hover:bg-blue-400 mr-2"
            disabled={isLoading}
          >
            {`Choisir une image d'évenements`}
          </button>
          <label htmlFor="imageFile" className="text-sm text-slate-400">
            Image
          </label>
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
          {selectedImage && !loadImage && (
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

          {/* Modale de sélection d'image d'artistes */}
          {showModal && (
            <ModaleImageSelection
              galerie={galerie}
              handleImageSelection={handleImageSelection}
              onClose={() => setShowModal(false)}
              setLoadImage={setLoadImage}
            />
          )}
        </div>
        <button
          type="submit"
          className="mt-5 bg-green-500 text-perso-white-two px-4 py-2 rounded hover:bg-green-400"
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
                const result = await fetch("/api/banners").then((res) =>
                  res.json()
                );
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
