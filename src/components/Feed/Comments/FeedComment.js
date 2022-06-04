import { useState } from "react";
import classes from "./FeedComment.module.css";
import Linkify from 'linkify-react';

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

  console.log("-->Je suis dans FeedPosts isUpdatingComment");
  console.log(isUpdatingComment);

  const commentToEdit = isUpdatingComment && isUpdatingComment.commentToEdit;
  console.log(
    "-->Je suis dans FeedPosts commentToEdit-----------------------------"
  );
  console.log(commentToEdit);

  //Condition pour afficher l'interface de MODIFICATION
  const modificationOneComment = commentToEdit === idComment;

  //fonction exécuté par onChange du textarea du post
  const messageModificationHandler = (event) => {
    setMessageTextarea({ comments_user_message: event.target.value });
  };

  console.log("--->MessageTextarea");
  console.log(messageTextarea);

  //Envoyer le message mis à jour

  if (buttonSend && modificationOneComment) {
    //Requête PUT pour envoyer les données au serveur
    console.log("Condition OK pour l'envoie de la requête");

    //            http://localhost:3000/api/posts/comment/196?userId=46
    const url = `http://localhost:3000/api/posts/comment/${idComment}?userId=${userIdToken}`;

    const fetchPUTHandler = async () => {
      console.log("--->MessageTextarea-----------");
      console.log(messageTextarea);
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
        console.log("--->dataResponse");
        console.log(dataResponse);

        //si la response du serveur est OK
        if (response.ok) {
          console.log("-------->Response OK<---------");
          console.log(response);
          console.log(dataResponse);
          onUpdateCommentFinish();
        } else {
          console.log("-------->Response PAS OK<---------");
          console.log(response);
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
        <Linkify options={{ target: '_blank' }}>
          <p>{comment}</p>
        </Linkify>
      )}
    </div>
  );
};

export default FeedComment;
