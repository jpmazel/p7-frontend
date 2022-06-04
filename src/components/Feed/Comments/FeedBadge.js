import { useEffect, useState } from "react";
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

  const fetchGetNumberCommentHandler = async () => {
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
        console.log("-->fetchGetNumberCommentHandler response.ok");
        console.log(response);
        console.log(dataResponse);
        setNumberOfComments(dataResponse.results);
      } else {
        console.log("-->fetchGetNumberCommentHandlerresponse PAS ok");
        console.log(response);
        console.log(dataResponse);
        throw new Error(dataResponse.error);
      }
    } catch (error) {
      console.log(
        "-->fetchGetNumberCommentHandler dans le catch requête fetchGetCommentHandler"
      );
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGetNumberCommentHandler();
  }, [newComment, updateDeleteComment]);

  return (
    <div className={classes.feedBadge}>
      <div className={classes.numberCicle}>
        {numberOfComments && numberOfComments.length}
      </div>
    </div>
  );
};

export default FeedBadge;
