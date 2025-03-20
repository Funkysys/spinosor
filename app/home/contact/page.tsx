"use client";

import { createMessage } from "@/app/api/message/message"; // Import de la fonction createMessage
import { useState, useTransition } from "react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    object: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition(); // Utilisation de la transition pour éviter les blocages

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("object", formData.object);
    form.append("message", formData.message);

    startTransition(async () => {
      try {
        await createMessage(form); // Appel direct à la Server Action
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          object: "",
          message: "",
        });
      } catch (error) {
        setErrorMessage("Erreur lors de l'envoi du message.");
      }
    });
  };

  return (
    <div className="container mx-auto py-10  min-h-[100vh] bg-perso-bg">
      <h1 className="text-4xl font-bold text-center mb-6">Contactez-nous </h1>

      {submitted ? (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center">
          Merci de nous avoir contacté ! Nous reviendrons vers vous bientôt.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-perso-white-one shadow-md rounded-lg p-6 max-w-lg mx-auto animate-fade-right animate-once animate-duration-[1000ms] animate-ease-in-out text-perso-bg"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-semibold mb-2">
              Votre nom :
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-perso-white-two focus:ring-perso-yellow-one"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-semibold mb-2">
              Votre email :
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-perso-white-two focus:ring-perso-yellow-one"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="object"
              className="block text-lg font-semibold mb-2"
            >
              Objet :
            </label>
            <input
              type="text"
              id="object"
              name="object"
              value={formData.object}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-perso-white-two focus:ring-perso-yellow-one"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-lg font-semibold mb-2"
            >
              Message :
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-perso-white-two focus:ring-perso-yellow-one"
              rows={5}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-perso-yellow-one text-perso-white-one py-2 px-4 rounded-lg w-full hover:bg-perso-yellow-two transition duration-300"
          >
            {isPending ? "Envoi en cours..." : "Envoyer"}
          </button>

          {errorMessage && (
            <div className="text-red-500 text-center mt-4">{errorMessage}</div>
          )}
        </form>
      )}
    </div>
  );
};

export default ContactPage;
