import { useCallback, useEffect, useState } from "react";
import classes from "./FeedBadge.module.css";

const FeedBadge = ({
  idPostsUser,
  userIdToken,
  token,
  newComment,
  updateDeleteComment,
}) => {
  const [numberOfComments, setNumberOfComments] = useState();

  //Requête pour avoir le nombre de commentaire (je vais chercher tous les commentaires du post sélectionné)

  const fetchGetNumberCommentHandler = useCallback( async () => {
    const url = `${process.env.REACT_APP_API_URL}/api/posts/comments/${idPostsUser}?userId=${userIdToken}`;
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
        throw new Error(dataResponse.error);
      }
    } catch (error) {
      console.log(
        "-->fetchGetNumberCommentHandler dans le catch requête fetchGetCommentHandler"
      );
      console.log(error);
    }
  }, [idPostsUser,token,userIdToken]);

  useEffect(() => {
    fetchGetNumberCommentHandler();
  }, [newComment, updateDeleteComment,fetchGetNumberCommentHandler]);

  return (
    <div className={classes.feedBadge}>
      <div className={classes.numberCicle}>
        {numberOfComments && numberOfComments.length}
      </div>
    </div>
  );
};

export default FeedBadge;
