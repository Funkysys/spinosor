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
    await setUser(data);
    if (!data) return router.push("/"); // Redirection si l'utilisateur n'est pas trouvé
    (await data.role) !== "USER" && router.push("/"); // Redirection si l'utilisateur n'est pas ADMIN
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
    <div className="min-h-screen bg-perso-bg text-perso-white-one p-6 ">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-200 mb-6 border-b-2 border-perso-yellow-one">
          Tableau de Bord User
        </h1>
        <p className="mb-8 text-gray-400">
          Bienvenue <span className="font-semibold">{user?.name}</span>,
          {`vous êtes connecté en tant qu'utilisateur.`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Liste des sections */}
          <Link
            href={`/user/${session?.user?.email}`}
            className="block p-6 bg-perso-white-one shadow-md rounded-lg hover:bg-red-400 transition duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {`Gestion de vos informations personnelles`}
            </h2>
            <p className="text-gray-600 mt-2">
              {`Acceder et modifier vos informations.`}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
