"use server";
import cloudinary from "@/lib/cloudinary";

// Fonction pour récupérer les images d'artistes depuis Cloudinary
export const getEventsImages = async (): Promise<string[]> => {
  try {
    const response = await cloudinary.search
      .expression("folder:events")
      .execute();

    const artistImages = response.resources.map(
      (resource: { url: any }) => resource.url
    );

    return artistImages;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des images d'artistes depuis Cloudinary :",
      error
    );
    return [];
  }
};
