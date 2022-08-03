import { useEffect } from "react";

import classes from "./FicheUser.module.css";

import { Navigate } from "react-router-dom";
import FicheUserDisplay from "../components/FicheUser/FicheUserDisplay";

import { getFicheUser } from "../store/actions/ficheUser-action";
import { useDispatch, useSelector } from "react-redux";

const FicheUser = () => {
  const isLoggedIn = useSelector((state) => state.authentification.isLoggedIn);
  const userId = useSelector(
    (state) => state.authentification.dataResponse.userId
  );
  const token = useSelector(
    (state) => state.authentification.dataResponse.token
  );
  const dispatch = useDispatch();

  // Pour exécuter la fonction au montage du composant
  useEffect(() => {
    if (isLoggedIn && userId) {
      dispatch(getFicheUser(userId, token));
    }
  }, [token, userId, dispatch, isLoggedIn]);

  return (
    <section className={classes.ficheUser}>
      {!isLoggedIn && <Navigate to="/" replace={true} />}

      {isLoggedIn && <FicheUserDisplay />}
    </section>
  );
};

export default FicheUser;
