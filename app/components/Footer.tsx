import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Footer: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  console.log(pathname);

  return (
    <footer className="fixed bottom-0 px-4 py-3 w-[100vw] bg-black border-t-2 border-t-red-800 text-slate-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-3 cursor-pointer animate-fade-right animate-once animate-duration-[1000ms] animate-ease-in-out ">
            <Image
              src="/assets/images/logo.svg"
              alt="Spinosor Records logo"
              onClick={() => router.push("/")}
              width={80}
              height={80}
            />
          </div>
          <ul className="flex flex-col px-4 text-sm animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out">
            <li
              className={pathname == "/home" ? "font-extrabold  mr-3" : "mr-3 "}
            >
              <Link href="/home">Home</Link>
            </li>
            <li
              className={
                pathname == "/home/artists" ? "font-extrabold  mr-3" : "mr-3 "
              }
            >
              <Link href="/home/artists">Artists</Link>
            </li>
            <li
              className={
                pathname == "/home/events" ? "font-extrabold  mr-3" : "mr-3 "
              }
            >
              <Link href="/home/events">Events</Link>
            </li>
          </ul>
          <ul className="flex flex-col px-4 text-sm animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out">
            <li
              className={
                pathname == "/home/mersh" ? "font-extrabold  mr-3" : "mr-3 "
              }
            >
              <Link href="/home/mersh">Mersh</Link>
            </li>
            <li
              className={
                pathname == "/home/about" ? "font-extrabold  mr-3" : "mr-3 "
              }
            >
              <Link href="/home/about">About</Link>
            </li>
            <li
              className={
                pathname == "/home/contact" ? "font-extrabold  mr-3" : "mr-3 "
              }
            >
              <Link href="/home/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <p>
          &copy; {new Date().getFullYear()} Spinosor Records. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
