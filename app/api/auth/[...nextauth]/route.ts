import prisma from "@/lib/connect";
import { NextApiResponse } from "next";

export default async function handler(
  req: NextApiResponse,
  res: NextApiResponse
) {
  const users = await prisma.user.findMany();
  res.json(users);
}
