import { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../store/authContext";
import Logo from "./Logo";
import classes from "./MainHeader.module.css";

const MainHeader = () => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;
  console.log("-->ICI isLoggedIn");
  console.log(isLoggedIn);

  return (
    <header className={classes.header}>
      <Logo />
      <nav>
        <ul>
          <NavLink
            className={({ isActive }) => (isActive ? classes.active : "")}
            to="/"
          >
            <li>Accueil</li>
          </NavLink>

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
    </header>
  );
};

export default MainHeader;
