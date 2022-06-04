import classes from "./FeedIdentifierCreatorComment.module.css";
import dateFormat from "dateformat";
import { useEffect, useState } from "react";

const FeedIdentifierCreatorComment = ({
  token,
  userIdToken,
  userIdComment,
  dateComment,
}) => {
  const [ficheUser, setFicheUser] = useState(null);

  //Aller chercher les photos des utilisateurs des commentaires
  // http://localhost:3000/api/fiche_user/fiche/49?userId=46

  const fetchGetFicheUserHandler = async () => {
    const url = ` http://localhost:3000/api/fiche_user/fiche/${userIdComment}?userId=${userIdToken}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataResponse = await response.json();

      if (response.ok) {       
        setFicheUser(dataResponse.results);
      } else {
        console.log("-->FeedIdentifierCreatorComment response PAS ok");        
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
