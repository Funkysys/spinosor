"use client";

import { Event } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FuturEvents from "./FuturEvents";
import PastEvents from "./PastEvents";

const Events = () => {
  const router = useRouter();
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await fetch("/api/events", { cache: "no-store" }).then(
        (res) => res.json()
      );
      setEventsData(data);
      setLoading(false);
    };
    fetchEvents();
    setIsMounted(true);
  }, []);

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (eventsData.length > 0) {
      const today = new Date();
      const upcoming = eventsData.filter(
        (event) => new Date(event.date) >= today
      );
      const past = eventsData.filter((event) => new Date(event.date) < today);

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    }
  }, [eventsData]);

  const handleLearnMore = (slug: string) => {
    router.push(`/home/events/${slug}`);
  };

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return eventsData.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-perso-white-two tracking-wider mb-4">
        <span className="text-5xl text-perso-green">À</span> venir
      </h1>
      <div className="relative mt-6">
        <div className="w-32 h-1 bg-perso-green mb-8 relative">
          <div
            className={`absolute -top-1 left-0 w-3 h-3 bg-perso-green rounded-full ${
              isMounted ? "animate-pulse" : ""
            }`}
          ></div>
          <div className="absolute -top-1 right-0 w-3 h-3 bg-perso-green rounded-full"></div>
        </div>
      </div>
      <p className="text-perso-white-two mt-2 text-lg opacity-80">
        De nouveaux événements seront bientôt disponibles
      </p>
      <div className="mt-8 border border-perso-green/30 rounded-lg p-6 bg-black/20 backdrop-blur-sm">
        <p className="text-perso-white-two/60 text-sm italic">
          Revenez prochainement pour découvrir nos prochains concerts
        </p>
      </div>
    </div>
  ) : (
    <>
      <FuturEvents
        upcomingEvents={upcomingEvents}
        handleLearnMore={handleLearnMore}
      />
      <PastEvents pastEvents={pastEvents} handleLearnMore={handleLearnMore} />
    </>
  );
};

export default Events;
