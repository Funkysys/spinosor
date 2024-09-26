"use client";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <main className="bg-black text-slate-50 min-h-[100vh] w-[100vw] pt-10 px-[10vw]">
        {children}
      </main>
      <Footer />
    </>
  );
}
