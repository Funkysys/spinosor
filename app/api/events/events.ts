"use server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/connect";
import { revalidatePath } from "next/cache";

export const createEvent = async (formData: FormData) => {
  console.log("🔧 [createEvent] FormData reçu:");
  Array.from(formData.entries()).forEach(([key, value]) => {
    console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
  });
  
  // Next.js peut préfixer les clés avec un numéro, on les nettoie
  const getFormValue = (key: string): string | File | null => {
    // Essayer d'abord la clé normale
    const direct = formData.get(key);
    if (direct) return direct as string | File;
    
    // Sinon chercher avec préfixe numérique (1_title, 2_title, etc.)
    const entries = Array.from(formData.entries());
    for (const [formKey, formValue] of entries) {
      if (formKey.endsWith(`_${key}`)) {
        return formValue as string | File;
      }
    }
    return null;
  };
  
  const getAllFormValues = (key: string): string[] => {
    const values: string[] = [];
    Array.from(formData.entries()).forEach(([formKey, formValue]) => {
      if (formKey === key || formKey.endsWith(`_${key}`)) {
        values.push(formValue as string);
      }
    });
    return values;
  };
  
  const title = getFormValue("title") as string;
  const description = getFormValue("description") as string | null;
  const location = getFormValue("location") as string;
  const dateStr = getFormValue("date") as string;
  const date = new Date(dateStr);
  const ticketLink = getFormValue("ticketLink") as string | null;
  const artistIds = getAllFormValues("artists");
  const imageFile = getFormValue("imageFile") as File;
  const url = getFormValue("url") as string | null;
  
  console.log("📋 [createEvent] Données extraites:");
  console.log("  title:", title);
  console.log("  location:", location);
  console.log("  date:", date);
  console.log("  artistIds:", artistIds);

  let imageUrl = "";
  if (url && (!imageFile || imageFile.size === 0)) {
    imageUrl = url;
    console.log("🖼️ [createEvent] Utilisation de l'image depuis URL:", url);
  } else if (imageFile && imageFile.size > 0) {
    console.log("📤 [createEvent] Upload de l'image vers Cloudinary...");
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

  console.log("💾 [createEvent] Création de l'événement dans la DB...");
  const event = await prisma.event.create({
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
  
  console.log("✅ [Événement créé:", {
    id: event.id,
    slug: event.slug,
    title: event.title,
    artistsCount: artistIds.length,
  });
  
  // Invalider le cache Next.js
  revalidatePath('/api/events');
  revalidatePath('/admin/events');
  revalidatePath('/home/events');
  revalidatePath(`/home/events/${event.slug}`);
  console.log("🔄 [createEvent] Cache invalidé pour slug:", event.slug);
  return event;
};

export const updateEvent = async (id: string, formData: FormData) => {
  console.log("🔄 [updateEvent] Mise à jour événement ID:", id);
  console.log("📝 [updateEvent] FormData reçu:");
  Array.from(formData.entries()).forEach(([key, value]) => {
    console.log(`  ${key}:`, value);
  });

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

  // Récupérer les IDs des artistes
  const artistIds: string[] = [];
  formData.forEach((value, key) => {
    if (key === "artists") {
      artistIds.push(value as string);
    }
  });
  
  console.log("👥 [updateEvent] Artistes à connecter:", artistIds);

  const updatedEvent = await prisma.event.update({
    where: { id },
    data: {
      ...updateData,
      artists: {
        set: [], // Déconnecter tous les artistes d'abord
        connect: artistIds.map((artistId) => ({ id: artistId })),
      },
    },
  });
  
  // Invalider le cache
  revalidatePath('/api/events');
  revalidatePath('/admin/events');
  revalidatePath('/home/events');
  revalidatePath(`/home/events/${updatedEvent.slug}`);
  
  return updatedEvent;
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

  // Invalider le cache
  revalidatePath('/api/events');
  revalidatePath('/admin/events');
  revalidatePath('/home/events');
  
  return event;
};
