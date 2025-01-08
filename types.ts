import { Artist } from "@prisma/client"; // Assure-toi que ce chemin est correct
import { JsonArray, JsonValue } from "@prisma/client/runtime/library";

export interface EventType {
  id: string;
  title: string;
  description: string | null;
  location: string;
  date: Date;
  imageUrl: string | null;
  ticketLink: string | null;
  createdAt: Date;
  updatedAt: Date;
  artists: Artist[]; // Ajoute cette ligne pour inclure les artistes
}

export interface ArtistType {
  id: string;
  name: string | null | undefined;
  bio: string | null | undefined;
  genre: string | null | undefined;
  imageUrl: string | null | undefined;
  socialLinks: JsonArray; // Assurez-vous que cela soit bien défini
  events: EventType[]; // Ajouter les événements ici
}

export interface Event {
  id: string;
  title: string;
  date: string; // Assurez-vous que cela correspond à la structure attendue
  location: string;
  ticketLink?: string | null;
  imageUrl?: string | null;
  description?: string | null;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
}

export interface ArtistWithEvents {
  id: string;
  name: string;
  bio?: string | null;
  genre?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  socialLinks?: JsonValue;
  events: Event[]; // Assurez-vous que cela correspond à Event[]
}
export interface EventWithArtists {
  id: string;
  title: string;
  description: string | null;
  location: string;
  date: Date;
  ticketLink: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  artists: Artist[]; // Assurez-vous que cela correspond à Artist[]
}

export type Category = {
  id: number;
  title: string;
  slug: string;
  description: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  role: string;
  image: string;
};

export type Link = {
  id: number;
  name: string;
  url: string;
};
