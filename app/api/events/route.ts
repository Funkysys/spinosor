import prisma from "@/lib/connect";
import { EventWithArtists } from "@/types";

export const GET_EVENT = async (id: string) => {
  try {
    if (!id && id !== "" && typeof id !== "string") {
      throw new Error("L'identifiant de l'événement est requis.");
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        artists: true, // Inclure les événements associés
      },
    });

    if (!event) {
      throw new Error(`Aucun événement trouvé avec l'identifiant : ${id}`);
    }

    return event as EventWithArtists;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement :", error);
    return null;
  }
};

export const GET_EVENTS_IDS_AND_NAMES = async () => {
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

export const GET_EVENTS = async () => {
  const events = await prisma.event.findMany({
    include: {
      artists: true, // Inclut les artistes dans les résultats
    },
  });
  return events;
};

export const GET_ARTISTS = async () => {
  return await prisma.artist.findMany();
};
