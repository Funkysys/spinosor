import Image from "next/image";

interface CardProps {
  title: string;
  genre: string;
  description: string;
  imageUrl?: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, genre }) => {
  return (
    <div className="max-w-sm max-h-[50vh] bg-slate-300 rounded overflow-hidden shadow-lg">
      {imageUrl && (
        <Image
          className="w-full"
          src={imageUrl}
          alt={title}
          width={500}
          height={300}
        />
      )}
      <div className="px-6 py-4">
        <div className="font-bold text-slate-900 text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{genre}</p>
        <p className="text-gray-900 text-base">{description}</p>
      </div>
    </div>
  );
};

export default Card;
