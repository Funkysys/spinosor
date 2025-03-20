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

  // Fonction pour gérer le clic sur "En savoir plus"
  const handleLearnMore = (id: string) => {
    router.push(`/home/events/${id}`);
  };

  if (!isMounted) {
    return null; // Attendre que le composant soit monté côté client
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
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
