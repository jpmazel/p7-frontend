import Button from "../UI/Button";
import classes from "./FeedImageUrl.module.css";

const FeedImageUrl = ({ onUrlImage, displayInput, onButtonImageHandler }) => {
  //Remonter l'information de l'URL dans le composant parent
  const inputImageHandler = (event) => {
    onUrlImage(event.target.value);
  };

  return (
    <div className={classes.feedImageUrl}>
      {/* Bouton IMAGE pour afficher l'input  */}
      <Button onClick={onButtonImageHandler}>Image</Button>

      {displayInput && (
        <>
          {/* Pour y mettre l'URL  */}
          <input
            type="text"
            placeholder="Coller l'url de votre photo"
            onChange={inputImageHandler}
          />
        </>
      )}
    </div>
  );
};

export default FeedImageUrl;
