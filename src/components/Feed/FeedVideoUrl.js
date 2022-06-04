import Button from "../UI/Button";
import classes from "./FeedVideoUrl.module.css";

const FeedVideoUrl = ({
  onUrlVideo,
  displayInputVideo,
  onButtonVideoHandler,
}) => {
  //Remonter l'information de l'URL dans le composant parent
  const inputVideoHandler = (event) => {
    onUrlVideo(event.target.value);
  };

  return (
    <div className={classes.feedVideoUrl}>
      {/* Bouton VIDEO pour afficher l'input  */}
      <Button onClick={onButtonVideoHandler}>Video</Button>

      {displayInputVideo && (
        <>
          {/* Pour y mettre l'URL  */}
          <input
            type="text"
            placeholder="Coller l'url de votre vidéo YouTube"
            onChange={inputVideoHandler}
          />
        </>
      )}
    </div>
  );
};

export default FeedVideoUrl;
