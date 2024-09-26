import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  console.log(pathname);

  return (
    <nav className="w-full flex justify-center items-center border-b-2 py-4 border-b-red-800">
      <div className="pt-2 cursor-pointer animate-fade-right animate-once animate-duration-[1000ms] animate-ease-in-out ">
        <Image
          src="/assets/images/logo.svg"
          alt="Spinosor Records logo"
          onClick={() => router.push("/")}
          width={125}
          height={125}
        />
      </div>
      <ul className="flex px-4 text-3xl animate-fade-left animate-once animate-duration-[1000ms] animate-ease-in-out">
        <li
          className={
            pathname == "/home" ? "font-extrabold mr-3" : "mr-3 hover:text-4xl"
          }
        >
          <Link href="/">Home</Link>
        </li>
        <li
          className={
            pathname == "/about" ? "font-extrabold mr-3" : "mr-3 hover:text-4xl"
          }
        >
          <Link href="/artists">Artists</Link>
        </li>
        <li
          className={
            pathname == "/contact"
              ? "font-extrabold mr-3"
              : "mr-3 hover:text-4xl"
          }
        >
          <Link href="/mersh">Mersh</Link>
        </li>
        <li
          className={
            pathname == "/contact"
              ? "font-extrabold mr-3"
              : "mr-3 hover:text-4xl"
          }
        >
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
