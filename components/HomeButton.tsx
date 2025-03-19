"use client";

import { useRouter } from "next/navigation";

function HomeButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/home/artists")}
      className="text-2xl bg-perso-white-two hover:bg-perso-yellow-one text-perso-bg hover:text-perso-white-two font-ruda px-4 py-2 rounded-lg transition duration-400 ease-in-out animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out "
    >
      {/* Enter the website */}
      ENTRER
    </button>
  );
}

export default HomeButton;
