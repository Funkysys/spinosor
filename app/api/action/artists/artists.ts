"use server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/connect";
import { ArtistWithEvents } from "@/types";
import { JsonArray } from "@prisma/client/runtime/library";

export const getArtists = async () => {
  const artists = prisma.artist.findMany();

  if (!Array.isArray(artists)) {
    return [];
  }
  return artists?.map((artist: ArtistWithEvents) => ({
    id: artist.id,
    name: artist.name,
    bio: artist.bio,
    genre: artist.genre,
    imageUrl: artist.imageUrl,
    socialLinks: artist.socialLinks
      ? JSON.parse(artist.socialLinks as string)
      : {},
    events: artist.events.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date.toString(), // Conversion de Date en string
      location: event.location,
      ticketLink: event.ticketLink || undefined,
    })),
  }));
};

export const getArtistsWithEvents = async () => {
  try {
    const artists = await prisma.artist.findMany({
      include: {
        events: true,
      },
    });

    // Transformer les données avant de les retourner
    return artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      bio: artist.bio,
      genre: artist.genre,
      imageUrl: artist.imageUrl,
      socialLinks: artist.socialLinks
        ? JSON.parse(artist.socialLinks as string)
        : {},
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
  console.log("imageFile", imageFile);

  // Uploader l'image sur Cloudinary
  if (imageFile) {
    const base64Data = await imageFile.arrayBuffer();
    const buffer = Buffer.from(base64Data);
    console.log("buffer", buffer);
    console.log("base64Data", base64Data);

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
      console.log("imageUrl", imageUrl);
    } else {
      throw new Error("Upload to Cloudinary failed.");
    }
  }

  console.log("imageUrl", imageUrl);
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

export const updateArtist = async (id: string, formData: FormData) => {
  const updateData: {
    name?: string;
    bio?: string | null;
    genre?: string | null;
    imageUrl?: string | null;
    socialLinks?: { [key: string]: any } | undefined;
  } = {};

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
  if (formData.has("imageUrl")) {
    updateData.imageUrl = formData.get("imageUrl") as string | null;
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
    data: updateData,
  });
};

export const deleteArtist = async (artistId: string) => {
  await prisma.artist.delete({
    where: { id: artistId },
  });
};
