import { useEffect } from "react";

import classes from "./FicheUser.module.css";

import { Navigate } from "react-router-dom";
import FicheUserDisplay from "../components/FicheUser/FicheUserDisplay";
import { useSelector, useDispatch } from "react-redux";
import { getFicheUser } from "../store/actions/ficheUser-actions";

const FicheUser = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.authentification.isLoggedIn);

  const authentification = useSelector(
    (state) => state.authentification.dataResponse
  );

  //Exécuté au montage du composant
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getFicheUser(authentification.userId, authentification.token));
    }
  }, [authentification.token, authentification.userId, isLoggedIn, dispatch]);

  return (
    <section className={classes.ficheUser}>
      {!isLoggedIn && <Navigate to="/" replace={true} />}
      {isLoggedIn && <FicheUserDisplay />}
    </section>
  );
};

export default FicheUser;
