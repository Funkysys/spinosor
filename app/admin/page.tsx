"use client";

import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Utilisation de next/navigation pour router avec Next.js 13+
import { useState } from "react";
import { getUser } from "../api/action/user/user";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>();
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchUser = async () => {
    const data = await getUser(session?.user?.email as string);
    setUser(data);
    if (!data) return router.push("/"); // Redirection si l'utilisateur n'est pas trouvé
    (await data.role) !== "ADMIN" && router.push("/"); // Redirection si l'utilisateur n'est pas ADMIN
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-200 mb-6 border-b-2 border-red-800">
          Tableau de Bord Admin
        </h1>
        <p className="mb-8 text-gray-400">
          Bienvenue <span className="font-semibold">{user?.name}</span>,
          {`vous êtes connecté en tant qu'ADMIN.`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Liste des sections */}
          <Link
            href="/admin/home"
            className="block p-6 bg-white shadow-md rounded-lg hover:bg-red-300 hover:text-white transition duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {`Gestion de la bannière de la page d'accueil`}
            </h2>
            <p className="text-gray-600 mt-2">
              {`Modifier les éléments de la bannière sur la page d'accueil.`}
            </p>
          </Link>

          <Link
            href="/admin/artist"
            className="block p-6 bg-white shadow-md rounded-lg hover:bg-red-300 hover:text-white transition duration-200"
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
            className="block p-6 bg-white shadow-md rounded-lg hover:bg-red-300 hover:text-white transition duration-200"
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
            className="block p-6 bg-white shadow-md rounded-lg hover:bg-red-300 hover:text-white transition duration-200"
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
            className="block p-6 bg-white shadow-md rounded-lg hover:bg-red-300 hover:text-white transition duration-200"
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
