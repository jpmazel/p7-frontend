import { useContext, useEffect, useReducer, useRef } from "react";
import Button from "../UI/Button";
import classes from "./authForm.module.css";
import ErrorModal from "../UI/ErrorModal";
import Wrapper from "../Helpers/Wrapper";
import Loader from "../UI/Loader";
import AuthContext from "../../store/authContext";
import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";

//fonction reducer pour le hook useReducer
const authenticationReducer = (state, action) => {
  switch (action.type) {
    case "ERROR_SAME_PASSWORD":
      return {
        ...state,
        errorSamePassword: action.payload,
      };

    case "TOGGLE_ISLOGIN":
      return {
        ...state,
        isLogin: !state.isLogin,
      };

    case "ERROR_MESSAGE":
      return {
        ...state,
        error: action.payload,
      };

    case "DISPLAY_PASSWORD":
      return {
        ...state,
        passwordPlain: !state.passwordPlain,
      };

    default:
      return {
        errorSamePassword: false,
        isLogin: true,
        error: null,
        passwordPlain: false,
      };
  }
};

//Le composant
const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordControleInputRef = useRef();

  const navigate = useNavigate();

  //le state initial
  const initialState = {
    errorSamePassword: false,
    isLogin: true,
    error: null,
    passwordPlain: false,
  };

  const [authentication, authenticationDispatch] = useReducer(
    authenticationReducer,
    initialState
  );

  const { errorSamePassword, isLogin, passwordPlain, error } = authentication;

  const authCtx = useContext(AuthContext);

  const {
    sendRequest: fetchHandler,
    error: errorHookHttp,
    isLoading,
  } = useHttp();

  let enteredPasswordControl;

  const toggleAuthModeHandler = () => {
    authenticationDispatch({
      type: "TOGGLE_ISLOGIN",
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

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
      authenticationDispatch({
        type: "ERROR_MESSAGE",
        payload: {
          title: "Un ou plusieurs champs sont vides",
          message: "Entrer votre email et ou votre mot de passe",
        },
      });
      return;
    }

    //controle validité email
    const regExEmail = (value) => {
      return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    };

    if (!regExEmail(enteredEmail)) {
      authenticationDispatch({
        type: "ERROR_MESSAGE",
        payload: {
          title: "Email invalide",
          message: "Entrer un format de mail valide",
        },
      });
      return;
    }

    //Contrôle que le password soit le même dans les deux inputs password
    const samePassword = enteredPassword === enteredPasswordControl;

    if (!samePassword) {
      authenticationDispatch({
        type: "ERROR_MESSAGE",
        payload: {
          title: "Le mot de passe est différent",
          message: "Entrer un mot de passe identique dans les deux champs",
        },
      });

      // setErrorSamePassword(true)
      authenticationDispatch({
        type: "ERROR_SAME_PASSWORD",
        payload: true,
      });
      return;
    }

    //CUSTOM HOOK HTTP---------------------------------------------
    const requestConfig = {
      url: `${process.env.REACT_APP_API_URL}/api/authentification/${
        isLogin ? "login" : "signup"
      }`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email: enteredEmail,
        password: enteredPassword,
      },
    };

    !errorSamePassword &&
      fetchHandler(requestConfig, (dataResponse) => {
        authCtx.login(
          dataResponse.token,
          dataResponse.userId,
          dataResponse.admin
        );

        navigate("/fiche_utilisateur");
      });
  };

  //Gérer les modales d'erreurs------------------------------------------
  useEffect(() => {
    //AUTHENTIFICATION ECHEC
    if (isLogin && errorHookHttp) {
      authenticationDispatch({
        type: "ERROR_MESSAGE",
        payload: {
          title: "Authentification Echec",
          message: errorHookHttp && errorHookHttp.error,
        },
      });
      return;
    }

    //gérer l'erreur de la CREATION DE COMPTE avec un EMAIL
    //DEJA PRIS et l'afficher dans la modal ErrorModal
    //OU mot de passe TROP FAIBLE
    if (!isLogin && errorHookHttp) {
      console.log(errorHookHttp);
      authenticationDispatch({
        type: "ERROR_MESSAGE",
        payload: {
          title: "Il y a un problème",
          message: errorHookHttp.error.code || errorHookHttp.error,
        },
      });
    }
  }, [errorHookHttp, isLogin]);

  //pour reset le state error-------------------------------------------
  const errorHandler = () => {
    authenticationDispatch({
      type: "ERROR_MESSAGE",
      payload: null,
    });
    // setErrorSamePassword(false);
    authenticationDispatch({
      type: "ERROR_SAME_PASSWORD",
      payload: false,
    });
  };

  //Pour gérer l'affichage en clair du password
  const passwordPlainHandler = () => {
    authenticationDispatch({
      type: "DISPLAY_PASSWORD",
    });
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
