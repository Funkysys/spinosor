import SlideModal from "@/components/SlidePlayer";
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
      <main className="bg-perso-bg text-perso-white-one py-24">
        {" "}
        <SlideModal />
        {children}
      </main>
      <Footer />
    </>
  );
}
