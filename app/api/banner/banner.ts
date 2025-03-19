"use server";

import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/connect";

export const createBanner = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const link = formData.get("link") as string;
  const isActive = formData.get("isActive") === "true";
  const isSquare = formData.get("isSquare") === "true";
  const imageFile = formData.get("imageFile") as File;
  const url = formData.get("url") as string;

  let imageUrl = "";

  if (url && imageFile.size === 0) {
    imageUrl = url;
  } else if (imageFile instanceof File) {
    const base64Data = await imageFile.arrayBuffer();
    const buffer = Buffer.from(base64Data);

    // Utilisation d'une promesse pour l'upload
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "banners" },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary Upload Error: ${error.message}`));
          } else {
            resolve(result); // On résout le résultat ici
          }
        }
      );

      uploadStream.end(buffer); // Fin de l'envoi du buffer
    });

    // Vérifiez si le résultat a un secure_url
    if (uploadResult && "secure_url" in uploadResult) {
      imageUrl = uploadResult.secure_url;
    } else {
      throw new Error("Upload to Cloudinary failed.");
    }
  } else if (typeof imageFile === "string") {
    // Si imageFile est une chaîne, cela signifie qu'il s'agit d'une URL d'image
    imageUrl = imageFile; // Utilisez l'URL directement
  } else {
    throw new Error("No valid image file or URL provided.");
  }

  // Créer la bannière avec l'URL de l'image uploadée
  const banner = await prisma.banner.create({
    data: {
      title,
      link,
      isSquare,
      imageUrl,
      isActive,
      slug: title.toLowerCase().replace(/ /g, "-"),
    },
  });

  return banner; // Retournez la bannière créée
};

export const deleteBanner = async (formData: FormData) => {
  const id = formData.get("id") as string;

  const banner = await prisma.banner.delete({
    where: { id: String(id) },
  });

  if (!banner.imageUrl) {
    return banner;
  }

  // Extraire le public_id de l'image (vérifie que ce n'est pas undefined)
  const publicId = banner.imageUrl.split("/").pop() || ""; // Fournir une valeur par défaut

  if (!publicId) {
    console.error("Public ID de l'image non trouvé.");
    return banner;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Résultat de suppression sur Cloudinary :", result);
  } catch (error) {
    console.error("Erreur lors de la suppression sur Cloudinary :", error);
  }

  return { message: "Banner deleted successfully" };
};

export const updateBanner = async (formData: FormData) => {
  const id = formData.get("id") as string;

  // Initialisation de l'objet de mise à jour
  const updateData: {
    title?: string;
    link?: string;
    isActive?: boolean;
    isSquare?: boolean;
    slug?: string;
  } = {};

  // Vérification de la présence des champs avant de les ajouter à updateData
  if (formData.has("title")) {
    updateData.title = formData.get("title") as string;
    updateData.slug = updateData.title
      .toLowerCase()
      .replace(/ /g, "-") as string;
  }

  if (formData.has("link")) {
    updateData.link = formData.get("link") as string;
  }

  if (formData.has("isActive")) {
    updateData.isActive = formData.get("isActive") === "true";
  }

  if (formData.has("isSquare")) {
    updateData.isSquare = formData.get("isSquare") === "true"; // Assure-toi de récupérer la valeur pour isSquare
  }

  // Mise à jour du banner avec seulement les champs fournis
  const banner = await prisma.banner.update({
    where: { id: String(id) },
    data: updateData, // Utilisation de l'objet updateData
  });

  return banner;
};
