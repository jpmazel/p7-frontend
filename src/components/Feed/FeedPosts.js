import { useState } from "react";
import classes from "./FeedPosts.module.css";
import Linkify from "linkify-react";

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

  const postToEdit = isUpdatingPost && isUpdatingPost.postToEdit;

  //Condition pour afficher l'interface de MODIFICATION
  const modificationOnePost = postToEdit === idPostsUser;

  //fonction exécuté par onChange du textarea du post
  const messageModificationHandler = (event) => {
    setMessageTextarea({ posts_user_message: event.target.value });
  };

  //Envoyer le message mis à jour

  if (buttonSend && modificationOnePost) {
    //Requête PUT pour envoyer les données au serveur
    const url = `${process.env.REACT_APP_API_URL}/api/posts/${idPostsUser}?userId=${userIdPost}`;

    const fetchPUTHandler = async () => {
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
          onUpdatePostFinish();
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
