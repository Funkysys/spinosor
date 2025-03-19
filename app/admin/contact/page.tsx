"use client";

import { deleteMessage } from "@/app/api/message/message";
import ButtonHome from "@/components/ButtonHome";
import { ContactMessage } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MessagesListPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  useEffect(() => {
    const fetchMessages = async () => {
      const messagesData = await fetch("/api/messages").then((res) =>
        res.json()
      );
      return setMessages(messagesData);
    };
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen p-5 bg-gray-900 text-slate-200 mb-20">
      <h1 className="text-4xl font-bold text-center mb-8 text-slate-200">
        Messages de Contact
      </h1>
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <h2 className="text-3xl font-semibold  text-slate-400">
            Tous les Messages
          </h2>
          <ButtonHome />
          <Link
            href={`/admin/`}
            className="bg-red-800 text-white ml-6 px-3 py-2 rounded hover:bg-red-400 hover:text-black transition"
          >
            {`Retour à la page d'accueil`}
          </Link>
        </div>
        <table className="min-w-full bg-black border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-red-800">Nom</th>
              <th className="py-2 px-4 border-b-2 border-red-800">Email</th>
              <th className="py-2 px-4 border-b-2 border-red-800">Objet</th>
              <th className="py-2 px-4 border-b-2 border-red-800">Date</th>
              <th className="py-2 px-4 border-b-2 border-red-800">Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map((message) => (
                <tr key={message.id}>
                  <td className="py-2 px-4 border-b">{message.name}</td>
                  <td className="py-2 px-4 border-b">{message.email}</td>
                  <td className="py-2 px-4 border-b">{message.object}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      href={`/admin/contact/${message.id}`}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-400 hover:text-black transition"
                    >
                      Voir Détails
                    </Link>
                    <button
                      onClick={async () => {
                        await deleteMessage(message.id);
                        window.location.reload();
                      }}
                      className="bg-red-800 text-white ml-2 px-3 py-2 rounded hover:bg-red-400 hover:text-black transition"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-2 px-4 text-center">
                  Aucun message trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
