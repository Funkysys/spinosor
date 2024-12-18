"use client";

import { getUser } from "@/app/api/action/user/user";
import { User } from "@prisma/client";
import { Mail } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const Login = () => {
  const [user, setUser] = useState<User | null>();

  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated" && !user) {
      const fetchUser = async () => {
        const data = await getUser(session?.user?.email as string);
        if (!data) return;
        setUser(data);
      };
      fetchUser();
    }
  }, [status, session, user]);
  const onLogin = (provider: string) => () => {
    signIn(provider, { callbackUrl: "/home" });
  };
  return !session ? (
    <button
      onClick={onLogin("google")}
      className="flex justify-center items-center mt-3 md:mt-0 right-6 border px-3 py-2 rounded-lg text--600 hover:text-red-800 hover:bg-slate-300  animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out"
    >
      <Mail className="mr-3" />
      Connection
    </button>
  ) : (
    <div className="flex h-[10vh] xl:h-[5vh] justify-center items-center text-sm md:absolute mt-3 md:mt-0 md:right-6 ">
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
        onClick={() => signOut({ callbackUrl: "/home" })}
        className=" text-sm border-2 px-2 py-1 rounded-md hover:bg-red-800"
      >
        Deconnexion
      </button>
    </div>
  );
};
export default Login;
