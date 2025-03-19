"use server";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const response = await cloudinary.search
      .expression("folder:events")
      .execute();

    const artistImages = response.resources.map(
      (resource: { url: any }) => resource.url
    );

    return NextResponse.json(artistImages, { status: 200 });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des images d'artistes depuis Cloudinary :",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la récupération des images d'artistes" },
      { status: 500 }
    );
  }
};
