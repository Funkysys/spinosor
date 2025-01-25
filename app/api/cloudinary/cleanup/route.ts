import { NextResponse } from "next/server";
import { cleanupUnusedImages } from "../../action/cloudinary/cleanup";

export async function POST() {
  try {
    const result = await cleanupUnusedImages();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors du nettoyage des images:", error);
    return NextResponse.json(
      { error: "Échec du nettoyage des images" },
      { status: 500 }
    );
  }
}
