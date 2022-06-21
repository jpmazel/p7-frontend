import classes from "./FicheUserDisplay.module.css";
import Button from "../UI/Button";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../store/authContext";
import emptyPortrait from "../../assets/images/empty-portrait.jpg";
import ConfirmationModal from "../UI/ConfirmationModal";
import useHttp from "../../hooks/use-http";

const FicheUserDisplay = ({ data, onRefresh }) => {
  const [dataUpdate, setDataUpdate] = useState(data);
  const [modification, setModification] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const authCtx = useContext(AuthContext);
  const [imgPrevisualization, setImgPrevisualization] = useState(null);
  const { sendRequest: fetchUploadHandler } = useHttp();
  const { sendRequest: fetchDeleteAccountHandler } = useHttp();
  const [formData, setFormData] = useState({});
  const [validationSend, setValidationSend] = useState(false);

  const nomInputRef = useRef();
  const prenomInputRef = useRef();
  const ageInputRef = useRef();
  const jobInputRef = useRef();
  const bioInputRef = useRef();

  //pour mettre à jour le state dataUpdate
  useEffect(() => {
    setDataUpdate(data);
  }, [data]);

  //pour modifier les données qu'il y a sur la page
  const modificationHandler = () => {
    setModification((modification) => !modification);
  };

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

    //la gestion de la nouvelle photo
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

    //mettre à jour le state
    setDataUpdate((prevState) => ({
      ...prevState.dataUpdate,
      nom: enteredNom,
      prenom: enteredPrenom,
      age: enteredAge,
      job: enteredJob,
      bio: enteredBio,
      // newPhoto: newPhoto,
    }));

    //création de l'objet avec les propriétés à envoyer dans formData
    const dataUpdateFormData = {
      nom: enteredNom,
      prenom: enteredPrenom,
      age: enteredAge,
      job: enteredJob,
      bio: enteredBio,
    };

    //envoyer les nouvelles données vers le serveur

    const formData = new FormData();
    formData.append("image", newPhoto);
    formData.append("ficheUser", JSON.stringify(dataUpdateFormData));

    setFormData(formData);
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

  //Lorsque je clique sur le bouton envoyer du formulaire
  const sendHandler = () => {
    //requête vers le serveur
    const requestConfig = {
      url: `${process.env.REACT_APP_API_URL}/api/fiche_user/${data.idFiche}?userId=${data.userId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authCtx.token}`,
      },
      body: formData,
    };

    fetchUploadHandler(requestConfig, (dataResponse) => {
      setValidationSend(true);
    });

    setModification(false);
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

  //pour faire automatiquement la requête GET de ficheUser
  //c'est pour afficher les données du serveurs
  useEffect(() => {
    if (validationSend) {
      onRefresh();
    }
  }, [validationSend, onRefresh]);

  return (
    <section className={classes.user}>
      <h1>
        Bonjour <span>{dataUpdate.prenom}</span>
      </h1>
      <p>Vous êtes sur votre fiche utilisateur</p>

      {/* PHOTO PROFIL */}
      <p>
        {!imgPrevisualization ? (
          <img
            src={data.photoProfilUrl ? data.photoProfilUrl : emptyPortrait}
            alt="photo_fiche"
          />
        ) : (
          <img src={imgPrevisualization} alt="prévisualisation" />
        )}
      </p>

      {modification && (
        <input type="file" accept=".jpeg,.jpg,.png" onChange={changeHandler} />
      )}

      <p>Votre nom: </p>
      {!modification && <p>{dataUpdate.nom}</p>}
      {modification && (
        <input
          type="text"
          value={dataUpdate.nom}
          onChange={changeHandler}
          ref={nomInputRef}
        />
      )}

      <p>Votre prénom: </p>
      {!modification && <p> {dataUpdate.prenom}</p>}
      {modification && (
        <input
          type="text"
          value={dataUpdate.prenom}
          onChange={changeHandler}
          ref={prenomInputRef}
        />
      )}

      <p>Votre age: </p>
      {!modification && <p>{dataUpdate.age} ans</p>}
      {modification && (
        <input
          type="number"
          value={dataUpdate.age}
          onChange={changeHandler}
          ref={ageInputRef}
        />
      )}

      <p>Profession</p>
      {!modification && <p>{dataUpdate.job}</p>}
      {modification && (
        <input
          type="text"
          value={dataUpdate.job}
          onChange={changeHandler}
          ref={jobInputRef}
        />
      )}
      {/* <p>Technicien de maintenance CVC / génie climatique</p> */}

      <p>Mieux me connaître</p>
      {!modification && <p>{dataUpdate.bio}</p>}
      {modification && (
        <textarea
          type="text"
          value={dataUpdate.bio}
          onChange={changeHandler}
          ref={bioInputRef}
        />
      )}

      {/* J'apprends les technologies pour être développeur full stack JavaScript mais c'est vachement dur , car pour s'autoformer il faut trouver du contenu de qualité et accessible à un débutant  ce qui est très difficile</p> */}

      <div>
        {!modification && (
          <Button onClick={modificationHandler}>Modifier la fiche</Button>
        )}

        {modification && <Button onClick={sendHandler}>Envoyer</Button>}

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
