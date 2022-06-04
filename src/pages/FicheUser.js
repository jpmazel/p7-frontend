import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../store/authContext";
import classes from "./FicheUser.module.css";

import { Navigate } from "react-router-dom";
import FicheUserDisplay from "../components/FicheUser/FicheUserDisplay";

const FicheUser = () => {
  const authCtx = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [isCreateFiche, setIsCreateFiche] = useState(false);

  const isLoggedIn = authCtx.isLoggedIn;

  //PREMIRE REQUÊTE requête pour accéder à des ressources protéger qui nécessite un token et un userId
  const url = `${process.env.REACT_APP_API_URL}/api/fiche_user/fiche/?userId=${authCtx.userId}`;

  const fecthHandler = useCallback(async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCtx.token}`,
        },
      });

      const dataResponse = await response.json();
      console.log("______>dataResponse fecthHandler FicheUser<______");
      console.log(dataResponse);

      //Controle si le tableau est vide ou pas
      const controlArrayNotEmpty =
        Array.isArray(dataResponse.results) && dataResponse.results.length;

      if (response.ok) {
        //si le tableau n'est pas vide =  la fiche existe sur la base de donnée
        if (controlArrayNotEmpty) {
          //reformatage de la donnée
          const transformedData = () => {
            return {
              job: dataResponse.results[0].fiche_user_job,
              bio: dataResponse.results[0].fiche_user_bio,
              age: dataResponse.results[0].fiche_user_age,
              nom: dataResponse.results[0].fiche_user_nom,
              photoProfilUrl: dataResponse.results[0].fiche_user_photoProfilUrl,
              prenom: dataResponse.results[0].fiche_user_prenom,
              userId: dataResponse.results[0].fiche_user_userId,
              idFiche: dataResponse.results[0].id_fiche_user,
            };
          };
          //envoie dans le state des données
          setData(transformedData);
          setIsCreateFiche(true);
        } else {
          console.log(
            "la fiche n'exite pas - il faut la créer - je suis dans le else"
          );
          //creation de la fiche de l'utilisateur sur la base de donnée
          const fetchFicheUserCreateHandler = async () => {
            try {
              const url = `${process.env.REACT_APP_API_URL}/api/fiche_user/?userId=${authCtx.userId}`;

              const dataUpdateFormData = {
                userId: authCtx.userId,
                nom: "modifier la fiche",
                prenom: "modifier la fiche",
                age: 0,
                job: "modifier la fiche",
                bio: "modifier la fiche",
                photoProfilUrl: "",
              };

              const formData = new FormData();
              formData.append("ficheUser", JSON.stringify(dataUpdateFormData));

              const response2 = await fetch(url, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${authCtx.token}`,
                },
                body: formData,
              });

              const dataResponse2 = await response2.json();

              if (response2.ok) {
                console.log("---->response2.ok");
                console.log(response2);
                console.log(dataResponse2);
                setIsCreateFiche(true);
              } else {
                console.log("---->response2. PAS ok");
                console.log(response2);
                console.log(dataResponse2);
                throw new Error(dataResponse2.error);
              }
            } catch (error) {
              console.log(
                "dans le CATCH requête creation fiche user serveur error"
              );
              console.log(error);
            }
          };

          fetchFicheUserCreateHandler();
        }
      } else {
        throw new Error(dataResponse.error);
      }
    } catch (error) {
      console.log("Problème serveur la requête n'est pas parti");
      console.log(error);
    }
  }, [authCtx.token, url]);

  //pour exécuter la fonction au montage du composant
  useEffect(() => {
    if (isLoggedIn) {
      fecthHandler();
    }
  }, [fecthHandler, isLoggedIn]);

  const onRefresh = () => {
    fecthHandler();
  };

  return (
    <section className={classes.ficheUser}>
      {!isLoggedIn && <Navigate to="/" replace={true} />}
      {isLoggedIn && isCreateFiche && (
        <FicheUserDisplay data={data} onRefresh={onRefresh} />
      )}
    </section>
  );
};

export default FicheUser;
