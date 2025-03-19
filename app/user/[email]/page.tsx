"use client";

import { deleteUser, getUser, updateUser } from "@/app/api/user/user";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPage() {
  const params = useParams();
  const [userData, setUserData] = useState<User | null>();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const email = decodeURIComponent(params.email as string);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await getUser(email);
        await setUserData(data);

        if (!data) return; // Redirection si l'utilisateur n'est pas trouvé
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [email]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData) return; // Empêche de faire une mise à jour si userData est null

    const { name, age, address, city, postalCode, country, phone, image } =
      userData; // Déstructurer les données utilisateur

    try {
      const update = await updateUser(email as string, {
        name,
        age,
        address,
        city,
        postalCode,
        country,
        phone,
        image,
      }); // Passer des valeurs définies

      if (!update) return; // Empêche la redirection si la mise à jour échoue
      else return router.push("/user"); // Rediriger vers la page d'accueil
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const handleDelete = async () => {
    if (!userData) return; // Empêche de supprimer si userData est
    try {
      await deleteUser(email as string);
      alert("User deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-4xl mx-auto bg-perso-bg text-perso-white-one p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6">{`Modifier ou Supprimer l'utilisateur`}</h1>
        {userData && (
          <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Nom
              </label>
              <input
                type="text"
                value={userData.name ? userData.name : ""}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                className="mt-1 block w-full px-2 py-1 border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                {" "}
                Âge
              </label>
              <input
                type="number"
                value={userData.age ? userData.age : 0}
                onChange={(e) =>
                  setUserData({ ...userData, age: parseInt(e.target.value) })
                }
                className="mt-1 block w-full px-2 py-1 border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                {" "}
                Adresse
              </label>
              <input
                type="text"
                value={userData.address ? userData.address : ""}
                onChange={(e) =>
                  setUserData({ ...userData, address: e.target.value })
                }
                className="mt-1 block w-full px-2 py-1 border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                {" "}
                Ville
              </label>
              <input
                type="text"
                value={userData.city ? userData.city : ""}
                onChange={(e) =>
                  setUserData({ ...userData, city: e.target.value })
                }
                className="mt-1 block w-full px-2 py-1 border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                {" "}
                Code postal
              </label>
              <input
                type="text"
                value={userData.postalCode ? userData.postalCode : ""}
                onChange={(e) =>
                  setUserData({ ...userData, postalCode: e.target.value })
                }
                className="mt-1 block w-full px-2 py-1 border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                {" "}
                Pays
              </label>
              <input
                type="text"
                value={userData.country ? userData.country : ""}
                onChange={(e) =>
                  setUserData({ ...userData, country: e.target.value })
                }
                className="mt-1 block w-full px-2 py-1 border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                {" "}
                Téléphone
              </label>
              <input
                type="text"
                value={userData.phone ? userData.phone : ""}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
                className="mt-1 block w-full px-2 py-1 border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <button
              type="submit"
              onClick={handleUpdate}
              className="mt-4 px-4 py-2 bg-blue-600 text-perso-white-one rounded-md shadow-md hover:bg-blue-700"
            >
              Mettre à jour
            </button>
          </form>
        )}
        <button
          onClick={handleDelete}
          className="mt-4 px-4 py-2 bg-perso-yellow-one text-perso-white-one rounded-md shadow-md hover:bg-perso-yellow-two"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
