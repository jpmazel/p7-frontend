import classes from "./FicheUserDisplay.module.css";
import Button from "../UI/Button";
import { useEffect, useRef, useState } from "react";

import emptyPortrait from "../../assets/images/empty-portrait.jpg";
import ConfirmationModal from "../UI/ConfirmationModal";

import ErrorModal from "../UI/ErrorModal";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteAccount,
  getFicheUser,
  getIdFicheUser,
  postFicheUser,
  putFicheUser,
} from "../../store/actions/ficheUser-actions";
import { useNavigate } from "react-router-dom";
import { authentificationActions } from "../../store/slices/authentification-slice";
import { ficheUserActions } from "../../store/slices/ficheUser-slice";

const FicheUserDisplay = () => {
  const dispatch = useDispatch();
  const [confirmationModal, setConfirmationModal] = useState(null);

  const [imgPrevisualization, setImgPrevisualization] = useState(null);

  const [newPhotoState, setNewPhotoState] = useState({});

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

  const authentification = useSelector(
    (state) => state.authentification.dataResponse
  );
  const modification = useSelector((state) => state.ficheUser.modification);

  //Pour fermer la modale de confirmation de suppression de compte
  const deleteFicheUserStore = useSelector(
    (state) => state.ficheUser.confirmationModal
  );

  const data = useSelector((state) => state.ficheUser.ficheUserData);
  const [dataUpdate, setDataUpdate] = useState(data);
  const [dataUpdateFormData, setDataUpdateFormData] = useState({});
  const presenceIdFiche = useSelector(
    (state) => state.ficheUser.presenceIdFiche.idFiche
  );

  //Pour mettre à jour setDataUpdate qui sert à afficher les données dans la fiche
  //A CONTROLER A LA FIN pour son utilité
  // useEffect(() => {
  //   setDataUpdate(data);
  // }, [data]);

  //Pour fermer la modale qui sert à confirmer la suppression du compte utilisateur
  useEffect(() => {
    setConfirmationModal(false);
  }, [deleteFicheUserStore]);

  //pour modifier les données qu'il y a sur la page
  const modificationHandler = () => {
    dispatch(ficheUserActions.isModification(true));

    //Pour récupérer l'id de fiche quand l'utilisateur veut modifier sa fiche
    //alors qu'il vient jsute de la créé , il n'y a pas d'id de fiche dans le store redux
    dispatch(getIdFicheUser(authentification.userId, authentification.token));
  };

  //---------------------------------profilPhotoHandler--------------------------
  //Pour changer de photo de profil
  //la gestion de la nouvelle photo
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

  //-------------------------changeHandler-----------------------------------------
  //pour surveiller les modifications qui sont faites dans les champs
  const changeHandler = (event) => {
    const enteredNom = nomInputRef.current.value.toUpperCase();
    const enteredPrenomBrut = prenomInputRef.current.value;
    const enteredPrenom =
      enteredPrenomBrut.charAt(0).toUpperCase() +
      enteredPrenomBrut.slice(1).toLowerCase();
    const enteredAge = ageInputRef.current.value;
    const enteredJob = jobInputRef.current.value;
    const enteredBio = bioInputRef.current.value;

    //mettre à jour le state
    setDataUpdate((prevState) => ({
      ...prevState.dataUpdate,
      nom: enteredNom,
      prenom: enteredPrenom,
      age: enteredAge,
      job: enteredJob,
      bio: enteredBio,
    }));

    //création de l'objet avec les propriétés à envoyer dans formData
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

  const deleteAccountHandler = () => {
    dispatch(deleteAccount(authentification.userId, authentification.token));
    dispatch(authentificationActions.logout());
  };

  //---------------------------------sendHandler-----------------------------------
  //Lorsque je clique sur le bouton envoyer du formulaire
  const sendHandler = () => {
    //Pour savoir si un un objet TRUE  et si pas vide FALSE
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
    
    //la donnée pour la requête du serveur    
    dispatch(
      postFicheUser(
        authentification.userId,
        authentification.token,
        newPhotoState,
        dataUpdateFormData
      )
    );

    //Lorsque la fiche utilisateur a été créé , je reste sur la fiche utilisateur
    //Je ne vais pas sur la page Accueil
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

  //confirmation modal pour suppression du compte---------------------------------
  const confirmationModalHandler = () => {
    setConfirmationModal({
      title: "Confirmation de la suppression du compte",
      message:
        "La suppression du compte et des données sont des actions irréverssibles",
    });
  };
  //--------------------------------------------------------------------------------
  //Condition pour changer la classe de l'input si l'input n'est pas valide
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

  //--------------------------pour gérer le onBlur des inputs---------
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

  //-------------------------------------------------------------------------
  // Envoyer la fiche qui a été modifié
  const sendPutHandler = () => {
    // Controle si les champs du formulaire ont été modifié
    const dataUpdateFormDataEmpty =
      Object.keys(dataUpdateFormData).length === 0;

    //contrôle si la photo a été modifié
    const newPhotoStateEmpty =
      Object.keys(newPhotoState).length === 0 &&
      newPhotoState.constructor === Object;

    //L'utilisateur n'a modifié aucun input de la fiche
    const emptyObjectControl = dataUpdateFormDataEmpty && newPhotoStateEmpty;
    
    if (emptyObjectControl) {
      dispatch(ficheUserActions.isModification(false));
    } else {
      // console.log("requêterequete putFicheUser la variable n'est pas vide vous avez modifié le formulaire")
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
            dataUpdateFormDataEmpty ? data : dataUpdateFormData
          )
        )
      ).then(() =>
        dispatch(getFicheUser(authentification.userId, authentification.token))
      ).catch((error) => console.log(error))
    }
  };

  //Pour afficher le bouton ENVOYER pour la requete POST à la création de la fiche
  //ou pour afficher le bouton ENVOYER pour la requete PUT à la modification de la fiche
  const conditionButtonSend = data.length === 0;

  return (
    <section className={classes.user}>
      <h1>
        Bonjour <span>{dataUpdate.prenom}</span>
      </h1>
      <p>Vous êtes sur votre fiche utilisateur</p>

      {/* Affiche les données de l'utilisiateur */}

      {!modification && (
        <>
          {imgPrevisualization ? (
            <img src={imgPrevisualization} alt="prévisualisation" />
          ) : (
            <img
              src={data.photoProfilUrl ? data.photoProfilUrl : emptyPortrait}
              alt="photo_fiche"
            />
          )}

          <p>Votre nom: </p>
          <p>{dataUpdate.nom}</p>

          <p>Votre prénom: </p>
          <p>{dataUpdate.prenom}</p>

          <p>Votre age: </p>
          <p>{dataUpdate.age} ans</p>

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

            {/* Input pour entrer la profession */}
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

      {/* J'apprends les technologies pour être développeur full stack JavaScript mais c'est vachement dur , car pour s'autoformer il faut trouver du contenu de qualité et accessible à un débutant  ce qui est très difficile</p> */}

      <div>
        {/* BOUTON MODIFIER LA FICHE */}
        {!modification && (
          <Button onClick={modificationHandler}>Modifier la fiche</Button>
        )}

        {modification && displayButtonSend && !conditionButtonSend && (
          <Button onClick={sendPutHandler}>Envoyer PUT</Button>
        )}

        {/* BOUTON ENVOYER LA FICHE MAIS A LA CREATION DE LA FICHE */}
        {modification && displayButtonSend && conditionButtonSend && (
          <Button onClick={sendHandler}>Envoyer</Button>
        )}
        {modification && !displayButtonSend && (
          <Button style={{ background: "grey" }}>Envoyer</Button>
        )}

        {/* MODALE de confirmation POUR LA SUPPRESSION DU COMPTE */}
        {confirmationModal && (
          <ConfirmationModal
            title={confirmationModal.title}
            message={confirmationModal.message}
            onConfirm={() => setConfirmationModal(null)}
            onConfirmDelete={() => deleteAccountHandler()}
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
