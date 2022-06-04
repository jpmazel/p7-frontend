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

  console.log("-->Je suis dans FeedPosts isUpdatingPost");
  console.log(isUpdatingPost);

  const postToEdit = isUpdatingPost && isUpdatingPost.postToEdit;
  console.log(
    "-->Je suis dans FeedPosts postToEdit-----------------------------"
  );
  console.log(postToEdit);

  //Condition pour afficher l'interface de MODIFICATION
  const modificationOnePost = postToEdit === idPostsUser;

  //fonction exécuté par onChange du textarea du post
  const messageModificationHandler = (event) => {
    setMessageTextarea({ posts_user_message: event.target.value });
  };

  console.log("--->MessageTextarea");
  console.log(messageTextarea);

  //Envoyer le message mis à jour

  if (buttonSend && modificationOnePost) {
    //Requête PUT pour envoyer les données au serveur
    console.log("Condition OK pour l'envoie de la requête");

    const url = `http://localhost:3000/api/posts/${idPostsUser}?userId=${userIdPost}`;

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
          onUpdatePostFinish();
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
