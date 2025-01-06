"use client";

import { getEvents } from "@/app/api/action/events/events";
import { Event } from "@prisma/client";
import { useRouter } from "next/navigation"; // Utilisé pour la navigation
import { useEffect, useState } from "react";

const EventsPage: React.FC = () => {
  const router = useRouter();
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchEvents = async () => {
      const data = await getEvents();
      setEventsData(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  useEffect(() => {
    const today = new Date();
    const upcoming = eventsData.filter((event) => event.date >= today);
    const past = eventsData.filter((event) => event.date < today);

    setUpcomingEvents(upcoming);
    setPastEvents(past);
  }, [eventsData]);

  // Fonction pour gérer le clic sur "En savoir plus"
  const handleLearnMore = (id: string) => {
    router.push(`/home/events/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-perso-bg text-perso-white-two mb-20">
      <h1 className="text-4xl font-bold text-center mb-8 text-perso-white-two">
        Événements
      </h1>

      {/* Événements à venir */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-slate-400">
          Événements à venir
        </h2>
        <table className="min-w-full bg-perso-bg border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-perso-yellow-one">
                {`Nom de l'événements`}
              </th>
              <th className="py-2 px-4 border-b-2 border-perso-yellow-one">
                Date
              </th>
              <th className="py-2 px-4 border-b-2 border-perso-yellow-one">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <tr key={event.id}>
                  <td className="py-2 px-4 border-b">{event.title}</td>
                  <td className="py-2 px-4 border-b">
                    {event.date.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleLearnMore(event.id)}
                      className="bg-perso-yellow-one text-perso-bg px-4 py-2 rounded hover:bg-red-400 hover:text-perso-bg transition"
                    >
                      En savoir +
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-2 px-4 text-center">
                  {`Pas d'événements à venir.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Événements passés */}
      <div>
        <h2 className="text-3xl font-semibold mb-6 text-slate-400">
          Événements passés
        </h2>
        <table className="min-w-full bg-perso-bg border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-perso-yellow-one">
                {`Nom de l'événements`}
              </th>
              <th className="py-2 px-4 border-b-2 border-perso-yellow-one">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <tr key={event.id}>
                  <td className="py-2 px-4 border-b">{event.title}</td>
                  <td className="py-2 px-4 border-b">
                    {event.date.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-2 px-4 text-center">
                  {`Pas d'événements passés.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsPage;
