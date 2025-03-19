"use server";
import prisma from "@/lib/connect";

// Récupérer tous les messages
export const getMessages = async () => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }, // Optionnel: trier par date de création
    });
    return messages;
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return [];
  }
};

// Récupérer un message par son ID
export const getMessage = async (id: string) => {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });
    return message;
  } catch (error) {
    console.error("Erreur lors de la récupération du message :", error);
    return null;
  }
};

// Créer un nouveau message de contact
export const createMessage = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const messageText = formData.get("message") as string;
  const object = formData.get("object") as string;

  // Créer le message avec les données fournies
  try {
    const message = await prisma.contactMessage.create({
      data: {
        name,
        object,
        email,
        message: messageText,
      },
    });
    return message;
  } catch (error) {
    console.error("Erreur lors de la création du message :", error);
    return null;
  }
};

// Supprimer un message
export const deleteMessage = async (messageId: string) => {
  try {
    await prisma.contactMessage.delete({
      where: { id: messageId },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du message :", error);
  }
};
