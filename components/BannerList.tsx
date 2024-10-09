import { Banner as BannerType } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

interface BannerProps {
  banner: BannerType;
  onDelete: (id: string) => void;
  onUpdate: (formData: FormData) => Promise<void>;
}

const BannerList: React.FC<BannerProps> = ({ banner, onDelete, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    const initialFormData = new FormData();
    initialFormData.append("id", banner.id);
    initialFormData.append("title", banner.title);
    initialFormData.append("link", banner.link);
    initialFormData.append("isActive", banner.isActive.toString());
    initialFormData.append("isSquare", banner.isSquare.toString());
    return initialFormData;
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Appeler la fonction d'update en passant le formData
    onUpdate(formData);
    setIsUpdating(false);
  };

  const updateFormData = (key: string, value: string | boolean) => {
    const newFormData = formData; // Ne pas recréer un nouveau FormData à partir d'un autre FormData
    newFormData.set(key, value.toString()); // Utiliser directement set() sur le formData existant

    setFormData(newFormData); // Mettre à jour l'état avec le FormData modifié
  };

  return (
    <li className="bg-gray-800 p-4 mb-5 rounded-lg shadow">
      {banner.isActive ? (
        <p className="text-green-500 font-semibold">Active</p>
      ) : (
        <p className="text-red-500 font-semibold">Inactive</p>
      )}
      <p className="font-semibold">Titre: {banner.title}</p>
      <p>Lien: {banner.link}</p>
      <div className="w-32 h-32 relative mb-2">
        <Image
          src={banner.imageUrl}
          alt={banner.title}
          layout="fill"
          objectFit="cover"
          className="rounded"
        />
      </div>

      {/* Boutons de mise à jour et suppression */}
      <button
        onClick={() => onDelete(banner.id)}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 mr-2"
      >
        Supprimer
      </button>

      {/* Formulaire de mise à jour intégré sous la bannière */}
      <button
        type="button"
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400"
        onClick={() => setIsUpdating(!isUpdating)}
      >
        {isUpdating ? "Annuler" : "Mettre à jour"}
      </button>

      {isUpdating && (
        <form onSubmit={handleUpdate} className="mt-3">
          <input
            type="text"
            defaultValue={banner.title}
            onChange={(e) => updateFormData("title", e.target.value)}
            required
            className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
          />

          {/* Cases à cocher */}
          <label className="block mb-2">
            <input
              type="checkbox"
              name="isActive"
              className="mr-2"
              defaultChecked={banner.isActive}
              onChange={(e) => updateFormData("isActive", e.target.checked)}
            />
            Activer la bannière
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              name="isSquare"
              className="mr-2"
              defaultChecked={banner.isSquare}
              onChange={(e) => updateFormData("isSquare", e.target.checked)}
            />
            Format carré
          </label>

          <div className="mb-4">
            <label htmlFor="link" className="block mb-1">
              Page liée:
            </label>
            <select
              name="link"
              id="link"
              defaultValue={banner.link}
              onChange={(e) => updateFormData("link", e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            >
              <option value="/artists">Artists</option>
              <option value="/events">Events</option>
              <option value="/merch">Merch</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
          >
            Valider la mise à jour
          </button>
        </form>
      )}
    </li>
  );
};

export default BannerList;
