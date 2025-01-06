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
      <main className="bg-perso-bg text-perso-white-one">
        {" "}
        <SlideModal>
          <iframe
            style={{ border: 0, width: "350px", height: "470px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=766049808/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://spinosor-records.bandcamp.com/album/spinosor-playlist-2">
              Spinosor Playlist by Spinosor Records
            </a>
          </iframe>{" "}
        </SlideModal>
        {children}
      </main>
      <Footer />
    </>
  );
}
