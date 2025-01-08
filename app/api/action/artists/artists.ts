"use server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/connect";
import { JsonArray } from "@prisma/client/runtime/library";

export const getArtists = async () => {
  const artists = prisma.artist.findMany();
  return artists;
};

export const getArtistIdsAndNames = async () => {
  try {
    const artists = await prisma.artist.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return artists;
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes :", error);
    return [];
  }
};

export const getArtistsWithEvents = async () => {
  try {
    const artists = await prisma.artist.findMany({
      include: {
        events: true, // Inclure les événements associés
      },
    });

    // Transformer les données avant de les retourner
    return artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      bio: artist.bio,
      genre: artist.genre,
      imageUrl: artist.imageUrl,
      // Si socialLinks est déjà un objet, inutile de faire un JSON.parse
      socialLinks:
        typeof artist.socialLinks === "string"
          ? JSON.parse(artist.socialLinks)
          : artist.socialLinks,
      events: artist.events.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date.toISOString(), // Conversion de Date en string
        location: event.location,
        ticketLink: event.ticketLink || undefined,
      })),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes :", error);
    return [];
  }
};

export const getArtist = async (id: string) => {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: {
        events: true, // Inclure les événements associés
      },
    });
    return artist;
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes :", error);
    return [];
  }
};

export const createArtist = async (formData: FormData, link: JsonArray) => {
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string | null;
  const genre = formData.get("genre") as string | null;
  const socialLinks = link;
  const imageFile = formData.get("imageFile") as File | null;

  let imageUrl = "";

  // Uploader l'image sur Cloudinary
  if (imageFile) {
    const base64Data = await imageFile.arrayBuffer();
    const buffer = Buffer.from(base64Data);

    // Utilisation d'une promesse pour l'upload
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "artists" },
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
  }

  // Créer l'artiste avec les données fournies
  const artist = await prisma.artist.create({
    data: {
      name,
      bio,
      genre,
      imageUrl,
      socialLinks: socialLinks,
    },
  });

  return artist;
};

export const updateArtist = async (
  id: string,
  formData: FormData,
  actualImage: string | null
) => {
  const updateData: {
    name?: string;
    bio?: string | null;
    genre?: string | null;
    imageUrl?: File | null;
    socialLinks?: { [key: string]: any } | undefined;
  } = {};

  const imageFile = formData.get("imageUrl") as File | null;

  let image = "";

  // Vérifiez et mettez à jour le nom
  if (formData.has("name")) {
    updateData.name = formData.get("name") as string;
  }

  // Vérifiez et mettez à jour la bio
  if (formData.has("bio")) {
    updateData.bio = formData.get("bio") as string | null;
  }

  // Vérifiez et mettez à jour le genre
  if (formData.has("genre")) {
    updateData.genre = formData.get("genre") as string | null;
  }

  // Vérifiez et mettez à jour l'URL de l'image

  if (imageFile && imageFile?.size > 0) {
    console.log("imageUrl", imageFile);

    if (!actualImage && actualImage !== "") {
      throw new Error("Actual image not found.");
    }
    const publicId = actualImage.split("/").pop() || ""; // Fournir une valeur par défaut

    if (!publicId) {
      console.error("Public ID de l'image non trouvé.");
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Résultat de suppression sur Cloudinary :", result);
    } catch (error) {
      console.error("Erreur lors de la suppression sur Cloudinary :", error);
    }

    const base64Data = await imageFile?.arrayBuffer();

    if (!base64Data) {
      throw new Error("Failed to get array buffer from imageUrl.");
    }

    const buffer = Buffer.from(base64Data);

    // Utilisation d'une promesse pour l'upload
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "trikcs" },
          (error, result) => {
            if (error) {
              reject(new Error(`Cloudinary Upload Error: ${error.message}`));
            } else {
              if (result) {
                resolve(result);
              } else {
                reject(new Error("Cloudinary upload result is undefined"));
              }
            }
          }
        );

        uploadStream.end(buffer);
      }
    );

    if (uploadResult && "secure_url" in uploadResult) {
      image = uploadResult.secure_url;
    } else {
      throw new Error("Upload to Cloudinary failed.");
    }
  } else {
    image = actualImage || "";
  }

  // Vérifiez et mettez à jour les liens sociaux
  if (formData.has("socialLinks")) {
    const socialLinksString = formData.get("socialLinks") as string | null;

    // Transformation des liens sociaux en un objet clé-valeur
    if (socialLinksString) {
      const linksArray = socialLinksString
        .split(",")
        .map((link) => link.trim());
      updateData.socialLinks = linksArray.reduce((acc, link) => {
        const [key, value] = link.split("=>").map((part) => part.trim());
        acc[key] = value; // Ajoute l'entrée clé-valeur
        return acc;
      }, {} as Record<string, string>);
    } else {
      updateData.socialLinks = {}; // Assurez-vous que ça soit un objet
    }
  }

  // Effectuer la mise à jour dans la base de données
  return await prisma.artist.update({
    where: { id },
    data: {
      name: updateData.name,
      bio: updateData.bio,
      genre: updateData.genre,
      imageUrl: image,
      socialLinks: updateData.socialLinks,
    },
  });
};

export const deleteArtist = async (artistId: string) => {
  const artist = await prisma.artist.delete({
    where: { id: artistId },
  });
  if (!artist.imageUrl) {
    return artist;
  }

  // Extraire le public_id de l'image (vérifie que ce n'est pas undefined)
  const publicId = artist.imageUrl.split("/").pop() || ""; // Fournir une valeur par défaut

  if (!publicId) {
    console.error("Public ID de l'image non trouvé.");
    return artist;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Résultat de suppression sur Cloudinary :", result);
  } catch (error) {
    console.error("Erreur lors de la suppression sur Cloudinary :", error);
  }

  return artist;
};
