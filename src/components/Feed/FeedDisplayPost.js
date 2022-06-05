import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../store/authContext";
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

const FeedDisplayPost = ({ onUpdate }) => {
  const authCtx = useContext(AuthContext);
  const [messages, setMessages] = useState(null);
  const [updateDeletePost, setUpdateDeletePost] = useState(null);

  const [isUpdatingPost, setIsUpdatingPost] = useState(null);
  const [buttonSend, setButtonSend] = useState(false);
  const [isUpdatingPostFinish, setIsUpdatingPostFinish] = useState(false);

  const [newComment, setNewComment] = useState(false);
  const [updateDeleteComment, setUpdateDeleteComment] = useState();

  const [idCommentButton, setIdCommentButton] = useState(null);
  const [isDisplayedComment, setIsDisplayedComment] = useState(false);

  //Aller chercher tous les posts de la base de données qui sont la table posts_user
  const url = `http://localhost:3000/api/posts?userId=${authCtx.userId}`;

  const fetchGetMessageHandler = useCallback( async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      });

      const dataResponse = await response.json();

      if (response.ok) {
        setMessages(dataResponse.results);
      } else {
        console.log("-->response PAS ok");
        throw new Error(dataResponse.error);
      }
    } catch (error) {
      console.log("-->Dans le catch requête fetchGetMessageHandler");
      console.log(error);
    }
  },[authCtx.token,url]);

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

  //Le commentaire a bien été envoyé sur la base de donnée
  const onNewComment = () => {
    setNewComment((prevState) => !prevState);
  };

  //Le commentaire a bien été supprimé de la base de données
  const onUpdateDeleteComment = (updateDeleteComment) => {
    setUpdateDeleteComment(updateDeleteComment);
  };

  //Pour aller chercher les posts sur la base de données
  useEffect(() => {    
    fetchGetMessageHandler();
  }, [onUpdate, updateDeletePost, isUpdatingPostFinish,fetchGetMessageHandler]);

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
                    token={authCtx.token}
                    onUpdatePostFinish={onUpdatePostFinish}
                  />
                </div>

                <FeedImagePost photoPost={message.posts_user_photoUrlLink} />
                <FeedPostVideo videoPost={message.posts_user_videoYTUrlLink} />

                <div className={classes.likeAndButton}>
                  <FeedLike
                    token={authCtx.token}
                    idPostsUser={message.id_posts_user}
                    userIdToken={Number(authCtx.userId)}
                  />

                  <FeedButton
                    userIdToken={Number(authCtx.userId)}
                    userIdPost={message.posts_user_userId}
                    idPostsUser={message.id_posts_user}
                    token={authCtx.token}
                    onUpdateDelete={(idPostsUser) =>
                      setUpdateDeletePost(idPostsUser)
                    }
                    onModicatifionMessage={updatePostHandler}
                    isUpdatingPost={isUpdatingPost}
                    onSendMessage={messageToSend}
                    onCommentsDisplayPost={commentsDisplayPost}
                    newComment={newComment}
                    updateDeleteComment={updateDeleteComment}
                  />
                </div>
              </Card>

              <FeedDisplayComment
                onUpdate={onUpdate}
                token={authCtx.token}
                userIdToken={Number(authCtx.userId)}
                idPostsUser={message.id_posts_user}
                newComment={newComment}
                idCommentButton={idCommentButton}
                isDisplayedComment={isDisplayedComment}
                onUpdateDeleteComment={onUpdateDeleteComment}
              />

              {isDisplayedComment &&
                message.id_posts_user === idCommentButton && (
                  <FeedNewComment
                    idPostsUser={message.id_posts_user}
                    onNewComment={onNewComment}
                  />
                )}
            </section>
          ))}
      </div>
    </section>
  );
};

export default FeedDisplayPost;
