import { useCallback, useEffect, useState } from "react";
import classes from "./FeedBadge.module.css";
import { useSelector } from "react-redux";

const FeedBadge = ({
  idPostsUser,
  userIdToken,
  token,  
}) => {
  const [numberOfComments, setNumberOfComments] = useState();

  const newComment = useSelector((state) => state.commentary.onNewComment);
  const updateDeleteComment = useSelector((state) => state.commentary.onUpdateDeleteComment);

  //Requête pour avoir le nombre de commentaire (je vais chercher tous les commentaires du post sélectionné)

  const fetchGetNumberCommentHandler = useCallback(async () => {
    const url = `http://localhost:3000/api/posts/comments/${idPostsUser}?userId=${userIdToken}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataResponse = await response.json();

      if (response.ok) {
        setNumberOfComments(dataResponse.results);
      } else {
        console.log("-->fetchGetNumberCommentHandlerresponse PAS ok");
        console.log(dataResponse);
        throw new Error(dataResponse.error);
      }
    } catch (error) {
      console.log(
        "-->fetchGetNumberCommentHandler dans le catch requête fetchGetCommentHandler"
      );
      console.log(error);
    }
  }, [idPostsUser, token, userIdToken]);

  useEffect(() => {
    fetchGetNumberCommentHandler();
  }, [newComment, updateDeleteComment, fetchGetNumberCommentHandler]);

  return (
    <div className={classes.feedBadge}>
      <div className={classes.numberCicle}>
        {numberOfComments && numberOfComments.length}
      </div>
    </div>
  );
};

export default FeedBadge;
