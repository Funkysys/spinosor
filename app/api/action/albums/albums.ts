import cloudinary from "@/lib/cloudinary";

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

export const createAlbum = async (formData: FormData, artistIds: string[]) => {
  const imageFile = formData.get("imageUrl") as File | null;
  let imageUrl = "";

  if (!imageFile) {
    throw new Error("No image file provided.");
  }

  const base64Data = await imageFile.arrayBuffer();
  const buffer = Buffer.from(base64Data);

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

  const albumData = {
    title: formData.get("title") as string,
    releaseDate: new Date(formData.get("releaseDate") as string),
    links: JSON.parse(formData.get("links") as string),
    imageUrl,
    artist: {
      connect: { id: artistIds[0] },
    },
  };

  try {
    const newAlbum = await prisma.album.create({
      data: albumData,
    });
    return newAlbum;
  } catch (error) {
    console.error("Error creating the album:", error);
    throw error;
  }
};

export const updateAlbum = async (
  id: string,
  formData: FormData,
  actualImage: string | null,
  artistIdsToConnect: string[],
  artistIdsToDisconnect: string[]
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

  if (artistIdsToConnect.length > 0 || artistIdsToDisconnect.length > 0) {
    updateData.artists = {
      connect: artistIdsToConnect.map((id) => ({ id })),
      disconnect: artistIdsToDisconnect.map((id) => ({ id })),
    };
  }

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

export const deleteAlbum = async (id: string) => {
  try {
    const deletedAlbum = await prisma.album.delete({
      where: { id },
    });
    return deletedAlbum;
  } catch (error) {
    console.error("Error deleting the album:", error);
    throw error;
  }
};
