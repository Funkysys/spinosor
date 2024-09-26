import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Footer: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  console.log(pathname);

  return (
    <footer className="fixed bottom-0 px-4 py-5 w-[100vw] bg-black border-t-2 border-t-red-800">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-3 cursor-pointer animate-fade-right animate-once animate-duration-[1000ms] animate-ease-in-out ">
            <Image
              src="/assets/images/logo.svg"
              alt="Spinosor Records logo"
              onClick={() => router.push("/")}
              width={135}
              height={135}
            />
          </div>
          <ul className="flex flex-col px-4 animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out">
            <li
              className={
                pathname == "/home"
                  ? "font-extrabold hover:text-xl mr-3"
                  : "mr-3 hover:text-xl"
              }
            >
              <Link href="/home">Home</Link>
            </li>
            <li
              className={
                pathname == "/home/artists"
                  ? "font-extrabold hover:text-xl mr-3"
                  : "mr-3 hover:text-xl"
              }
            >
              <Link href="/home/artists">Artists</Link>
            </li>
            <li
              className={
                pathname == "/home/events"
                  ? "font-extrabold hover:text-xl mr-3"
                  : "mr-3 hover:text-xl"
              }
            >
              <Link href="/home/events">Events</Link>
            </li>
            <li
              className={
                pathname == "/home/mersh"
                  ? "font-extrabold hover:text-xl mr-3"
                  : "mr-3 hover:text-xl"
              }
            >
              <Link href="/home/mersh">Mersh</Link>
            </li>
            <li
              className={
                pathname == "/home/contact"
                  ? "font-extrabold hover:text-xl mr-3"
                  : "mr-3 hover:text-xl"
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
