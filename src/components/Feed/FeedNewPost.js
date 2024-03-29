import { useEffect, useState } from "react";

import Button from "../UI/Button";
import classes from "./FeedNewPost.module.css";
import Card from "../UI/Card";
import FeedImageUrl from "./FeedImageUrl";
import FeedVideoUrl from "./FeedVideoUrl";
import useHttp from "../../hooks/use-http";
import { useSelector } from "react-redux";
const FeedNewPost = ({ onUpdate }) => {
  //Pour stocker le contenu du message
  const [message, setMessage] = useState(null);

  //Recupérer url dans l'input, l'information du click sur le bouton OK et sur le bouton envoyer
  const [urlInput, setUrlInput] = useState(null);
  const [urlInputVideo, setUrlInputVideo] = useState(null);
  const [clickSend, setClickSend] = useState(false);
  const [displayInput, setDisplayInput] = useState(false);
  const [displayInputVideo, setDisplayInputVideo] = useState(false);

  const { sendRequest: fetchPOSTHandler } = useHttp();

  const authentification = useSelector(
    (state) => state.authentification.dataResponse
  );

  //La condition pour envoyer un POST avec ou sans image vers le serveur
  const conditionSend =
    (!displayInput && !displayInputVideo && message) ||
    (message && displayInput && urlInput) ||
    (message && displayInputVideo && urlInputVideo);
  //Pour mettre urlInput a null lorsque l'on ferme le input ou on y met l'URL
  useEffect(() => {
    setUrlInput(null);
    setUrlInputVideo(null);
  }, [displayInput, displayInputVideo]);

  //Lorsque l'on appuie sur le bouton ENVOYER du formulaire
  const submitHandler = (event) => {
    //Pour ne pas recharger la page
    event.preventDefault();

    const data = {
      userId: authentification.userId,
      message: message,
      photoUrlLink: urlInput,
      videoYTUrlLink: urlInputVideo,
    };

    //La requête POST avec le custom hook HTTP pour envoyer les données au backend
    //L'exécution de la fonction (envoyer une requête POST vers le serveur)
    //Objet de configuration de la requête post
    const requestConfig = {
      url: `${process.env.REACT_APP_API_URL}/api/posts?userId=${authentification.userId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authentification.token}`,
      },
      body: data,
    };

    conditionSend &&
      fetchPOSTHandler(requestConfig, () => {
        onUpdate(message);
        setMessage("");
        setUrlInput(null);
        setClickSend(false);
        setDisplayInput(false);
        setUrlInputVideo(null);
        setDisplayInputVideo(false);
      });
  };

  //Récupération de l'URL chez l'enfant
  const onUrlImage = (urlInput) => {
    const urlImage = urlInput; //warning Cannot update a component (`FeedNewPost`) while rendering a different component (`FeedImageUrl`)
    urlImage && setUrlInput(urlImage);
  };

  //Récupération de l'URL Video YOUTUBE chez l'enfant
  const onUrlVideo = (urlInput) => {
    const urlVideo = urlInput; //warning Cannot update a component (`FeedNewPost`) while rendering a different component (`FeedImageUrl`)
    urlVideo && setUrlInputVideo(urlVideo);
  };

  //La gestion du bouton IMAGE
  //Au clique sur le bouton l'input s'affiche pour pouvoir y entrer l'URL
  const onButtonImageHandler = () => {
    setDisplayInput((prevState) => !prevState);
  };

  //La gestion du bouton VIDEO
  //Au clique sur le bouton l'input s'affiche pour pouvoir y entrer l'URL
  const onButtonVideoHandler = () => {
    setDisplayInputVideo((prevState) => !prevState);
  };

  return (
    <section className={classes.feedNewPost}>
      <Card className={classes.card}>
        <form onSubmit={submitHandler}>
          <label htmlFor="message">Envoyer un message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Ecrivez votre message ici"
            value={message ? message : ""}
            onChange={(event) => setMessage(event.target.value)}
          />

          <div className={classes.buttonsMedia}>
            {/* Bouton pour mettre une URL d'une IMAGE ou PHOTO hebergée sur le web  */}
            {!displayInputVideo && (
              <FeedImageUrl
                onUrlImage={onUrlImage}
                onButtonImageHandler={onButtonImageHandler}
                displayInput={displayInput}
              />
            )}

            {/* Bouton pour mettre une URL d'une VIDEO hebergée sur YOUTUBE  */}
            {!displayInput && (
              <FeedVideoUrl
                onUrlVideo={onUrlVideo}
                displayInputVideo={displayInputVideo}
                onButtonVideoHandler={onButtonVideoHandler}
              />
            )}
          </div>

          {/* Bouton pour envoyer les données vers le serveur  */}
          <Button
            id={!conditionSend && clickSend && classes["red"]}
            type={"submit"}
            onClick={() => setClickSend(true)}
            className={classes.messageEmpty}
          >
            Envoyer
          </Button>

          {/* Message d'avertissement pour l'utilisateur  */}
          {!message && clickSend && (
            <p id={classes["messageEmpty"]}>Le message ne peut pas être vide</p>
          )}

          {/* Message d'avertissement pour l'utilisateur  */}
          {((displayInput && clickSend && !urlInput) ||
            (displayInputVideo && !urlInputVideo && clickSend)) && (
            <p id={classes["messageEmpty"]}>Le champ URL est vide</p>
          )}
        </form>
      </Card>
    </section>
  );
};

export default FeedNewPost;
