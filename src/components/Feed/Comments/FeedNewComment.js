import { useState } from "react";
import Button from "../../UI/Button";
import classes from "./FeedNewComment.module.css";
import Card from "../../UI/Card";
import { useDispatch } from "react-redux";
import { postFetchCommentary } from "../../../store/actions/commentary-actions";
import { useSelector } from "react-redux";

const FeedNewComment = ({ idPostsUser }) => {
  //Pour récupérer le TOKEN d'authentification
  const dispatch = useDispatch();
  const authentification = useSelector(
    (state) => state.authentification.dataResponse
  );

  //Pour stocker le contenu du message
  const [message, setMessage] = useState(null);

  //L'information du click sur le bouton envoyer
  const [clickSend, setClickSend] = useState(false);

  //Lorsque l'on appuie sur le bouton ENVOYER du formulaire
  const submitHandler = (event) => {
    //Pour ne pas recharger la page
    event.preventDefault();

    const data = {
      userId: authentification.userId,
      idPost: idPostsUser,
      message,
    };

    //requête POST redux
    dispatch(
      postFetchCommentary(authentification.userId, authentification.token, data)
    );
    setMessage("");
    setClickSend(false);
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
