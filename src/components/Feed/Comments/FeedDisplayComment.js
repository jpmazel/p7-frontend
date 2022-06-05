import { useEffect, useState } from "react";
import FeedComment from "./FeedComment";
import FeedCommentPhotoUser from "./FeedCommentPhotoUser";

import classes from "./FeedDisplayComment.module.css";
import FeedIdentifierCreatorComment from "./FeedIdentifierCreatorComment";

import Card from "../../UI/Card";
import FeedButtonComment from "./FeedButtonComment";
import { Link } from "react-router-dom";

const FeedDisplayComment = ({
  onUpdate,
  token,
  userIdToken,
  idPostsUser,
  newComment,
  idCommentButton,
  isDisplayedComment,
  onUpdateDeleteComment,
}) => {
  const [comments, setComments] = useState(null);
  const [updateDeleteComment, setUpdateDeleteComment] = useState(null);

  const [isUpdatingComment, setIsUpdatingComment] = useState(null);
  const [buttonSend, setButtonSend] = useState(false);
  const [isUpdatingCommentFinish, setIsUpdatingCommentFinish] = useState(false);

  //Aller chercher tous les commentaires qui sont sur la table comments_user
  // http://localhost:3000/api/posts/comments/589?userId=46
  const url = `http://localhost:3000/api/posts/comments/${idPostsUser}?userId=${userIdToken}`;

  const fetchGetCommentHandler = async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataResponse = await response.json();

      if (response.ok) {
        setComments(dataResponse.results);
      } else {
        console.log("-->Comments response PAS ok");
        throw new Error(dataResponse.error);
      }
    } catch (error) {
      console.log("-->Comments dans le catch requête fetchGetCommentHandler");
      console.log(error);
    }
  };

  //Pour mettre à jour un post qui est dans le feed
  const updateCommentHandler = (event) => {
    setIsUpdatingComment({
      isUpdating: true,
      commentToEdit: Number(event.target.id),
    });
  };

  //Le message a récupérer ET a envoyer sur la base de données
  //à cliquer sur le bouton envoyer
  const messageToSend = () => {
    setButtonSend(true);
  };

  //Le message a bien été envoyé à la base de données
  const onUpdateCommentFinish = () => {
    setIsUpdatingComment(null);
    setButtonSend(false);
    setIsUpdatingCommentFinish((prevState) => !prevState);
  };

  //Le commentaire a bien été supprimé il faut actualiser le badge du nombre de commentaire
  useEffect(() => {
    onUpdateDeleteComment(updateDeleteComment);
  }, [onUpdateDeleteComment, updateDeleteComment]);

  //Pour aller chercher les posts sur la base de données
  useEffect(() => {
    fetchGetCommentHandler();
  }, [onUpdate, newComment, updateDeleteComment, isUpdatingCommentFinish]);

  return (
    <section className={classes.feedDisplayComment}>
      {/* Afficher les commentaires sous le post s'il y a des commentaires  */}
      {isDisplayedComment &&
        comments &&
        comments.map(
          (comment) =>
            comment.comments_user_id_posts === idCommentButton && (
              <Card className={classes.card} key={comment.id_comments_user}>
                {/* Affichage conditionnel des commentaires si on a cliqué le bouton commentaire */}
                {/* et que on est sur le bon post */}

                {/* <p>id de comment : {comment.id_comments_user}</p> */}

                <Link
                  to={`/fiche_utilisateur/read/${comment.comments_user_userId}`}
                >
                  <FeedIdentifierCreatorComment
                    token={token}
                    userIdToken={userIdToken}
                    userIdComment={comment.comments_user_userId}
                    dateComment={comment.comments_user_date}
                  />
                </Link>

                <div className={classes.photoComment}>
                  <Link
                    to={`/fiche_utilisateur/read/${comment.comments_user_userId}`}
                  >
                    <FeedCommentPhotoUser
                      token={token}
                      userIdToken={userIdToken}
                      userIdComment={comment.comments_user_userId}
                    />
                  </Link>

                  <FeedComment
                    token={token}
                    comment={comment.comments_user_message}
                    isUpdatingComment={isUpdatingComment}
                    idComment={comment.id_comments_user}
                    userId={comment.comments_user_userId}
                    userIdToken={userIdToken}
                    idPost={comment.comments_user_id_posts}
                    buttonSend={buttonSend}
                    onUpdateCommentFinish={onUpdateCommentFinish}
                  />
                </div>

                <FeedButtonComment
                  token={token}
                  userIdToken={userIdToken}
                  userIdComment={comment.comments_user_userId}
                  idCommentUser={comment.id_comments_user}
                  onUpdateDelete={(idCommentUser) =>
                    setUpdateDeleteComment(idCommentUser)
                  }
                  onModicatifionMessage={updateCommentHandler}
                  isUpdatingComment={isUpdatingComment}
                  onSendMessage={messageToSend}
                />
              </Card>
            )
        )}
    </section>
  );
};

export default FeedDisplayComment;
