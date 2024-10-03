"use client";

import { Mail } from "lucide-react";
import { signIn } from "next-auth/react";

const Login = () => {
  const onLogin = (provider: string) => () => {
    signIn(provider, { callbackUrl: "/" });
  };
  return (
    <button
      onClick={onLogin("google")}
      className="flex justify-center items-center md:absolute mt-3 md:mt-0 right-6 top-12 border px-3 py-2 rounded-lg text-red-600 hover:text-red-800 hover:bg-slate-300  animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out"
    >
      <Mail className="mr-3" />
      Sign In
    </button>
  );
};
export default Login;
