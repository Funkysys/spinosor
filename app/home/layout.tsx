import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <main className="bg-black text-slate-50 min-h-[100vh]  ">
        {" "}
        {children}
      </main>
      <Footer />
    </>
  );
}
