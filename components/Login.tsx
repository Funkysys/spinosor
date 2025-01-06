"use client";

import { Mail } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Login = () => {
  const { data: session, status } = useSession();
  const onLogin = (provider: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    signIn(provider, { callbackUrl: "/admin" });
  };
  return !session ? (
    <button
      onClick={onLogin("google")}
      className="flex justify-center items-center  right-6 border px-3 py-2 rounded-lg text--600 hover:text-red-800 hover:bg-slate-300  transition-all"
    >
      <Mail className="mr-3 text-sm" />
      Connection
    </button>
  ) : (
    <div className="flex md:h-[10vh] xl:h-[5vh] justify-center items-center text-sm md:mt-0  ">
      {session?.user?.image && (
        <Image
          className=" w-8 h-8 mr-3 rounded-full border-2 border-gray-400 "
          alt="profile picture"
          src={session?.user?.image || ""}
          width={25}
          height={25}
        />
      )}

      <button
        onClick={() => signOut({ callbackUrl: "/home/artists" })}
        className="flex justify-center items-center mt-3 md:mt-0 right-6 border px-3 py-2 rounded-lg text--600 hover:text-red-800 hover:bg-slate-300  animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out"
      >
        Deconnexion
      </button>
    </div>
  );
};
export default Login;
