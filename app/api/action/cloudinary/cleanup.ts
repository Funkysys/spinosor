"use server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/connect";

export const cleanupUnusedImages = async () => {
  try {
    // 1. Récupérer toutes les images de Cloudinary
    const { resources } = await new Promise<any>((resolve, reject) => {
      cloudinary.api.resources(
        {
          type: "upload",
          prefix: "", // Récupère toutes les images
          max_results: 500, // Ajustez selon vos besoins
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // 2. Récupérer toutes les images utilisées dans la base de données
    const [artists, albums, events] = await Promise.all([
      prisma.artist.findMany({ select: { imageUrl: true } }),
      prisma.album.findMany({ select: { imageUrl: true } }),
      prisma.event.findMany({ select: { imageUrl: true } })
    ]);

    // Créer un set des public IDs utilisés
    const usedPublicIds = new Set<string>();
    
    // Fonction pour extraire le public ID d'une URL Cloudinary
    const getPublicIdFromUrl = (url: string | null) => {
      if (!url) return null;
      return url
        .replace(/.*\/upload\/(?:v\d+\/)?/, "")
        .split(".")[0];
    };

    // Ajouter tous les public IDs utilisés au set
    [...artists, ...albums, ...events].forEach(item => {
      const publicId = getPublicIdFromUrl(item.imageUrl);
      if (publicId) usedPublicIds.add(publicId);
    });

    // 3. Trouver et supprimer les images non utilisées
    const unusedImages = resources.filter(
      (resource: any) => !usedPublicIds.has(resource.public_id)
    );

    // Supprimer les images non utilisées
    const deletionResults = await Promise.all(
      unusedImages.map((image: any) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(
            image.public_id,
            (error: any, result: any) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
        })
      )
    );

    return {
      success: true,
      message: `${deletionResults.length} images inutilisées ont été supprimées.`,
      deletedImages: unusedImages.map((img: any) => img.public_id)
    };

  } catch (error) {
    console.error("Erreur lors du nettoyage des images:", error);
    throw new Error("Échec du nettoyage des images inutilisées");
  }
};
