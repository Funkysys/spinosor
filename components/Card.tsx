import Image from "next/image";

interface CardProps {
  title: string;
  genre: string;
  description: string;
  imageUrl?: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, genre }) => {
  return (
    <div className="relative  max-h-[50vh] bg-slate-300 rounded overflow-hidden shadow-lg group">
      {imageUrl && (
        <Image
          className="w-full"
          src={imageUrl}
          alt={title}
          width={500}
          height={300}
        />
      )}

      {/* Default overlay with title and genre */}
      <div className="absolute inset-0 bg-slate-200 bg-opacity-50 flex flex-col justify-center items-center text-slate-900 p-4 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:-translate-x-full">
        <h3 className="font-bold text-5xl mb-2">{title}</h3>
        <p className="text-2xl">{genre}</p>
      </div>

      {/* Hidden overlay with description */}
      <div className="absolute inset-0 bg-slate-900 bg-opacity-80 flex items-center justify-center text-white p-10 translate-x-full transition-all duration-500 ease-in-out group-hover:translate-x-0 ">
        <p className="text-2xl ">
          {description.length > 100
            ? description.substring(0, 100) + "..."
            : description}
        </p>
        <button className="absolute bottom-4 right-4 bg-slate-200 text-slate-900 px-2 py-1 rounded">
          Read More
        </button>
      </div>
    </div>
  );
};

export default Card;
