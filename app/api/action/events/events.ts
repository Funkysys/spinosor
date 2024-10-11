"use server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/connect";
import { EventWithArtists } from "@/types";

export const getEvent = async (id: string) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        artists: true, // Inclure les événements associés
      },
    });
    return event as EventWithArtists;
  } catch (error) {
    console.error("Erreur lors de la récupération de :", error);
    return [];
  }
};

export const getEventstIdsAndNames = async () => {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
      },
    });
    return events;
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes :", error);
    return [];
  }
};

export const getEvents = async () => {
  const events = await prisma.event.findMany({
    include: {
      artists: true, // Inclut les artistes dans les résultats
    },
  });
  return events;
};

export const getArtists = async () => {
  return await prisma.artist.findMany();
};

export const createEvent = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const location = formData.get("location") as string;
  const date = new Date(formData.get("date") as string);
  const ticketLink = formData.get("ticketLink") as string | null;
  const artistIds = formData.getAll("artists") as string[];
  const imageFile = formData.get("imageFile") as File | null;
  const url = formData.get("url") as string | null;

  let imageUrl = "";
  if (url) {
    imageUrl = url;
  } else if (imageFile) {
    const base64Data = await imageFile.arrayBuffer();
    const buffer = Buffer.from(base64Data);

    // Utilisation d'une promesse pour l'upload
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "events" },
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

  return await prisma.event.create({
    data: {
      title,
      description,
      location,
      imageUrl,
      date,
      ticketLink,
      artists: {
        connect: artistIds.map((id) => ({ id })),
      },
    },
  });
};

export const updateEvent = async (id: string, formData: FormData) => {
  const updateData: {
    title?: string;
    description?: string;
    location?: string;
    date?: Date;
    ticketLink?: string | null;
  } = {};

  if (formData.has("title")) {
    updateData.title = formData.get("title") as string;
  }

  if (formData.has("description")) {
    updateData.description = formData.get("description") as string;
  }

  if (formData.has("location")) {
    updateData.location = formData.get("location") as string;
  }

  if (formData.has("date")) {
    updateData.date = new Date(formData.get("date") as string);
  }

  if (formData.has("ticketLink")) {
    updateData.ticketLink = formData.get("ticketLink") as string | null;
  }

  return await prisma.event.update({
    where: { id },
    data: updateData,
  });
};

export const deleteEvent = async (eventId: string) => {
  return await prisma.event.delete({
    where: { id: eventId },
  });
};
