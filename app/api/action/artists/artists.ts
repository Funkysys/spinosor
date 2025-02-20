"use server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/connect";
import { ArtistWithAlbums } from "@/types";
import { JsonArray } from "@prisma/client/runtime/library";

export const getArtists = async (): Promise<ArtistWithAlbums[]> => {
  try {
    console.log("Début de la récupération des artistes");
    console.log("État de la connexion Prisma:", !!prisma);

    if (!prisma) {
      throw new Error("La connexion Prisma n'est pas initialisée");
    }

    const artists = await prisma.artist.findMany({
      include: {
        albums: true,
      },
    });

    console.log(`${artists.length} artistes trouvés`);
    return artists;
  } catch (error) {
    console.error("Erreur détaillée lors de la récupération des artistes:", {
      error,
      errorName: error instanceof Error ? error.name : "Unknown error",
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      prismaExists: !!prisma,
      nodeEnv: process.env.NODE_ENV,
    });
    throw error;
  }
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

export const getArtistIds = async () => {
  try {
    const artists = await prisma.artist.findMany({
      select: {
        id: true,
      },
    });
    return artists;
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes :", error);
    return [];
  }
};

export const getArtistNames = async () => {
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

export const getArtist = async (id: string) => {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: {
        events: true,
        albums: true, // Include albums as well
      },
    });
    return artist;
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes :", error);
    return [];
  }
};

export const getArtistByName = async (name: string) => {
  try {
    const artist = await prisma.artist.findUnique({
      where: { name },
      include: {
        events: true,
        albums: true, // Include albums as well
      },
    });
    return artist;
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes :", error);
    return [];
  }
};

export const getArtistsWithEvents = async () => {
  try {
    const artists = await prisma.artist.findMany({
      include: {
        events: true,
      },
    });

    // Transformer les données pour convertir les dates en chaînes
    return artists.map((artist) => ({
      ...artist,
      events: artist.events.map((event) => ({
        ...event,
        date: event.date.toISOString(),
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
      })),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes :", error);
    return [];
  }
};

export const createArtist = async (formData: FormData, link: JsonArray) => {
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string | null;
  const genre = formData.get("genre") as string | null;
  const videoUrl = formData.get("videoUrl") as string | null;
  const socialLinks = link;
  const imageFile = formData.get("imageFile") as File | null;
  const codePlayer = formData.get("codePlayer") as string | null;
  const urlPlayer = formData.get("urlPlayer") as string | null;

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

  const artist = await prisma.artist.create({
    data: {
      name,
      bio,
      genre,
      imageUrl,
      videoUrl,
      codePlayer,
      urlPlayer,
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
    videoUrl?: string | null;
    codePlayer?: string | null;
    urlPlayer?: string | null;
    socialLinks?: { [key: string]: any } | undefined;
  } = {};

  const imageFile = formData.get("imageUrl") as File | null;

  let image = "";

  if (formData.has("name")) {
    updateData.name = formData.get("name") as string;
  }
  if (formData.has("codePlayer")) {
    updateData.codePlayer = formData.get("codePlayer") as string;
  }
  if (formData.has("urlPlayer")) {
    updateData.urlPlayer = formData.get("urlPlayer") as string;
  }

  if (formData.has("bio")) {
    updateData.bio = formData.get("bio") as string | null;
  }

  if (formData.has("genre")) {
    updateData.genre = formData.get("genre") as string | null;
  }
  if (formData.has("videoUrl")) {
    updateData.videoUrl = formData.get("videoUrl") as string | null;
  }

  if (imageFile && imageFile?.size > 0) {
    console.log("imageUrl", imageFile);

    if (!actualImage && actualImage !== "") {
      throw new Error("Actual image not found.");
    }
    const publicId = actualImage
      .replace(/.*\/upload\/(?:v\d+\/)?/, "")
      .split(".")[0];

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

  if (formData.has("socialLinks")) {
    const socialLinksString = formData.get("socialLinks") as string | null;

    if (socialLinksString) {
      try {
        const linksArray = JSON.parse(socialLinksString);

        if (Array.isArray(linksArray)) {
          updateData.socialLinks = linksArray
            .map((link) => {
              if (link.name && link.url) {
                return { id: link.id, name: link.name, url: link.url };
              }
              return null;
            })
            .filter((item) => item !== null);
        } else {
          console.error("Le format des liens sociaux n'est pas un tableau");
          updateData.socialLinks = []; // Valeur par défaut
        }
      } catch (error) {
        console.error("Erreur lors du parsing JSON :", error);
        updateData.socialLinks = [];
      }
    } else {
      updateData.socialLinks = [];
    }
  }

  return await prisma.artist.update({
    where: { id },
    data: {
      name: updateData.name,
      bio: updateData.bio,
      genre: updateData.genre,
      imageUrl: image,
      videoUrl: updateData.videoUrl,
      codePlayer: updateData.codePlayer,
      urlPlayer: updateData.urlPlayer,
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

  const publicId = artist.imageUrl
    .replace(/.*\/upload\/(?:v\d+\/)?/, "")
    .split(".")[0];

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
