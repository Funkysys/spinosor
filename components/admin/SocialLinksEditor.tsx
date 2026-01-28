"use client";

import { Link as LinkType } from "@/types";

interface SocialLinksEditorProps {
  links: LinkType[];
  onLinksChange: (links: LinkType[]) => void;
}

export const SocialLinksEditor: React.FC<SocialLinksEditorProps> = ({
  links,
  onLinksChange,
}) => {
  const addLink = () => {
    const newId =
      links.length > 0 ? Math.max(...links.map((l) => l.id)) + 1 : 1;
    onLinksChange([...links, { id: newId, name: "", url: "" }]);
  };

  const removeLink = (id: number) => {
    onLinksChange(links.filter((link) => link.id !== id));
  };

  const updateLinkName = (
    e: React.ChangeEvent<HTMLInputElement>,
    link: LinkType,
  ) => {
    onLinksChange(
      links.map((l) => (l.id === link.id ? { ...l, name: e.target.value } : l)),
    );
  };

  const updateLinkUrl = (
    e: React.ChangeEvent<HTMLInputElement>,
    link: LinkType,
  ) => {
    onLinksChange(
      links.map((l) => (l.id === link.id ? { ...l, url: e.target.value } : l)),
    );
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Liens sociaux</h2>
      {links.map((link) => (
        <div key={link.id} className="grid md:grid-cols-2 gap-2 mb-4">
          <div>
            <label className="text-sm text-slate-400">Nom :</label>
            <input
              value={link.name}
              type="text"
              placeholder="Nom du lien"
              onChange={(e) => updateLinkName(e, link)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">URL :</label>
            <div className="flex">
              <input
                value={link.url}
                type="url"
                placeholder="URL du lien"
                onChange={(e) => updateLinkUrl(e, link)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              />
              <button
                type="button"
                onClick={() => removeLink(link.id)}
                className="ml-2 text-red-500 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addLink}
        className="mt-2 px-4 py-2 bg-perso-green hover:bg-perso-green/80 rounded"
      >
        + Ajouter un lien
      </button>
    </div>
  );
};
