interface PlayerProps {
  codePlayer: string;
  urlPlayer: string;
}

const Player: React.FC<PlayerProps> = ({ codePlayer, urlPlayer }) => {
  return (
    <div className="w-full mt-8 flex justify-center">
      <iframe
        className="w-[100%]  md:w-[50%] lg:w-[30%]"
        style={{ border: "0", height: "120px" }}
        src={`https://bandcamp.com/EmbeddedPlayer/album=${codePlayer}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/`}
        seamless
      >
        <a href={urlPlayer}>Leaving Space de Duology eXperiment</a>
      </iframe>
    </div>
  );
};

export default Player;
