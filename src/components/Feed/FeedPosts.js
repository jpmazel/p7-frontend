import { useState } from "react";
import classes from "./FeedPosts.module.css";
import Linkify from "linkify-react";
import useHttp from "../../hooks/use-http";
import { useEffect } from "react";

const FeedPosts = ({
  message,
  isUpdatingPost,
  idPostsUser,
  buttonSend,
  userIdPost,
  token,
  onUpdatePostFinish,
}) => {
  const [messageTextarea, setMessageTextarea] = useState({
    posts_user_message: message,
  });

  const { sendRequest: fetchPUTHandler } = useHttp();

  const postToEdit = isUpdatingPost && isUpdatingPost.postToEdit;

  //Condition pour afficher l'interface de MODIFICATION
  const modificationOnePost = postToEdit === idPostsUser;

  //fonction exécuté par onChange du textarea du post
  const messageModificationHandler = (event) => {
    setMessageTextarea({ posts_user_message: event.target.value });
  };

  //Envoyer le message mis à jour
  //Exécution de la fonction
  useEffect(() => {
    //Objet de configuration du custom hook http
    const requestConfig = {
      url: `http://localhost:3000/api/posts/${idPostsUser}?userId=${userIdPost}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: messageTextarea,
    };

    //Exécution de la requête
    if (buttonSend && modificationOnePost) {
      fetchPUTHandler(requestConfig, () => onUpdatePostFinish());
    }
  }, [
    buttonSend,
    fetchPUTHandler,
    idPostsUser,
    messageTextarea,
    modificationOnePost,
    token,
    userIdPost,
    onUpdatePostFinish,
  ]);

  return (
    <div className={classes.feedPosts}>
      {modificationOnePost ? (
        <textarea
          defaultValue={message}
          onChange={messageModificationHandler}
        />
      ) : (
        <Linkify options={{ target: "_blank" }}>
          <p>{message}</p>
        </Linkify>
      )}
    </div>
  );
};

export default FeedPosts;
