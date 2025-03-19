"use server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/connect";

export const createEvent = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const location = formData.get("location") as string;
  const date = new Date(formData.get("date") as string);
  const ticketLink = formData.get("ticketLink") as string | null;
  const artistIds = formData.getAll("artists") as string[];
  const imageFile = formData.get("imageFile") as File;
  const url = formData.get("url") as string | null;

  let imageUrl = "";
  if (url && imageFile.size === 0) {
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
      slug: title.toLowerCase().replace(/ /g, "-"),
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
    slug?: string;
  } = {};

  if (formData.has("title")) {
    updateData.title = formData.get("title") as string;
    updateData.slug = (formData.get("title") as string)
      .toLowerCase()
      .replace(/ /g, "-");
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
  const event = await prisma.event.delete({
    where: { id: eventId },
  });
  if (!event.imageUrl) {
    return event;
  }

  // Extraire le public_id de l'image (vérifie que ce n'est pas undefined)
  const publicId = event.imageUrl.split("/").pop() || ""; // Fournir une valeur par défaut

  if (!publicId) {
    console.error("Public ID de l'image non trouvé.");
    return event;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Résultat de suppression sur Cloudinary :", result);
  } catch (error) {
    console.error("Erreur lors de la suppression sur Cloudinary :", error);
  }

  return event;
};
