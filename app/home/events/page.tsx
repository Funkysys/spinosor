import Events from "@/components/Events";

const EventsPage: React.FC = () => {
  return (
    <div className="min-h-screen p-5 bg-perso-bg text-perso-white-two ">
      <h1 className="text-4xl font-bold text-center mb-8 text-perso-white-two">
        Événements
      </h1>
      <Events />
    </div>
  );
};

export default EventsPage;
