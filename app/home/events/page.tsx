"use client";

import { useRouter } from "next/navigation"; // Utilisé pour la navigation
import { useEffect, useState } from "react";

interface Event {
  id: number;
  name: string;
  date: string;
}

const EventsPage: React.FC = () => {
  const router = useRouter();

  // Liste factice des événements
  const eventsData: Event[] = [
    { id: 1, name: "Concert Rock", date: "2024-12-01" },
    { id: 2, name: "Festival Jazz", date: "2024-11-15" },
    { id: 3, name: "Expo Art", date: "2024-10-20" },
    { id: 4, name: "Conférence Tech", date: "2024-09-30" },
    { id: 5, name: "Théâtre Moderne", date: "2024-09-25" },
    { id: 6, name: "Soirée Cinéma", date: "2024-08-20" },
    { id: 7, name: "Stand-up Comedy", date: "2024-08-15" },
    { id: 8, name: "Danse Contemporaine", date: "2024-07-05" },
    { id: 9, name: "Salon Livre", date: "2024-06-12" },
    { id: 10, name: "Foire Artisanale", date: "2024-05-18" },
  ];

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  useEffect(() => {
    const today = new Date();
    const upcoming = eventsData.filter(
      (event) => new Date(event.date) >= today
    );
    const past = eventsData.filter((event) => new Date(event.date) < today);

    setUpcomingEvents(upcoming);
    setPastEvents(past);
  }, []);

  // Fonction pour gérer le clic sur "En savoir plus"
  const handleLearnMore = (id: number) => {
    router.push(`/home/events/${id}`);
  };

  return (
    <div className="min-h-screen p-5 bg-black text-slate-200 mb-20">
      <h1 className="text-4xl font-bold text-center mb-8 text-red-600">
        Events
      </h1>

      {/* Événements à venir */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-red-600">
          Upcoming Events
        </h2>
        <table className="min-w-full bg-black border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-red-800">
                Event Name
              </th>
              <th className="py-2 px-4 border-b-2 border-red-800">Date</th>
              <th className="py-2 px-4 border-b-2 border-red-800">Action</th>
            </tr>
          </thead>
          <tbody>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <tr key={event.id}>
                  <td className="py-2 px-4 border-b">{event.name}</td>
                  <td className="py-2 px-4 border-b">{event.date}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleLearnMore(event.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-400 hover:text-black transition"
                    >
                      En savoir +
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-2 px-4 text-center">
                  No upcoming events.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Événements passés */}
      <div>
        <h2 className="text-3xl font-semibold mb-6 text-red-600">
          Past Events
        </h2>
        <table className="min-w-full bg-black border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-red-800">
                Event Name
              </th>
              <th className="py-2 px-4 border-b-2 border-red-800">Date</th>
            </tr>
          </thead>
          <tbody>
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <tr key={event.id}>
                  <td className="py-2 px-4 border-b">{event.name}</td>
                  <td className="py-2 px-4 border-b">{event.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-2 px-4 text-center">
                  No past events.
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
