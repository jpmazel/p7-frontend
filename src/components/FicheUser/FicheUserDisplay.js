import classes from "./FicheUserDisplay.module.css";
import Button from "../UI/Button";
import { useEffect, useRef, useState } from "react";
import emptyPortrait from "../../assets/images/empty-portrait.jpg";
import ConfirmationModal from "../UI/ConfirmationModal";
import ErrorModal from "../UI/ErrorModal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ficheUserActions } from "../../store/slices/ficheUser-slice";
import { authentificationActions } from "../../store/slices/authentification-slice";
import {
  postFicheUser,
  deleteAccount,
  putFicheUser,
  getIdFicheUser,
  getFicheUser,
} from "../../store/actions/ficheUser-action";

const FicheUserDisplay = () => {
  const [confirmationModal, setConfirmationModal] = useState(null);

  const [imgPrevisualization, setImgPrevisualization] = useState(null);

  const [newPhotoState, setNewPhotoState] = useState({});
  const [dataUpdateFormData, setDataUpdateFormData] = useState({});

  const [enterNameIsValid, setEnterNameIsValid] = useState(false);
  const [enterFirstNameIsValid, setEnterFirstNameIsValid] = useState(false);
  const [enterJobIsValid, setEnterJobIsValid] = useState(false);
  const [enterBioIsValid, setEnterBioIsValid] = useState(false);

  const [untouchedName, setUntouchedName] = useState(true);
  const [untouchedFirstName, setUntouchedFirstName] = useState(true);
  const [untouchedJob, setUntouchedJob] = useState(true);
  const [untouchedBio, setUntouchedBio] = useState(true);

  const [displayButtonSend, setDisplayButtonSend] = useState(false);

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const nomInputRef = useRef();
  const prenomInputRef = useRef();
  const ageInputRef = useRef();
  const jobInputRef = useRef();
  const bioInputRef = useRef();

  //Pour des champs NON contrôlés il faut utiliser "defaultValue" dans l'input et pas value
  //car si non ça devient un champ contrôlé
  const dispatch = useDispatch();

  const data = useSelector((state) => state.ficheUser.ficheUserData);
  const modification = useSelector((state) => state.ficheUser.modification);

  const deleteFicheUserStore = useSelector(
    (state) => state.ficheUser.confirmationModal
  );

  const presenceIdFiche = useSelector(
    (state) => state.ficheUser.presenceIdFiche.idFiche
  );
  const authentification = useSelector(
    (state) => state.authentification.dataResponse
  );

  const [dataUpdate, setDataUpdate] = useState(data);

  //-----Fermer la modale après la suppression compte--------------------------
  useEffect(() => {
    setConfirmationModal(false);
  }, [deleteFicheUserStore]);

  //pour modifier les données qu'il y a sur la fiche utilisateur---------------
  const modificationHandler = () => {
    dispatch(ficheUserActions.isModification());
    dispatch(getIdFicheUser(authentification.userId, authentification.token));
  };

  //---------------------------------profilPhotoHandler------------------------
  //Pour changer de photo de profil
  //La gestion de la nouvelle photo
  const photoProfilHandler = (event) => {
    let newPhoto;
    if (event.target.files && event.target.files.length === 1) {
      newPhoto = event.target.files[0];

      //Afficher la prévisualisation de la nouvelle photo de profil
      const reader = new FileReader();
      reader.onload = (event) => {
        setImgPrevisualization(event.target.result);
      };
      reader.readAsDataURL(newPhoto);
    }
    setNewPhotoState(newPhoto);
  };

  //-------------------------changeHandler-------------------------------------
  //Pour surveiller les modifications qui sont faites dans les champs
  const changeHandler = (event) => {
    const enteredNom = nomInputRef.current.value.toUpperCase();
    const enteredPrenomBrut = prenomInputRef.current.value;
    const enteredPrenom =
      enteredPrenomBrut.charAt(0).toUpperCase() +
      enteredPrenomBrut.slice(1).toLowerCase();
    const enteredAge = ageInputRef.current.value;
    const enteredJob = jobInputRef.current.value;
    const enteredBio = bioInputRef.current.value;

    //Mettre à jour le state
    setDataUpdate((prevState) => ({
      ...prevState.dataUpdate,
      nom: enteredNom,
      prenom: enteredPrenom,
      age: enteredAge,
      job: enteredJob,
      bio: enteredBio,
    }));

    //Création de l'objet avec les propriétés à envoyer dans formData
    const dataUpdateFormData = {
      nom: enteredNom,
      prenom: enteredPrenom,
      age: enteredAge,
      job: enteredJob,
      bio: enteredBio,
      newFiche: true,
      userId: authentification.userId,
    };

    setDataUpdateFormData(dataUpdateFormData);
  };

  //Effacer le compte utilisateur et toutes ses données************************
  const deleteAccountHandler = () => {
    dispatch(deleteAccount(authentification.userId, authentification.token));
    dispatch(authentificationActions.logout());
  };
  //**************************************************************************/

  //---------------------------------sendHandler-------------------------------
  //Lorsque je clique sur le bouton envoyer du formulaire
  const sendHandler = () => {
    //Envoyer les nouvelles données vers le serveur
    //Pour savoir si un un objet vide ou pas , TRUE si vide ET FALSE si pas vide
    const dataUpdateFormDataIsEmpty =
      Object.keys(dataUpdateFormData).length === 0 &&
      dataUpdateFormData.constructor === Object;

    function controlInputEmpty(inputValue, setState) {
      if (!dataUpdateFormDataIsEmpty && inputValue.trim() === "") {
        setState(false);
        return;
      }
      setState(true);
    }

    controlInputEmpty(dataUpdateFormData.nom, setEnterNameIsValid);
    controlInputEmpty(dataUpdateFormData.prenom, setEnterFirstNameIsValid);
    controlInputEmpty(dataUpdateFormData.job, setEnterJobIsValid);
    controlInputEmpty(dataUpdateFormData.bio, setEnterBioIsValid);

    //Controle qu'il y a de la donnée dans le formulaire avant envoi
    //Si l'utilisateur ne touche pas aux inputs formData sera vide
    if (dataUpdateFormDataIsEmpty) {
      setError({
        title: "ATTENTION",
        message: "Modifier la valeur d'un champ",
      });
      return;
    }

    dispatch(
      postFicheUser(
        authentification.userId,
        authentification.token,
        newPhotoState,
        dataUpdateFormData
      )
    );

    navigate("fiche_utilisateur");
  };

  //Lorsque je quitte l'input controle si le champ est vide ou pas
  const blurHandler = (event) => {
    function warningBlur(setEnterValueIsValid, setUntouchedValue) {
      if (event.target.value.trim() === "") {
        setEnterValueIsValid(false);
        setUntouchedValue(false);
      } else {
        setEnterValueIsValid(true);
        setUntouchedValue(true);
      }
    }

    event.target.id === "lastName" &&
      warningBlur(setEnterNameIsValid, setUntouchedName);
    event.target.id === "firstName" &&
      warningBlur(setEnterFirstNameIsValid, setUntouchedFirstName);
    event.target.id === "job" &&
      warningBlur(setEnterJobIsValid, setUntouchedJob);
    event.target.id === "bio" &&
      warningBlur(setEnterBioIsValid, setUntouchedBio);
  };

  //Confirmation modal pour suppression du compte------------------------------
  const confirmationModalHandler = () => {
    setConfirmationModal({
      title: "Confirmation de la suppression du compte",
      message:
        "La suppression du compte et des données sont des actions irréverssibles",
    });
  };
  //---------------------------------------------------------------------------

  //Condition pour changer la classe de l'input si l'input n'est pas valide----
  function inputClasses(enterValueIsValid, untouchedValue) {
    const nameInputClasses =
      enterValueIsValid || untouchedValue
        ? classes["form-control"]
        : `${classes["form-control"]} ${classes.invalid}`;
    return nameInputClasses;
  }

  const nameInputClasses = inputClasses(enterNameIsValid, untouchedName);
  const firstnameInputClasses = inputClasses(
    enterFirstNameIsValid,
    untouchedFirstName
  );
  const jobInputClasses = inputClasses(enterJobIsValid, untouchedJob);
  const bioInputClasses = inputClasses(enterBioIsValid, untouchedBio);

  //--------------------------Pour gérer le onBlur des inputs------------------
  //3 cas à gérer (activation du bouton envoyer)
  //1-à la création du compte
  //2-modification de la fiche sans avoir actualisé manuellement la page avant de rentrer les données
  //3-modification de la fiche alors que juste avant la page a été actualisé (initialisation des states)
  const untouch =
    untouchedName && untouchedFirstName && untouchedJob && untouchedBio;
  useEffect(() => {
    if (data.nom && data.prenom && data.job && data.bio && untouch) {
      setDisplayButtonSend(true);
    } else if (
      enterNameIsValid &&
      enterFirstNameIsValid &&
      enterJobIsValid &&
      enterBioIsValid &&
      untouch
    ) {
      setDisplayButtonSend(true);
    } else {
      setDisplayButtonSend(false);
    }
  }, [
    data.bio,
    data.job,
    data.nom,
    data.prenom,
    enterBioIsValid,
    enterFirstNameIsValid,
    enterJobIsValid,
    enterNameIsValid,
    untouch,
  ]);

  //---------------------------------------------------------------------------
  //Envoyer la fiche qui a été modifié-----------------------------------------
  const sendPutHandler = () => {
    //Cntrôle si les champs du formulaire ont été modifié
    const dataUpdateFormDataEmpty =
      Object.keys(dataUpdateFormData).length === 0;    

    //Contrôle si la photo a été modifié
    const newPhotoStateEmpty =
      Object.keys(newPhotoState).length === 0 &&
      newPhotoState.constructor === Object;   

    const emptyObjectControl = dataUpdateFormDataEmpty && newPhotoStateEmpty;

    if (emptyObjectControl) {
      console.log("les variables sont vides vous n'avez rien modifié");
      dispatch(ficheUserActions.putFicheUser(data));
    } else {
      console.log(
        "requete putFicheUser la variable n'est pas vide vous avez modifié le formulaire"
      );
      // PROMISE pour faire partir la requête GET quand la PUT est bien terminé
      // Pour récupérer la nouvelle URL de la photo fourni par le backend
      // et la mettre dans le state et écraser l'ancienne URL de la photo

      //Le chainage d'action asynchrone
      //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
      //https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Using_promises#cha%C3%AEnage_des_promesses
      Promise.resolve(
        dispatch(
          putFicheUser(
            authentification.userId,
            authentification.token,
            presenceIdFiche,
            newPhotoState,
            !dataUpdateFormDataEmpty ? dataUpdateFormData : data
          )
        )
      )
        .then(() => {
          dispatch(
            getFicheUser(authentification.userId, authentification.token)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  //Pour gérer l'affichage du bouton envoyé
  const conditionButtonSend = data.length === 0;

  return (
    <section className={classes.user}>
      <h1>
        Bonjour <span>{data.prenom}</span>
      </h1>
      <p>Vous êtes sur votre fiche utilisateur</p>

      {!modification && (
        <>
          {!imgPrevisualization ? (
            <img
              src={data.photoProfilUrl ? data.photoProfilUrl : emptyPortrait}
              alt="photo_fiche"
            />
          ) : (
            <img src={imgPrevisualization} alt="prévisualisation" />
          )}

          <p>Votre nom: </p>
          <p>{data.nom}</p>

          <p>Votre prénom: </p>
          <p>{data.prenom}</p>

          <p>Votre age: </p>
          <p>{data.age} ans</p>

          <p>Profession</p>
          <p>{dataUpdate.job}</p>

          <p>Mieux me connaître</p>
          <p>{dataUpdate.bio}</p>
        </>
      )}

      {/* Modifier les données de l'utilisateur */}
      {modification && (
        <form>
          {error && (
            <ErrorModal
              title={error.title}
              message={error.message}
              onConfirm={() => setError(false)}
            />
          )}
          <div className={classes["group-control"]}>
            <p>
              {!imgPrevisualization ? (
                <img
                  src={
                    data.photoProfilUrl ? data.photoProfilUrl : emptyPortrait
                  }
                  alt="photo_fiche"
                />
              ) : (
                <img src={imgPrevisualization} alt="prévisualisation" />
              )}
            </p>

            <input
              type="file"
              accept=".jpeg,.jpg,.png"
              onChange={photoProfilHandler}
            />

            {/* INPUT pour entrer le nom */}
            {/* defaultValue pour que le composant soit uncontrolled , obligatoire avec useRef
            si non avec "value" warning dans la console */}
            <div className={nameInputClasses}>
              <label htmlFor="lastName">Votre nom: </label>
              <input
                type="text"
                defaultValue={dataUpdate.nom}
                onChange={changeHandler}
                onBlur={blurHandler}
                ref={nomInputRef}
                placeholder="Entrez votre nom"
                id="lastName"
              />
              {!enterNameIsValid && !untouchedName && (
                <p className={classes["error-text"]}>
                  ce champ ne doit pas être vide
                </p>
              )}
            </div>

            {/* INPUT pour entrer le PRENOM */}
            <div className={firstnameInputClasses}>
              <label htmlFor="firstName">Votre prénom: </label>
              <input
                type="text"
                defaultValue={dataUpdate.prenom}
                onChange={changeHandler}
                onBlur={blurHandler}
                ref={prenomInputRef}
                placeholder="Entrez votre prénom"
                id="firstName"
              />
              {!enterFirstNameIsValid && !untouchedFirstName && (
                <p className={classes["error-text"]}>
                  ce champ ne doit pas être vide
                </p>
              )}
            </div>

            {/* INPUT pour entrer l'age */}
            <div className={classes["form-control"]}>
              <label htmlFor="age">Votre age: </label>
              <input
                type="number"
                defaultValue={dataUpdate.age}
                onChange={changeHandler}
                ref={ageInputRef}
                placeholder="Entrez votre age"
                id="age"
              />
            </div>

            {/* INPUT pour entrer la profession */}
            <div className={jobInputClasses}>
              <label htmlFor="job">Profession</label>
              <input
                type="text"
                defaultValue={dataUpdate.job}
                onChange={changeHandler}
                onBlur={blurHandler}
                ref={jobInputRef}
                placeholder="Entrez votre Profession"
                id="job"
              />
              {!enterJobIsValid && !untouchedJob && (
                <p className={classes["error-text"]}>
                  ce champ ne doit pas être vide
                </p>
              )}
            </div>

            {/* INPUT pour mettre sa biographie */}
            <div className={bioInputClasses}>
              <label htmlFor="bio">Mieux me connaître</label>
              <textarea
                type="text"
                defaultValue={dataUpdate.bio}
                onChange={changeHandler}
                onBlur={blurHandler}
                ref={bioInputRef}
                placeholder="Entrez votre biographie"
                id="bio"
              />
              {!enterBioIsValid && !untouchedBio && (
                <p className={classes["error-text"]}>
                  ce champ ne doit pas être vide
                </p>
              )}
            </div>
          </div>
        </form>
      )}

      <div>
        {!modification && (
          <Button onClick={modificationHandler}>Modifier la fiche</Button>
        )}

        {/*Gérer la requête POST création de la fiche utilisateur et PUT pour modifier la fiche utilisateur  */}
        {modification && displayButtonSend && conditionButtonSend && (
          <Button onClick={sendHandler}>Envoyer</Button>
        )}

        {modification && displayButtonSend && !conditionButtonSend && (
          <Button onClick={sendPutHandler}>Envoyer PUT</Button>
        )}

        {modification && !displayButtonSend && (
          <Button style={{ background: "grey" }}>Envoyer</Button>
        )}

        {confirmationModal && (
          <ConfirmationModal
            title={confirmationModal.title}
            message={confirmationModal.message}
            onConfirm={() => setConfirmationModal(null)}
            onConfirmDelete={deleteAccountHandler}
          />
        )}
        <Button onClick={confirmationModalHandler}>
          Suppression du compte
        </Button>
      </div>
    </section>
  );
};

export default FicheUserDisplay;
