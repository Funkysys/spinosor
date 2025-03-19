import prisma from "@/lib/connect";

export const GET_USER = async (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    throw new Error("Invalid email address");
  }
  return await prisma.user.findUnique({
    where: { email },
  });
};
