import { useEffect } from "react";
import FeedComment from "./FeedComment";
import FeedCommentPhotoUser from "./FeedCommentPhotoUser";

import classes from "./FeedDisplayComment.module.css";
import FeedIdentifierCreatorComment from "./FeedIdentifierCreatorComment";

import Card from "../../UI/Card";
import FeedButtonComment from "./FeedButtonComment";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { getFetchCommentary } from "../../../store/actions/commentary-action";

const FeedDisplayComment = ({
  onUpdate,
  token,
  userIdToken,
  idCommentButton,
  isDisplayedComment,
}) => {
  const comments = useSelector((state) => state.commentary.comments);
  const newComment = useSelector((state) => state.commentary.onNewComment);

  const dispatch = useDispatch();

  //Pour aller chercher les commentaires sur la base de données
  useEffect(() => {
    dispatch(getFetchCommentary(idCommentButton, userIdToken, token));
  }, [onUpdate, newComment, token, userIdToken, dispatch, idCommentButton]);
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
                    idComment={comment.id_comments_user}
                    userId={comment.comments_user_userId}
                    userIdToken={userIdToken}
                    idPost={comment.comments_user_id_posts}
                  />
                </div>

                <FeedButtonComment
                  token={token}
                  userIdToken={userIdToken}
                  userIdComment={comment.comments_user_userId}
                  idCommentUser={comment.id_comments_user}
                />
              </Card>
            )
        )}
    </section>
  );
};

export default FeedDisplayComment;
