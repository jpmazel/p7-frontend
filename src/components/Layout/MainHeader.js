import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import ErrorModal from "../UI/ErrorModal";
import classes from "./MainHeader.module.css";
import { useSelector, useDispatch } from "react-redux";
import { authentificationActions } from "../../store/slices/authentification-slice";
import { ficheUserActions } from "../../store/slices/ficheUser-slice";

const MainHeader = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.authentification.isLoggedIn);

  const newFiche = useSelector(
    (state) => state.ficheUser.ficheUserData.newFiche
  );

  const [error, setError] = useState(false);

  //à TRUE le lien ACCUEIL sera désactivé et donc à FALSE il sera activé
  const conditionLinkActive = newFiche;

  const logoutHandler = () => {
    dispatch(authentificationActions.logout());
    dispatch(ficheUserActions.deleteAccount());
  };

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
          {/* Le lien ACCUEIL lorsqu'on est connecté */}
          {conditionLinkActive && (
            <NavLink
              className={({ isActive }) => (isActive ? classes.active : "")}
              to="/"
            >
              <li>Accueil</li>
            </NavLink>
          )}

          {/* Le lien ACCUEIL à la création de fiche */}
          {isLoggedIn && !conditionLinkActive && (
            <li onClick={errorModalHandler}>Accueil</li>
          )}

          {/* Lien FICHE UTILISATEUR */}
          {isLoggedIn && (
            <NavLink
              className={({ isActive }) => (isActive ? classes.active : "")}
              to="fiche_utilisateur"
            >
              <li>Fiche Utilisateur</li>
            </NavLink>
          )}

          {/* Lien pour se DECONNECTER */}
          {isLoggedIn && (
            <li onClick={logoutHandler} className={classes.disconnect}>
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
