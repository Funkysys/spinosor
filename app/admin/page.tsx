"use client";

import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Utilisation de next/navigation pour router avec Next.js 13+
import { useState } from "react";
import { getUser } from "../api/action/user/user";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>();
  const [isCleaningImages, setIsCleaningImages] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchUser = async () => {
    const data = await getUser(session?.user?.email as string);
    setUser(data);
    if (!data) return router.push("/"); // Redirection si l'utilisateur n'est pas trouvé
    (await data.role) !== "ADMIN" && router.push("/"); // Redirection si l'utilisateur n'est pas ADMIN
  };

  const handleCleanupImages = async () => {
    try {
      setIsCleaningImages(true);
      const response = await fetch('/api/cloudinary/cleanup', {
        method: 'POST'
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

  if (status === "authenticated" && !user) {
    fetchUser();
  }
  // Si la session est en cours de chargement
  if (status === "loading") {
    return (
      <p className="text-center text-xl font-semibold mt-10">Chargement...</p>
    );
  }

  // Si l'utilisateur n'est pas ADMIN ou non connecté
  if (status === "unauthenticated") {
    router.push("/"); // Redirection vers la page d'accueil
    return null;
  }

  return (
    <div className="min-h-screen bg-perso-bg text-perso-white-one p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-perso-white-two border-b-2 border-perso-yellow-one">
            Tableau de Bord Admin
          </h1>
          <button
            onClick={handleCleanupImages}
            disabled={isCleaningImages}
            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
              isCleaningImages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isCleaningImages ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Nettoyage en cours...
              </span>
            ) : (
              'Nettoyer les images inutilisées'
            )}
          </button>
        </div>
        
        <p className="mb-8 text-gray-400">
          Bienvenue <span className="font-semibold">{user?.name}</span>,
          {`vous êtes connecté en tant qu'ADMIN.`}
        </p>

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
