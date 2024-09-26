"use client";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-black text-slate-50 min-h-[100vh] w-[100vw]">
      <Navigation />
      <>{children}</>
      <Footer />
    </main>
  );
}
