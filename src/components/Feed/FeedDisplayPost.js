import { useEffect, useState } from "react";

import classes from "./FeedDisplayPost.module.css";
import Card from "../UI/Card";
import FeedPhotoUser from "./FeedPhotoUser";
import FeedIdentifierCreator from "./FeedIdentifierCreator";
import FeedButton from "./FeedButton";
import FeedPosts from "./FeedPosts";
import FeedImagePost from "./FeedImagePost";
import FeedPostVideo from "./FeedPostVideo";
import FeedNewComment from "./Comments/FeedNewComment";
import FeedDisplayComment from "./Comments/FeedDisplayComment";
import { Link } from "react-router-dom";
import FeedLike from "./FeedLike";
import useHttp from "../../hooks/use-http";
import { useSelector } from "react-redux";

const FeedDisplayPost = ({ onUpdate }) => {
  const authentification = useSelector(
    (state) => state.authentification.dataResponse
  );
  const [mounted, setMounted] = useState(true);

  const [messages, setMessages] = useState(null);
  const [updateDeletePost, setUpdateDeletePost] = useState(null);

  const [isUpdatingPost, setIsUpdatingPost] = useState(null);
  const [buttonSend, setButtonSend] = useState(false);
  const [isUpdatingPostFinish, setIsUpdatingPostFinish] = useState(false);

  const [idCommentButton, setIdCommentButton] = useState(null);
  const [isDisplayedComment, setIsDisplayedComment] = useState(false);

  //Aller chercher tous les posts de la base de données qui sont la table posts_user
  //CUSTOM HOOLK HTTP GET
  const { sendRequest: fetchGetMessageHandler } = useHttp();

  //Pour mettre à jour un post qui est dans le feed
  const updatePostHandler = (event) => {
    setIsUpdatingPost({
      isUpdating: true,
      postToEdit: Number(event.target.id),
    });
  };

  //Le message a récupérer ET a envoyer sur la base de données
  //à cliqué sur le bouton envoyer
  const messageToSend = () => {
    setButtonSend(true);
  };

  //à cliqué sur le bouton COMMENTAIRE du POST
  const commentsDisplayPost = (event) => {
    //Récupération de l'id sur le bouton COMMENTAIRE
    setIdCommentButton(Number(event.target.id));

    //au clique sur le bouton COMMENTAIRE je passe FALSE à TRUE (TOGGLE)
    setIsDisplayedComment((prevState) => !prevState);
  };

  //Le message a bien été envoyé à la base de données
  const onUpdatePostFinish = () => {
    setIsUpdatingPost(null);
    setButtonSend(false);
    setIsUpdatingPostFinish((prevState) => !prevState);
  };

  //Pour aller chercher les posts sur la base de données
  useEffect(() => {
    //objet de configuration de la requête du custom-hook
    const requestConfig = {
      url: `http://localhost:3000/api/posts?userId=${authentification.userId}`,
      method: "GET",
      headers: { Authorization: `Bearer ${authentification.token}` },
    };

    if (mounted) {
      authentification.userId &&
        fetchGetMessageHandler(requestConfig, (applyData) =>
          setMessages(applyData)
        );
    }
    return () => {
      //fonction de nettoyage
      setMounted(true);
    };
  }, [
    onUpdate,
    updateDeletePost,
    isUpdatingPostFinish,
    authentification.userId,
    fetchGetMessageHandler,
    mounted,
    authentification.token,
  ]);

  //Mettre le dernier message envoyé en haut de la pile
  //Le denier message envoyé est le premier message affiché
  const orderDisplayMessage =
    messages &&
    messages.sort((a, b) => {
      return b.id_posts_user - a.id_posts_user;
    });

  return (
    <section className={classes.feedDisplayPost}>
      <h2>Les messages :</h2>

      <div className={classes.container}>
        {orderDisplayMessage &&
          orderDisplayMessage.map((message) => (
            <section key={message.id_posts_user}>
              <Card className={classes.card}>
                <Link
                  to={`/fiche_utilisateur/read/${message.posts_user_userId}`}
                >
                  <FeedIdentifierCreator
                    user_prenom={message.fiche_user_prenom}
                    user_nom={message.fiche_user_nom}
                    posts_date={message.posts_user_date}
                  />
                </Link>

                <div className={classes.photoMessage}>
                  <Link
                    to={`/fiche_utilisateur/read/${message.posts_user_userId}`}
                  >
                    <FeedPhotoUser
                      photoProfilUrl={message.fiche_user_photoProfilUrl}
                    />
                  </Link>

                  <FeedPosts
                    message={message.posts_user_message}
                    isUpdatingPost={isUpdatingPost}
                    idPostsUser={message.id_posts_user}
                    buttonSend={buttonSend}
                    userIdPost={message.posts_user_userId}
                    token={authentification.token}
                    onUpdatePostFinish={onUpdatePostFinish}
                  />
                </div>

                <FeedImagePost photoPost={message.posts_user_photoUrlLink} />
                <FeedPostVideo videoPost={message.posts_user_videoYTUrlLink} />

                <div className={classes.likeAndButton}>
                  <FeedLike
                    token={authentification.token}
                    idPostsUser={message.id_posts_user}
                    userIdToken={Number(authentification.userId)}
                  />

                  <FeedButton
                    userIdToken={Number(authentification.userId)}
                    userIdPost={message.posts_user_userId}
                    idPostsUser={message.id_posts_user}
                    token={authentification.token}
                    onUpdateDelete={(idPostsUser) =>
                      setUpdateDeletePost(idPostsUser)
                    }
                    onModicatifionMessage={updatePostHandler}
                    isUpdatingPost={isUpdatingPost}
                    onSendMessage={messageToSend}
                    onCommentsDisplayPost={commentsDisplayPost}
                  />
                </div>
              </Card>

              {isDisplayedComment && message.id_posts_user === idCommentButton && (
                <>
                  <FeedDisplayComment
                    onUpdate={onUpdate}
                    token={authentification.token}
                    userIdToken={Number(authentification.userId)}
                    idPostsUser={message.id_posts_user}
                    idCommentButton={idCommentButton}
                    isDisplayedComment={isDisplayedComment}
                  />

                  <FeedNewComment idPostsUser={message.id_posts_user} />
                </>
              )}
            </section>
          ))}
      </div>
    </section>
  );
};

export default FeedDisplayPost;
