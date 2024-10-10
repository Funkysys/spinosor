"use server";

import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/connect";

// import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est importé si vous l'utilisez.

export const createBanner = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const link = formData.get("link") as string;
  const isActive = formData.get("isActive") === "true";
  const isSquare = formData.get("isSquare") === "true";
  const imageFile = formData.get("imageFile") as File | string;
  const url = formData.get("url") as string;

  let imageUrl = "";

  if (url) {
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
    },
  });

  return banner; // Retournez la bannière créée
};

export const deleteBanner = async (formData: FormData) => {
  const id = formData.get("id") as string;

  await prisma.banner.delete({
    where: { id: String(id) },
  });

  return { message: "Banner deleted successfully" };
};

export const getActiveBanners = async () => {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
  });

  return banners;
};

export const getBanners = async () => {
  const banners = await prisma.banner.findMany();
  return banners;
};

export const updateBanner = async (formData: FormData) => {
  const id = formData.get("id") as string;

  // Initialisation de l'objet de mise à jour
  const updateData: {
    title?: string;
    link?: string;
    isActive?: boolean;
    isSquare?: boolean;
  } = {};

  // Vérification de la présence des champs avant de les ajouter à updateData
  if (formData.has("title")) {
    updateData.title = formData.get("title") as string;
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
