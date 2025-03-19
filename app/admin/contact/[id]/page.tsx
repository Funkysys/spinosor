"use client";

import { deleteMessage, getMessage } from "@/app/api/message/message";
import { ContactMessage } from "@prisma/client";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MessageDetailPage() {
  const params = useParams();
  const [message, setMessage] = useState<ContactMessage>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const fetchedMessage = await getMessage(String(params.id)); // Récupération du message
        if (!fetchedMessage) {
          setError(true);
        } else {
          setMessage(fetchedMessage);
        }
      } catch (err) {
        setError(true);
      }
    };

    fetchMessage();
  }, [params.id]);

  if (error) {
    return notFound(); // Gère le cas où le message n'existe pas
  }

  if (!message) {
    return (
      <div className="min-h-screen p-5 bg-gray-900 text-slate-200 mb-20">
        <p className="text-center text-white">Chargement en cours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-900 text-slate-200 mb-20">
      <div className="flex flex-col w-full items-center justify-center mb-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-slate-200">
          Détails du Message
        </h1>
        <Link
          href={`/admin/contact`}
          className="bg-red-800 text-white ml-6 px-3 py-2 mx-auto rounded hover:bg-red-400 hover:text-black transition"
        >
          Retour à la liste
        </Link>
      </div>

      <div className="bg-black p-5 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{message.object}</h2>
        <p className="text-slate-400 mb-2">
          <span className="font-semibold">Nom :</span> {message.name}
        </p>
        <p className="text-slate-400 mb-2">
          <span className="font-semibold">Email :</span> {message.email}
        </p>
        <p className="text-slate-400 mb-4">
          <span className="font-semibold">Date :</span>{" "}
          {new Date(message.createdAt).toLocaleString()}
        </p>
        <p className="text-white">
          <span className="font-semibold">Message :</span> {message.message}
        </p>
        <div className="w-full flex justify-center">
          <button
            onClick={async () => {
              await deleteMessage(message.id);
              window.location.href = "/admin/contact";
            }}
            className="bg-red-800 text-white mt-5 px-3 py-2 mx-auto rounded hover:bg-red-400 hover:text-black transition"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
