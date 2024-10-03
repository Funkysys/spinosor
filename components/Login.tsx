"use client";

import { Mail } from "lucide-react";
import { signIn } from "next-auth/react";

const Login = () => {
  const onLogin = (provider: string) => () => {
    signIn(provider, { callbackUrl: "/" });
  };
  return (
    <button onClick={onLogin("google")} className="flex absolute right-4">
      <Mail className="mr-3" />
      Sign In
    </button>
  );
};
export default Login;
