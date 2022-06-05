import { useContext, useRef, useState } from "react";
import Button from "../UI/Button";
import classes from "./authForm.module.css";
import ErrorModal from "../UI/ErrorModal";
import Wrapper from "../Helpers/Wrapper";
import Loader from "../UI/Loader";
import AuthContext from "../../store/authContext";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordControleInputRef = useRef();

  const navigate = useNavigate();

  //utilisation du context
  const authCtx = useContext(AuthContext);

  
  const [isLogin, setIsLogin] = useState(true);
  //isLoading pour mettre un spinner ou un texte qui prévient que c'est en cours de chargement
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [passwordPlain, setPasswordPlain] = useState(false);

  let enteredPasswordControl;

  const toggleAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
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
      setError({
        title: "Un ou plusieurs champs sont vides",
        message: "Entrer votre email et ou votre mot de passe",
      });
      return;
    }

    //controle validité email
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

    //Contrôle que le password soit le même dans les deux inputs password
    const samePassword = enteredPassword === enteredPasswordControl;

    if (!samePassword) {
      setError({
        title: "Le mot de passe est différent",
        message: "Entrer un mot de passe identique dans les deux champs",
      });
      return;
    }

    //pour se connecter pour récupérer le userId et le token d'authentification
    const url = `${process.env.REACT_APP_API_URL}/api/authentification/${
      isLogin ? "login" : "signup"
    }`;

    //async await function fetchHandler()
    // async function fetchHandler(){
    const fetchHandler = async () => {
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const dataResponse = await response.json();

        //le serveur a répondu, le chargement est terminé
        setIsLoading(false);

        if (response.ok) {
                   
          authCtx.login(
            dataResponse.token,
            dataResponse.userId,
            dataResponse.admin
          );

          //react router dom V6 navigation par programmation / impérative
          navigate("/fiche_utilisateur");
        } else {
          setError({
            title: "Authentification Echec",
            message: dataResponse.error,
          });

          throw new Error(dataResponse.error);
        }

        //gérer l'erreur du compte existant pour l'afficher dans la modal ErrorModal

        if (dataResponse && dataResponse.error) {
          setError({
            title: "Il y a un problème",
            message: dataResponse.error.sqlMessage,
          });
        }
      } catch (error) {
        console.log("problème serveur");
        console.log(error);
      }
    };

    //spinner ou message que la requête est en cours de chargement
    setIsLoading(true);

    fetchHandler();

    //pour vider les champs
    // emailInputRef.current.value = "";
    // passwordInputRef.current.value = "";
    // test06@test.com
    // azertAZERT75
  };

  //pour reset le state error
  const errorHandler = () => {
    setError(null);
  };

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
