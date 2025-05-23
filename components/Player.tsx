interface PlayerProps {
  codePlayer: string;
  urlPlayer: string;
  videoUrl?: string | null | undefined;
}

const Player: React.FC<PlayerProps> = ({ codePlayer, urlPlayer, videoUrl }) => {
  return (
    <div className="relative w-full mt-8 flex justify-center">
      {videoUrl ? (
        <iframe
          className="w-[100%] xl:w-[40%]"
          style={{ border: "0", height: "315px" }}
          src={videoUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <iframe
          className="w-[100%] xl:w-[40%] bg-perso-bg2"
          style={{ border: "0", height: "120px", background: "transparent" }}
          src={`https://bandcamp.com/EmbeddedPlayer/album=${codePlayer}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/`}
          seamless
        >
          <a href={urlPlayer}>Leaving Space de Duology eXperiment</a>
        </iframe>
      )}
    </div>
  );
};

export default Player;
