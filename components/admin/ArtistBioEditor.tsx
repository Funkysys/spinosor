"use client";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return RQ;
  },
  { ssr: false }
);

interface ArtistBioEditorProps {
  bio: string;
  onBioChange: (value: string) => void;
}

export const ArtistBioEditor: React.FC<ArtistBioEditorProps> = ({
  bio,
  onBioChange,
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Biographie</h2>
      <ReactQuill
        theme="snow"
        value={bio}
        onChange={onBioChange}
        className="bg-white text-black rounded"
      />
    </div>
  );
};
