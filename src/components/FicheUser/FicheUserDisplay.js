import classes from "./FicheUserDisplay.module.css";
import Button from "../UI/Button";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../store/authContext";
import emptyPortrait from "../../assets/images/empty-portrait.jpg";
import ConfirmationModal from "../UI/ConfirmationModal";
import useHttp from "../../hooks/use-http";
import ErrorModal from "../UI/ErrorModal";

const FicheUserDisplay = ({ data, onRefresh, onNewFiche }) => {
  const [dataUpdate, setDataUpdate] = useState(data);
  const [modification, setModification] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const authCtx = useContext(AuthContext);
  const [imgPrevisualization, setImgPrevisualization] = useState(null);
  const { sendRequest: fetchUploadHandler } = useHttp();
  const { sendRequest: fetchDeleteAccountHandler } = useHttp();
  const [formData, setFormData] = useState({});
  const [validationSend, setValidationSend] = useState(false);

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
  const [sendRequestValidation, setSendRequestValidation] = useState(false);

  const [error, setError] = useState(null);

  const nomInputRef = useRef();
  const prenomInputRef = useRef();
  const ageInputRef = useRef();
  const jobInputRef = useRef();
  const bioInputRef = useRef();

  //pour mettre à jour le state dataUpdate
  useEffect(() => {
    setDataUpdate(data);

    if (data.newFiche === "1") {
      setModification(true);
    }
  }, [data]);

  //pour modifier les données qu'il y a sur la page
  const modificationHandler = () => {
    setModification((modification) => !modification);
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
      newFiche: false,
    };

    setDataUpdateFormData(dataUpdateFormData);
  };

  const deleteAccountHandler = () => {
    const requestConfig = {
      url: `${process.env.REACT_APP_API_URL}/api/authentification/delete/?userId=${data.userId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authCtx.token}`,
      },
    };
    fetchDeleteAccountHandler(requestConfig, () => authCtx.logout());
  };

  //---------------------------------sendHandler-----------------------------------
  //Lorsque je clique sur le bouton envoyer du formulaire
  const sendHandler = () => {
    //envoyer les nouvelles données vers le serveur
    const formData = new FormData();
    formData.append("image", newPhotoState);
    formData.append("ficheUser", JSON.stringify(dataUpdateFormData));

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

    //Controle qu'il y a de la donnée dans le formulaire avant envoie
    //si l'utilisateur ne touche pas aux inputs formData sera vide
    if (dataUpdateFormDataIsEmpty) {
      setError({
        title: "ATTENTION",
        message: "Modifier la valeur d'un champ",
      });
      return;
    }

    //la donnée pour la requête du serveur
    setFormData(formData);

    //Quand tout est bon
    setSendRequestValidation(true);
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

  //-----------------------------------Custom hook http------------
  //La requête pour envoyer les données vers le serveur------------
  useEffect(() => {
    //requête vers le serveur
    const requestConfig = {
      url: `${process.env.REACT_APP_API_URL}/api/fiche_user/${data.idFiche}?userId=${data.userId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authCtx.token}`,
      },
      body: formData,
    };

    sendRequestValidation &&
      enterNameIsValid &&
      enterFirstNameIsValid &&
      enterJobIsValid &&
      enterBioIsValid &&
      fetchUploadHandler(requestConfig, (dataResponse) => {
        console.log(dataResponse);
        setValidationSend(true);
        setModification(false);
        setEnterNameIsValid(true);
        setSendRequestValidation(false);
        onNewFiche("Le formualire est valide et il est parti sur le serveur");
      });
  }, [
    authCtx.token,
    data.idFiche,
    data.userId,
    fetchUploadHandler,
    formData,
    sendRequestValidation,
    enterNameIsValid,
    enterFirstNameIsValid,
    enterJobIsValid,
    enterBioIsValid,
    onNewFiche,
  ]);

  //pour faire automatiquement la requête GET de ficheUser
  //c'est pour afficher les données du serveurs
  useEffect(() => {
    if (validationSend && !modification) {
      onRefresh();
      // setValidationSend(false);
    }
  }, [validationSend, onRefresh, modification]);

  return (
    <section className={classes.user}>
      <h1>
        Bonjour <span>{dataUpdate.prenom}</span>
      </h1>
      <p>Vous êtes sur votre fiche utilisateur</p>

      {/* Affiche les données de l'utilisiateur */}

      {!modification && (
        <>
          <img
            src={data.photoProfilUrl ? data.photoProfilUrl : emptyPortrait}
            alt="photo_fiche"
          />
          <p>Votre nom: </p>
          <p>{dataUpdate.nom}</p>

          <p>Votre prénom: </p>
          <p> {dataUpdate.prenom}</p>

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
                value={dataUpdate.nom}
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
                value={dataUpdate.prenom}
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
                value={dataUpdate.age}
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
                value={dataUpdate.job}
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
                value={dataUpdate.bio}
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
        {!modification && (
          <Button onClick={modificationHandler}>Modifier la fiche</Button>
        )}

        {modification && displayButtonSend && (
          <Button onClick={sendHandler}>Envoyer</Button>
        )}
        {modification && !displayButtonSend && (
          <Button style={{ background: "grey" }}>Envoyer</Button>
        )}

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
