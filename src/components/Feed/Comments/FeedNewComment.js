import { useContext, useState } from "react";
import AuthContext from "../../../store/authContext";
import Button from "../../UI/Button";
import classes from "./FeedNewComment.module.css";
import Card from "../../UI/Card";
import useHttp from "../../../hooks/use-http";

const FeedNewComment = ({ idPostsUser, onNewComment }) => {
  //Pour récupérer le TOKEN d'authentification
  const authCtx = useContext(AuthContext);

  const { sendRequest: fetchPOSTHandler } = useHttp();

  //Pour stocker le contenu du message
  const [message, setMessage] = useState(null);

  // l'information du click sur le bouton envoyer
  const [clickSend, setClickSend] = useState(false);

  //Lorsque l'on appuie sur le bouton ENVOYER du formulaire
  const submitHandler = (event) => {
    //Pour ne pas recharger la page
    event.preventDefault();

    const data = {
      userId: authCtx.userId,
      idPost: idPostsUser,
      message: message,
    };

    //Objet de configuration de la requête POST
    const requestConfig = {
      url: `${process.env.REACT_APP_API_URL}/api/posts/comments?userId=${authCtx.userId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authCtx.token}`,
      },
      body: data,
    };

    //L'exécution de la fonction (envoyer une requête POST vers le serveur)
    message &&
      fetchPOSTHandler(requestConfig, () => {
        setMessage("");
        setClickSend(false);
        onNewComment();
      });
  };

  return (
    <section className={classes.feedNewComment}>
      <Card className={classes.card}>
        <form onSubmit={submitHandler}>
          <label htmlFor="message">Envoyer un commentaire</label>
          <textarea
            id="message"
            name="message"
            placeholder="Ecrivez votre commentaire ici"
            value={message ? message : ""}
            onChange={(event) => setMessage(event.target.value)}
          />

          {/* Bouton pour envoyer les données vers le serveur  */}
          <Button
            id={!message && clickSend && classes["red"]}
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
        </form>
      </Card>
    </section>
  );
};

export default FeedNewComment;
