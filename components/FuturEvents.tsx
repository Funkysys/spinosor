import type { Event } from "../types";
const FuturEvents = ({
  upcomingEvents,
  handleLearnMore,
}: {
  upcomingEvents: Event[];
  handleLearnMore: (slug: string) => void;
}) => {
  return (
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
                  {new Date(event.date).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleLearnMore(event.slug)}
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
  );
};

export default FuturEvents;
