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
        console.log("-->Comments response.ok");
        console.log(response);
        console.log(dataResponse);
        setComments(dataResponse.results);
      } else {
        console.log("-->Comments response PAS ok");
        console.log(response);
        console.log(dataResponse);
        throw new Error(dataResponse.error);
      }
    } catch (error) {
      console.log("-->Comments dans le catch requête fetchGetCommentHandler");
      console.log(error);
    }
  };

  //Pour mettre à jour un post qui est dans le feed
  const updateCommentHandler = (event) => {
    console.log("Je suis dans updateCommentHandler");
    console.log(`l'id du post : ${event.target.id}`);

    setIsUpdatingComment({
      isUpdating: true,
      commentToEdit: Number(event.target.id),
    });
  };

  console.log("--->isUpdatingPost");
  console.log(isUpdatingComment);

  //Le message a récupérer ET a envoyer sur la base de données
  //à cliquer sur le bouton envoyer
  const messageToSend = () => {
    console.log("J'ai appuyer sur le bouton envoyer");
    setButtonSend(true);
  };

  //Le message a bien été envoyé à la base de données
  const onUpdateCommentFinish = () => {
    console.log("------->onUpdateCommentFinish<------");
    setIsUpdatingComment(null);
    setButtonSend(false);
    setIsUpdatingCommentFinish((prevState) => !prevState);
  };

  //Pour aller chercher les posts sur la base de données
  useEffect(() => {
    fetchGetCommentHandler();
  }, [onUpdate, newComment, updateDeleteComment, isUpdatingCommentFinish]);

  console.log("--->Comments");
  console.log(comments);

  //Gestion de l'affichage des commentaires au clic sur le bouton commentaire dans les posts
  console.log("***Gestion de l'affichage des commentaires*****");
  console.log(isDisplayedComment);
  console.log(idCommentButton);
  console.log(idPostsUser);

  return (
    <section className={classes.feedDisplayComment}>
      {/* Afficher les commentaires sous le post s'il y a des commentaires  */}
      {isDisplayedComment &&
        comments &&
        comments.map(
          (comment) =>
            comment.comments_user_id_posts === idCommentButton && (
              <Card className={classes.card}>
                {/* Affichage conditionnel des commentaires si on a cliqué le bouton commentaire */}
                {/* et que on est sur le bon post */}
                <div key={comment.id_comments_user}>
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
                </div>
              </Card>
            )
        )}
    </section>
  );
};

export default FeedDisplayComment;
