"use server";
import prisma from "@/lib/connect";

export const createMessage = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const messageText = formData.get("message") as string;
  const object = formData.get("object") as string;

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
