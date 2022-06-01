import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import emptyPortrait from "../../assets/images/empty-portrait.jpg";
import AuthContext from "../../store/authContext";
import classes from "./FicheUserDisplayRead.module.css";

const FicheUserDisplayRead = () => {
  const { id } = useParams();
  console.log("--->id useParams");
  console.log(id);

  const [data, setData] = useState();
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  //Requête pour récupérer la fiche utilisateur
  const url = `${process.env.REACT_APP_API_URL}/api/fiche_user/fiche/${id}?userId=${authCtx.userId}`;
  const fetchGetFicheUserHandler = async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      });

      const dataResponse = await response.json();

      if (response.ok) {
        console.log("-----> fetchGetFicheUserHandler response.ok");
        console.log(response);
        console.log(dataResponse);
        setData(dataResponse.results);
      } else {
        console.log("----->fetchGetFicheUserHandler pas OK response");
        console.log(response);
        console.log(dataResponse);
        throw new Error(dataResponse.error);
      }
    } catch (error) {
      console.log("dans le CATCH fetchGetFicheUserHandler");
      console.log(error);
    }
  };

  useEffect(() => {
    id && fetchGetFicheUserHandler();
  }, []);

  return (
    <>
      {!isLoggedIn && <Navigate to="/" replace={true} />}

      {isLoggedIn && (
        <div className={classes.container}>
          <section className={classes.user}>
            <h1>Vous êtes sur la fiche utilisateur de </h1>
            <p>
              {data && data[0].fiche_user_prenom}{" "}
              {data && data[0].fiche_user_nom}
            </p>
            {/* PHOTO PROFIL */}
            <p>
              <img
                src={
                  data && data[0].fiche_user_photoProfilUrl
                    ? data && data[0].fiche_user_photoProfilUrl
                    : emptyPortrait
                }
                alt="photo_fiche"
              />
            </p>
            <p>Votre nom: </p>
            <p>{data && data[0].fiche_user_nom}</p>

            <p>Votre prénom: </p>
            <p>{data && data && data[0].fiche_user_prenom}</p>

            <p>Votre age: </p>
            <p>{data && data[0].fiche_user_age} ans</p>

            <p>Profession</p>
            <p>{data && data[0].fiche_user_job}</p>

            <p>Mieux me connaître</p>
            <p>{data && data[0].fiche_user_bio}</p>
          </section>
        </div>
      )}
    </>
  );
};

export default FicheUserDisplayRead;
