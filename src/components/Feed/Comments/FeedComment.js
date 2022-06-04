import { useState } from "react";
import classes from "./FeedComment.module.css";
import Linkify from "linkify-react";

const FeedComment = ({
  idComment,
  userIdToken,
  comment,
  isUpdatingComment,
  buttonSend,
  token,
  onUpdateCommentFinish,
}) => {
  const [messageTextarea, setMessageTextarea] = useState({
    comments_user_message: comment,
  });

  const commentToEdit = isUpdatingComment && isUpdatingComment.commentToEdit;

  //Condition pour afficher l'interface de MODIFICATION
  const modificationOneComment = commentToEdit === idComment;

  //fonction exécuté par onChange du textarea du post
  const messageModificationHandler = (event) => {
    setMessageTextarea({ comments_user_message: event.target.value });
  };

  //Envoyer le message mis à jour
  if (buttonSend && modificationOneComment) {
    //Requête PUT pour envoyer les données au serveur

    //            http://localhost:3000/api/posts/comment/196?userId=46

    const fetchPUTHandler = async () => {
      const url = `http://localhost:3000/api/posts/comment/${idComment}?userId=${userIdToken}`;

      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(messageTextarea),
        });

        //convertir la response du serveur
        const dataResponse = await response.json();

        //si la response du serveur est OK
        if (response.ok) {          
          onUpdateCommentFinish();
        } else {
          console.log("-------->Response PAS OK<---------");          
          console.log(dataResponse);
        }
      } catch (error) {
        console.log("--->Dans le CATCH de fetchPUTHandler");
        throw new Error(error);
      }
    };

    //exécution de la fonction
    fetchPUTHandler();
  }

  return (
    <div className={classes.feedComment}>
      {modificationOneComment ? (
        <textarea
          defaultValue={comment}
          onChange={messageModificationHandler}
        />
      ) : (
        <Linkify options={{ target: "_blank" }}>
          <p>{comment}</p>
        </Linkify>
      )}
    </div>
  );
};

export default FeedComment;
