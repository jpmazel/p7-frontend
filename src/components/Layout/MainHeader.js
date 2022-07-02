import { useEffect, useState } from "react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import AuthContext from "../../store/authContext";
import Logo from "./Logo";
import ErrorModal from "../UI/ErrorModal";
import classes from "./MainHeader.module.css";

const MainHeader = ({ ficheRefresh, onConditionLinkInactive }) => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const [newFiche, setNewFiche] = useState();

  const { sendRequest: fecthHandler } = useHttp();

  const [error, setError] = useState(false);

  //La requête GET pour aller controler la colonne fiche_user_new_fiche (si la fiche a été validé)
  useEffect(() => {
    const requestConfig = {
      url: `${process.env.REACT_APP_API_URL}/api/fiche_user/fiche/?userId=${authCtx.userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${authCtx.token}`,
      },
    };

    //La requête GET
    isLoggedIn &&
      authCtx.userId &&
      fecthHandler(requestConfig, (dataResponse) => {
        setNewFiche(dataResponse[0]);
      });
  }, [authCtx.token, authCtx.userId, fecthHandler, isLoggedIn, ficheRefresh]);

  //à TRUE le lien ACCUEIL sera désactivé et donc à FALSE il sera activé
  const conditionLinkInactive =
    newFiche === undefined || newFiche.fiche_user_new_fiche === "1";

  //Remonter l'information vers App.js
  useEffect(() => {
    let isActive = true;
    if (isActive) {
      onConditionLinkInactive(conditionLinkInactive);
    }

    //cleanup function
    return () => {
      isActive = false;
    };
  }, [conditionLinkInactive, onConditionLinkInactive]);

  //Gestion de la modale d'erreur
  const errorModalHandler = () => {
    setError({
      title: "ATTENTION",
      message:
        "Vous devez finir de remplir le formulaire avant de quitter cette page",
    });
  };

  return (
    <header className={classes.header}>
      <Logo />
      <nav>
        <ul>
          {!conditionLinkInactive && (
            <NavLink
              className={({ isActive }) => (isActive ? classes.active : "")}
              to="/"
            >
              <li>Accueil</li>
            </NavLink>
          )}

          {conditionLinkInactive && (
            <li onClick={errorModalHandler}>Accueil</li>
          )}

          {isLoggedIn && (
            <NavLink
              className={({ isActive }) => (isActive ? classes.active : "")}
              to="fiche_utilisateur"
            >
              <li>Fiche Utilisateur</li>
            </NavLink>
          )}

          {isLoggedIn && (
            <li onClick={authCtx.logout} className={classes.disconnect}>
              Se déconnecter
            </li>
          )}
        </ul>
      </nav>

      {/* Modale d'erreur */}
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={() => setError(false)}
        />
      )}
    </header>
  );
};

export default MainHeader;
