import { useMemo } from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import emptyPortrait from "../../assets/images/empty-portrait.jpg";
import useHttp from "../../hooks/use-http";

import classes from "./FicheUserDisplayRead.module.css";

const FicheUserDisplayRead = () => {
  const { id } = useParams();

  const [data, setData] = useState();
  const { sendRequest: fetchGetFicheUserHandler } = useHttp();

  const isLoggedIn = useSelector((state) => state.authentification.isLoggedIn);

  const authentification = useSelector(
    (state) => state.authentification.dataResponse
  );

  const requestConfig = useMemo(
    () => ({
      url: `${process.env.REACT_APP_API_URL}/api/fiche_user/fiche/${id}?userId=${authentification.userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${authentification.token}`,
      },
    }),
    [authentification.token, authentification.userId, id]
  );

  useEffect(() => {
    id &&
      fetchGetFicheUserHandler(requestConfig, (dataResponse) =>
        setData(dataResponse)
      );
  }, [fetchGetFicheUserHandler, requestConfig, id]);

  return (
    <>
      {!isLoggedIn && <Navigate to="/" replace={true} />}

      {isLoggedIn && (
        <div className={classes.container}>
          <section className={classes.user}>
            <h1>Vous êtes sur la fiche utilisateur de </h1>
            <p>
              <span> {data && data[0].fiche_user_prenom}</span>{" "}
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
