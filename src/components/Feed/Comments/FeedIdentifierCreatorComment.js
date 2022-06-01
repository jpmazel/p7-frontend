import classes from "./FeedIdentifierCreatorComment.module.css";
import dateFormat from "dateformat";
import { useEffect, useState } from "react";

const FeedIdentifierCreatorComment = ({
  token,
  userIdToken,
  userIdComment,
  dateComment
}) => {
  const [ficheUser, setFicheUser] = useState(null);

  console.log("---Je suis dans FeedIdentifierCreatorComment");
  //Aller chercher les photos des utilisateurs des commentaires
  // http://localhost:3000/api/fiche_user/fiche/49?userId=46
  const url = ` http://localhost:3000/api/fiche_user/fiche/${userIdComment}?userId=${userIdToken}`;

  const fetchGetFicheUserHandler = async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataResponse = await response.json();

      if (response.ok) {
        console.log("-->FeedIdentifierCreatorComment response.ok");
        console.log(response);
        console.log(dataResponse);
        setFicheUser(dataResponse.results);
      } else {
        console.log("-->FeedIdentifierCreatorComment response PAS ok");
        console.log(response);
        console.log(dataResponse);
        throw new Error(dataResponse.error);
      }
    } catch (error) {
      console.log(
        "-->FeedIdentifierCreatorComment dans le catch requête fetchGetCommentHandler"
      );
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGetFicheUserHandler();
  }, []);

  //Modification du format de la date
  const date = dateFormat(dateComment, "isoDate");
  const time = dateFormat(dateComment, "isoTime");
  console.log( date, time)

  return (
    <>
      {ficheUser && (
        <div className={classes.feedIdentifierCreatorComment}>
          <p>
            {ficheUser[0].fiche_user_prenom} {ficheUser[0].fiche_user_nom}
          </p>
          <p>Posté le : {`${date} ${time}`}</p>
        </div>
      )}
    </>
  );
};

export default FeedIdentifierCreatorComment;
