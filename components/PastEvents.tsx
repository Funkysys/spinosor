import { Event } from "@/types";

const PastEvents = ({
  pastEvents,
  handleLearnMore,
}: {
  pastEvents: Event[];
  handleLearnMore: (id: string) => void;
}) => {
  return (
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
                <button
                  onClick={() => handleLearnMore(event.id)}
                  className="bg-perso-yellow-one text-perso-bg px-4 py-2 rounded hover:bg-red-400 hover:text-perso-bg transition"
                >
                  En savoir +
                </button>
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
  );
};

export default PastEvents;
