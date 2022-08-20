import { useEffect, useRef, useState } from "react";
import Button from "../UI/Button";
import classes from "./authForm.module.css";
import ErrorModal from "../UI/ErrorModal";
import Wrapper from "../Helpers/Wrapper";
import Loader from "../UI/Loader";
import { useDispatch, useSelector } from "react-redux";
import { postFetchLoginAuthentification } from "../../store/actions/authentification-actions";
import { authentificationActions } from "../../store/slices/authentification-slice";

//Le composant
const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordControleInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [passwordPlain, setPassworPlain] = useState(false);
  const [error, setError] = useState(null);
  const errorFetch = useSelector((state) => state.authentification.errorFetch);
  const accountCreate = useSelector(
    (state) => state.authentification.accountCreate
  );

  const dispatch = useDispatch();

  //SPINNER - LOADER - ETAT
  const isLoading = useSelector((state) => state.authentification.isLoading);

  const toggleAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    dispatch(authentificationActions.accountCreate(false));
  };

  const errorHandler = () => {
    setError(null);
    dispatch(authentificationActions.resetErrorFetch());
  };

  //Lire dans le local storage s'il y a un token lorsque la personne
  //actualise l'applicaiton pour ne pas perdre l'interface de
  //l'utilisateur connecté
  useEffect(() => {
    dispatch(authentificationActions.localStorageAuth());
  }, [dispatch]);

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

    // Contrôle input pas vide
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

    // controle validité email
    const regExEmail = (value) => {
      return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    };

    if (!regExEmail(enteredEmail)) {
      setError({
        title: "Email invalide",
        message: "Entrer un format de mail valide",
      });

      return;
    }

    // Contrôle que le password soit le même dans les deux inputs password
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

    //Affichage du SPINNER
    dispatch(authentificationActions.isLoading(true));

    //Envoie de la requête login et création de compte
    dispatch(postFetchLoginAuthentification(isLogin, credential));
  };

  //Gérer les modales d'erreurs
  useEffect(() => {
    //Echec de connexion / AUTHENTIFICATION ECHEC
    if (isLogin && errorFetch) {
      setError({
        title: "Echec Authentification",
        message: errorFetch.error,
      });
    }

    //Gérer l'erreur de la création de compte avec
    //un email déja utilisé OU un mot de passe trop faible
    if (!isLogin && errorFetch) {
      setError({
        title: "Il y a un problème",
        message: errorFetch.error.code || errorFetch.error,
      });
    }

    //Quand il n'y a pas d'erreur à la création de compte
    //Basculer sur l'interface de connexion
    if (!isLogin && !errorFetch && accountCreate) {
      setIsLogin(true);
    }
  }, [errorFetch, isLogin, accountCreate]);

  //Pour gérer l'affichage en clair du password
  const passwordPlainHandler = () => {
    setPassworPlain((prevState) => !prevState);
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
