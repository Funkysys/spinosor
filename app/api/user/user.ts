"use server";

import prisma from "@/lib/connect";
import { Prisma, Role } from "@prisma/client";

export const updateRole = async (email: string, role: Role) => {
  const post = await prisma.user.update({
    where: { email },
    data: {
      role,
    },
  });
  return post;
};

export const deleteUser = async (email: string) => {
  const post = await prisma.user.delete({
    where: { email },
  });
  return post;
};

export const updateUser = async (
  email: string,
  data: Prisma.UserUpdateInput
) => {
  const { email: _, ...updatedData } = data; // Exclure l'email de la mise à jour

  return await prisma.user.update({
    where: { email },
    data: updatedData,
  });
};
