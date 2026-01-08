import HomeButton from "@/components/HomeButton";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center  bg-black animate-fade-up animate-once animate-duration-[1500ms] animate-ease-in-out overflow-hidden">
      <h1 className=" text-perso-white-one font-bold text-center font-sans text-3xl md:text-4xl lg:text-5xl animate-fade-left animate-once animate-duration-[3000ms] animate-ease-in-out invisible">
        {/* Welcome to Spinosor Records */}
        Bienvenue chez Spinosor Records
      </h1>
      <div className="w-[50vh] h-[50vh] md:w-[70vh] md:h-[70vh] mb-10 relative animate-fade-up animate-once animate-duration-[3000ms] animate-ease-in-out">
        <Image
          src="/assets/images/spinosor_logo.jpeg"
          alt="Spinosor Records logo"
          height={1000}
          width={1000}
          className="object-contain rounded-md "
        />
      </div>
      <HomeButton />
    </main>
  );
}
