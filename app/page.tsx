"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black animate-fade-up animate-once animate-duration-[1500ms] animate-ease-in-out overflow-hidden">
      <h1 className="mb-10 text-slate-100 font-bold text-center font-sans text-6xl animate-fade-left animate-once animate-duration-[3000ms] animate-ease-in-out">
        Welcome on Spinosor Records
      </h1>
      <button
        onClick={() => router.push("/home")}
        className="mb-10 font-sans text-lg bg-slate-100 hover:bg-red-800 text-black hover:text-slate-200 px-4 py-2 rounded-lg transition duration-400 ease-in-out animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out "
      >
        Enter the website
      </button>
      <div className=" w-[80vw] h-[50vh]  relative animate-flip-up animate-once animate-duration-[3000ms] animate-ease-in-out">
        <Image src="/assets/images/logo.svg" alt="Spinosor Records logo" fill />
      </div>
    </main>
  );
}
