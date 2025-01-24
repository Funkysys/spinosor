"use server";
import cloudinary from "@/lib/cloudinary";
import { Album } from "@prisma/client";
import { JsonArray } from "@prisma/client/runtime/library";

export const getAlbums = async () => {
  try {
    const albums = await prisma.album.findMany();
    return albums;
  } catch (error) {
    console.error("Error getting the albums:", error);
    throw error;
  }
};

export const getAlbum = async (id: string) => {
  try {
    const album = await prisma.album.findUnique({
      where: { id },
      include: { artist: true },
    });
    return album;
  } catch (error) {
    console.error("Error getting the album:", error);
    throw error;
  }
};

export const getAlbumsByArtistId = async (artistId: string) => {
  try {
    const albums = await prisma.album.findMany({
      where: { artistId },
    });
    return albums;
  } catch (error) {
    console.error("Error getting the albums by artist ID:", error);
    throw error;
  }
};

export const getAlbumsIds = async () => {
  try {
    const albums = await prisma.album.findMany({
      select: { id: true },
    });
    return albums.map((album) => album.id);
  } catch (error) {
    console.error("Error getting the albums IDs:", error);
    throw error;
  }
};

export const createAlbum = async (formData: FormData, links: JsonArray) => {
  try {
    const imageFile = formData.get("imageFile") as File | null;
    console.log(
      "Type de imageFile dans createAlbum :",
      imageFile?.constructor.name
    );

    let uploadedImageUrl = null;

    if (imageFile) {
      const base64Image = await imageFile.arrayBuffer();
      const buffer = Buffer.from(base64Image);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "albums" },
          (error, result) => {
            if (error)
              reject(new Error(`Cloudinary Upload Error: ${error.message}`));
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
      if (uploadResult && "secure_url" in uploadResult) {
        uploadedImageUrl = uploadResult.secure_url;
      } else {
        throw new Error("Upload to Cloudinary failed.");
      }
    }

    const title = formData.get("title")?.toString();
    const artistId = formData.get("artistId")?.toString();

    const album = await prisma.album.create({
      data: {
        title: title!,
        artistId: artistId!,
        imageUrl: uploadedImageUrl!,
        releaseDate: new Date(),
        links,
      },
    });

    return album;
  } catch (error) {
    console.error("Erreur lors de la création de l'album :", error);
    throw new Error("Erreur lors de la création de l'album");
  }
};

export const updateAlbum = async (
  id: string,
  formData: FormData,
  actualImage: string | null
) => {
  const updateData: {
    title?: string;
    releaseDate?: Date;
    links?: object;
    imageUrl?: string;
    artists?: {
      connect?: { id: string }[];
      disconnect?: { id: string }[];
    };
  } = {};

  const imageFile = formData.get("imageUrl") as File | null;
  let imageUrl = actualImage || "";

  if (formData.has("title")) {
    updateData.title = formData.get("title") as string;
  }

  if (formData.has("releaseDate")) {
    const releaseDateString = formData.get("releaseDate") as string;
    updateData.releaseDate = new Date(releaseDateString);
  }

  if (formData.has("links")) {
    const linksString = formData.get("links") as string;
    try {
      updateData.links = JSON.parse(linksString);
    } catch (error) {
      throw new Error("Invalid JSON format for links.");
    }
  }

  if (imageFile && imageFile.size > 0) {
    const base64Data = await imageFile.arrayBuffer();
    const buffer = Buffer.from(base64Data);

    if (actualImage) {
      const publicId = actualImage.split("/").pop() || "";
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error("Error deleting the old image from Cloudinary:", error);
        }
      }
    }

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "albums" },
        (error, result) => {
          if (error)
            reject(new Error(`Cloudinary upload error: ${error.message}`));
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    imageUrl = uploadResult.secure_url;
  }

  updateData.imageUrl = imageUrl;

  try {
    const updatedAlbum = await prisma.album.update({
      where: { id },
      data: updateData,
    });
    return updatedAlbum;
  } catch (error) {
    console.error("Error updating the album:", error);
    throw error;
  }
};

export const deleteAlbum = async (album: Album) => {
  try {
    if (!album.imageUrl) {
      return album;
    }
    const publicId = album.imageUrl
      .replace(/.*\/upload\/(?:v\d+\/)?/, "")
      .split(".")[0];

    if (!publicId) {
      console.error("Public ID de l'image non trouvé.");
      return album;
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Résultat de suppression sur Cloudinary :", result);
    } catch (error) {
      console.error("Erreur lors de la suppression sur Cloudinary :", error);
    }
    const deletedAlbum = await prisma.album.delete({
      where: { id: album.id },
    });
    return deletedAlbum;
  } catch (error) {
    console.error("Error deleting the album:", error);
    throw error;
  }
};
