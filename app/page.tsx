"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center  bg-black animate-fade-up animate-once animate-duration-[1500ms] animate-ease-in-out overflow-hidden">
      <h1 className=" text-perso-white-one font-bold text-center font-sans text-3xl md:text-4xl lg:text-5xl animate-fade-left animate-once animate-duration-[3000ms] animate-ease-in-out invisible">
        {/* Welcome to Spinosor Records */}
        Bienvenue chez Spinosor Records
      </h1>
      <div className=" w-[50vh] h-[50vh] md:w-[80vh] md:h-[80vh]  relative animate-fade-up animate-once animate-duration-[3000ms] animate-ease-in-out">
        <Image src="/assets/images/spinosor_Logo.svg" alt="Spinosor Records logo" fill />
      </div>
      <button
        onClick={() => router.push("/home/artists")}
        className="text-2xl bg-perso-white-two hover:bg-perso-yellow-one text-perso-bg hover:text-perso-white-two font-ruda px-4 py-2 rounded-lg transition duration-400 ease-in-out animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out "
      >
        {/* Enter the website */}
        ENTRER
      </button>
    </main>
  );
}
