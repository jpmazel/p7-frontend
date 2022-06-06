import { useCallback, useEffect, useState } from "react";
import classes from "./FeedCommentPhotoUser.module.css";
import emptyPortrait from "../../../assets/images/empty-portrait.jpg";

const FeedCommentPhotoUser = ({ token, userIdToken, userIdComment }) => {
  const [ficheUser, setFicheUser] = useState(null);
  
  //Aller chercher les photos des utilisateurs des commentaires
  // http://localhost:3000/api/fiche_user/fiche/49?userId=46
  const url = `${process.env.REACT_APP_API_URL}/api/fiche_user/fiche/${userIdComment}?userId=${userIdToken}`;

  const fetchGetFicheUserHandler = useCallback( async () => {
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
        console.log("-->FeedCommentPhotoUser response PAS ok");        
        throw new Error(dataResponse.error);
      }
    } catch (error) {
      console.log(
        "-->FeedCommentPhotoUser dans le catch requête fetchGetCommentHandler"
      );
      console.log(error);
    }
  },[token, url]);

  useEffect(() => {   
    fetchGetFicheUserHandler();
  }, [fetchGetFicheUserHandler]);

  return (
    <>
      {ficheUser && (
        <div className={classes.feedCommentPhotoUser}>
          <img src={
            ficheUser[0].fiche_user_photoProfilUrl ?
            ficheUser[0].fiche_user_photoProfilUrl :
            emptyPortrait
            } alt="tête profil" />
        </div>
      )}
    </>
  );
};

export default FeedCommentPhotoUser;
