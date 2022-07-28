import { useContext, useState } from "react";
import AuthContext from "../../../store/authContext";
import Button from "../../UI/Button";
import classes from "./FeedNewComment.module.css";
import Card from "../../UI/Card";
import { useDispatch } from "react-redux";
import { postFetchCommentary } from "../../../store/actions/commentary-action";

const FeedNewComment = ({ idPostsUser}) => {
  //Pour récupérer le TOKEN d'authentification
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  //Pour stocker le contenu du message
  const [message, setMessage] = useState(null);

  // l'information du click sur le bouton envoyer
  const [clickSend, setClickSend] = useState(false);

  // //L'URL de la route de la WEB API REST du backend
  // //http://localhost:3000/api/posts/comments?userId=48
  // const url = `${process.env.REACT_APP_API_URL}/api/posts/comments?userId=${authCtx.userId}`;

  //Lorsque l'on appuie sur le bouton ENVOYER du formulaire
  const submitHandler = (event) => {
    //Pour ne pas recharger la page
    event.preventDefault();

    const data = {
      userId: authCtx.userId,
      idPost: idPostsUser,
      message,
    };
    
    //requête POST redux
    dispatch(postFetchCommentary(authCtx.userId, authCtx.token, data));
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
