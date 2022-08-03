import { useEffect, useRef, useState } from "react";
import Button from "../UI/Button";
import classes from "./authForm.module.css";
import ErrorModal from "../UI/ErrorModal";
import Wrapper from "../Helpers/Wrapper";
import Loader from "../UI/Loader";

import { useDispatch, useSelector } from "react-redux";
import { postFetchLoginAuthentification } from "../../store/actions/authentification-actions";
import { authentificationActions } from "../../store/slices/authentification-slice";

//isLogin TRUE : Affiche l'interface pour se connecter
//isLogin FALSE : Affiche l'interface pour créer un compte

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordControleInputRef = useRef();

  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);

  const [passwordPlain, setPasswordPlain] = useState(false);

  const [error, setError] = useState();
  const errorFetch = useSelector((state) => state.authentification.errorFetch);
  const accountCreate = useSelector(
    (state) => state.authentification.accountCreate
  );

  //SPINNER - LOADER
  const isLoading = useSelector((state) => state.authentification.isLoading);

  //Lire les identifiants dans le local storage
  useEffect(() => {
    dispatch(authentificationActions.localStorageAuth());
  }, [dispatch]);

  //pour basculer entre les interfaces "CREATION de COMPTE" et "CONNEXION"
  const toggleAuthModeHandler = () => {
    dispatch(authentificationActions.accountCreate(false));
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    let enteredPasswordControl;

    if (isLogin) {
      enteredPasswordControl = enteredPassword;
    } else {
      enteredPasswordControl = passwordControleInputRef.current.value;
    }

    //Contrôle input pas vide
    if (
      enteredEmail.trim().length === 0 ||
      enteredPassword.trim().length === 0
    ) {
      setError({
        title: "Un ou plusieurs champs sont vides",
        message: "Entrer votre email et ou votre mot de passe",
      });

      return;
    }

    //Controle validité email
    const regExEmail = (value) => {
      return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    };

    if (!regExEmail(enteredEmail)) {
      setError({
        title: "Email invalide",
        message: "Email invalide",
      });

      return;
    }

    //Contrôle que le password soit le même dans les deux inputs password
    const samePassword = enteredPassword === enteredPasswordControl;

    if (!samePassword) {
      setError({
        title: "Le mot de passe est différent",
        message: "Entrer un mot de passe identique dans les deux champs",
      });

      return;
    }

    const credential = {
      email: enteredEmail,
      password: enteredPassword,
    };

    dispatch(authentificationActions.isLoading(true));

    //Envois de la requête login et création de compte
    dispatch(postFetchLoginAuthentification(isLogin, credential));
  };

  //Gérer les modales d'erreurs------------------------------------------------
  const errorHandler = () => {
    setError(null);
    dispatch(authentificationActions.resetErrorFetch());
  };

  useEffect(() => {
    //AUTHENTIFICATION ECHEC
    if (isLogin && errorFetch) {
      setError({
        title: "Echec authentification",
        message: errorFetch.error,
      });
      return;
    }

    //Gérer l'erreur de la CREATION DE COMPTE avec un EMAIL
    //DEJA PRIS et l'afficher dans la modal ErrorModal
    //OU mot de passe TROP FAIBLE
    if (!isLogin && errorFetch) {
      setError({
        title: "Il y a un problème",
        message: errorFetch.error.code || errorFetch.error,
      });
    }

    //Quand il n'y a pas d'erreur à la création de compte
    //basculer sur la page connexion
    if (!isLogin && !errorFetch && accountCreate) {
      setIsLogin(true);
    }
  }, [isLogin, errorFetch, accountCreate]);

  //Pour gérer l'affichage en clair du password
  const passwordPlainHandler = () => {
    setPasswordPlain((prevState) => !prevState);
  };

  return (
    <Wrapper>
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={errorHandler}
        />
      )}
      <section className={classes.auth}>
        {isLogin ? <h1>Se connecter</h1> : <h1>Créer un compte</h1>}

        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor="email">Votre email</label>
            <input type="email" id="email" ref={emailInputRef} />
          </div>

          <div className={classes.control}>
            <label htmlFor="password">Votre mot de passe</label>
            <input
              type={passwordPlain ? "text" : "password"}
              id="password"
              ref={passwordInputRef}
            />

            {!isLogin && (
              <>
                <label htmlFor="password">Contrôle du mot de passe</label>
                <input
                  type={passwordPlain ? "text" : "password"}
                  id="passwordControl"
                  ref={passwordControleInputRef}
                />
              </>
            )}

            {/* Pour afficher en clair le mot de passe  */}
            <div className={classes.checkbox}>
              <label htmlFor="displayPassword">Afficher le mot de passe</label>
              <input
                type="checkbox"
                id="displayPassword"
                checked={passwordPlain}
                onChange={passwordPlainHandler}
              />
            </div>

            {!isLogin && (
              <ul>
                <li>
                  <p>Le mot de passe doit contenir au minimum</p>
                </li>
                <li>
                  <p>5 caractères avec :</p>
                </li>
                <li>
                  <p>2 majuscules</p>
                </li>
                <li>
                  <p>2 chiffres</p>
                </li>
              </ul>
            )}
          </div>

          <div className={classes.actions}>
            {!isLoading && (
              <Button type={"submit"}>
                {isLogin ? "Se connecter" : "Créer un compte"}
              </Button>
            )}

            <p onClick={toggleAuthModeHandler}>
              {isLogin ? "Créer un compte" : "Se connecter"}
            </p>

            {/* {isLoading && <p>En cours de chargement</p>} */}
            {isLoading && <Loader />}
          </div>
        </form>
      </section>
    </Wrapper>
  );
};

export default AuthForm;
