"use client";

import { useRouter } from "next/navigation";

const ButtonHome: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/home/artists");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
    >
      Go to Artists Home
    </button>
  );
};

export default ButtonHome;
