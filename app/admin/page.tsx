"use client";

import ButtonHome from "@/components/ButtonHome";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [isCleaningImages, setIsCleaningImages] = useState(false);

  const { loading, user } = useProtectedRoute("ADMIN");

  if (loading) {
    return <p>Chargement...</p>;
  }

  const handleCleanupImages = async () => {
    try {
      setIsCleaningImages(true);
      const response = await fetch("/api/cloudinary/cleanup", {
        method: "POST",
      });
      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
      } else {
        throw new Error(result.error || "Erreur lors du nettoyage");
      }
    } catch (error) {
      console.error("Erreur lors du nettoyage des images:", error);
      toast.error("Échec du nettoyage des images");
    } finally {
      setIsCleaningImages(false);
    }
  };

  return (
    <div className="min-h-screen bg-perso-bg text-perso-white-one p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-perso-white-two border-b-2 border-perso-yellow-one">
            Tableau de Bord Admin {user?.name}
          </h1>
          <button
            onClick={handleCleanupImages}
            disabled={isCleaningImages}
            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
              isCleaningImages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isCleaningImages ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Nettoyage en cours...
              </span>
            ) : (
              "Nettoyer les images inutilisées"
            )}
          </button>
        </div>

        <p className="mb-8 text-gray-400">
          Bienvenue <span className="font-semibold">{user?.name}</span>,
          {`vous êtes connecté en tant qu'ADMIN.`}
        </p>
        <ButtonHome />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Liste des sections */}
          <Link
            href="/admin/home"
            className="block p-6 bg-perso-white-two shadow-md rounded-lg hover:bg-red-300 hover:text-perso-white-one transition duration-200"
          >
            <h2 className="text-xl font-semibold text-perso-bg">
              {`Gestion de la bannière de la page d'accueil`}
            </h2>
            <p className="text-gray-600 mt-2">
              {`Modifier les éléments de la bannière sur la page d'accueil.`}
            </p>
          </Link>

          <Link
            href="/admin/artist"
            className="block p-6 bg-perso-white-two shadow-md rounded-lg hover:bg-red-300 hover:text-perso-white-one transition duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Gestion des artistes
            </h2>
            <p className="text-gray-600 mt-2">
              Ajouter, modifier ou supprimer des artistes.
            </p>
          </Link>

          <Link
            href="/admin/events"
            className="block p-6 bg-perso-white-two shadow-md rounded-lg hover:bg-red-300 hover:text-perso-white-one transition duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Gestion des événements
            </h2>
            <p className="text-gray-600 mt-2">
              Planifiez, modifiez ou annulez des événements.
            </p>
          </Link>

          <Link
            href="/admin/mersh"
            className="block p-6 bg-perso-white-two shadow-md rounded-lg hover:bg-red-300 hover:text-perso-white-one transition duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Gestion du merchandising
            </h2>
            <p className="text-gray-600 mt-2">
              Gérez les articles de merchandising connectés à Shopify.
            </p>
          </Link>
          <Link
            href="/admin/contact"
            className="block p-6 bg-perso-white-two shadow-md rounded-lg hover:bg-red-300 hover:text-perso-white-one transition duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Messages reçus via la page de contact
            </h2>
            <p className="text-gray-600 mt-2">
              Consultez et répondez aux messages des utilisateurs.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
