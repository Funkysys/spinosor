"use client";
import Navigation from "../components/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-black text-slate-50 h-[100vh] w-[100vw]">
      <Navigation />
      <section>{children}</section>
    </main>
  );
}
