import { useState } from "react";
import classes from "./FeedComment.module.css";
import Linkify from "linkify-react";
import { useEffect } from "react";
import useHttp from "../../../hooks/use-http";

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

  const { sendRequest: fetchPUTHandler } = useHttp();

  const commentToEdit = isUpdatingComment && isUpdatingComment.commentToEdit;

  //Condition pour afficher l'interface de MODIFICATION
  const modificationOneComment = commentToEdit === idComment;

  //fonction exécuté par onChange du textarea du post
  const messageModificationHandler = (event) => {
    setMessageTextarea({ comments_user_message: event.target.value });
  };

  //Envoyer le message mis à jour
  //La requête PUT avec le custom Hook HTTP
  useEffect(() => {
    const requestConfig = {
      url: `http://localhost:3000/api/posts/comment/${idComment}?userId=${userIdToken}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: messageTextarea,
    };

    if (buttonSend && modificationOneComment) {
      //exécution de la fonction
      fetchPUTHandler(requestConfig, () => onUpdateCommentFinish());
    }
  }, [
    buttonSend,
    fetchPUTHandler,
    idComment,
    messageTextarea,
    modificationOneComment,
    onUpdateCommentFinish,
    token,
    userIdToken,
  ]);

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
