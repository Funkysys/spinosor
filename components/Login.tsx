"use client";

import { Mail } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Login = () => {
  const { data: session, status } = useSession();

  const onLogin = (provider: string) => () => {
    signIn(provider, { callbackUrl: "/home" });
  };
  return !session ? (
    <button
      onClick={onLogin("google")}
      className="flex justify-center items-center  right-6 border px-3 py-2 rounded-lg text--600 hover:text-red-800 hover:bg-slate-300  animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out"
    >
      <Mail className="mr-3" />
      Connection
    </button>
  ) : (
    <div className="flex h-[10vh] xl:h-[5vh] justify-center items-center text-sm md:mt-0  ">
      {session?.user?.image && (
        <Image
          className="md:w-8 md:h-8 w-8 h-8 mr-3 rounded-full border-2 border-gray-400 "
          alt="profile picture"
          src={session?.user?.image || ""}
          width={25}
          height={25}
        />
      )}

      <button
        onClick={() => signOut({ callbackUrl: "/admin" })}
        className="flex justify-center items-center mt-3 md:mt-0 right-6 border px-3 py-2 rounded-lg text--600 hover:text-red-800 hover:bg-slate-300  animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out"
      >
        Deconnexion
      </button>
    </div>
  );
};
export default Login;
