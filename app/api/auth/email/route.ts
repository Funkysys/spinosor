import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const dataFromBody = {
      email: body.email,
    };
    const post = await prisma.email.create({
      data: {
        ...dataFromBody,
      },
    });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
