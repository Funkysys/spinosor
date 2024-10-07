"use server";

import prisma from "@/lib/connect";
import { Role } from "@prisma/client";

export const updateRole = async (email: string, role: Role) => {
  const post = await prisma.user.update({
    where: { email },
    data: {
      role,
    },
  });
  return post;
};
