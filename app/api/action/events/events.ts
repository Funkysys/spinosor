import prisma from "@/lib/connect";

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

  return await prisma.event.create({
    data: {
      title,
      description,
      location,
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
