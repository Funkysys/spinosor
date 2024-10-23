"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-perso-bg animate-fade-up animate-once animate-duration-[1500ms] animate-ease-in-out overflow-hidden">
      <h1 className="mb-10 text-perso-white-one font-bold text-center font-sans text-3xl md:text-4xl lg:text-5xl animate-fade-left animate-once animate-duration-[3000ms] animate-ease-in-out">
        {/* Welcome to Spinosor Records */}
        Bienvenue chez Spinosor Records
      </h1>
      <button
        onClick={() => router.push("/home")}
        className="mb-10 font-sans text-lg bg-perso-white-two hover:bg-perso-yellow-one text-perso-bg hover:text-perso-white-two px-4 py-2 rounded-lg transition duration-400 ease-in-out animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out "
      >
        {/* Enter the website */}
        Découvrir le site
      </button>
      <div className=" w-[80vw] h-[50vh]  relative animate-flip-up animate-once animate-duration-[3000ms] animate-ease-in-out">
        <Image src="/assets/images/logo.svg" alt="Spinosor Records logo" fill />
      </div>
    </main>
  );
}
