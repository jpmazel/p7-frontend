//ACTION ASYNCHRONE (REDUX THUNK intégré dans Redux Toolkit)

import { ficheUserActions } from "../slices/ficheUser-slice";

//Requête GET pour aller chercher la fiche utilisateur
//Pour contrôler si la fiche utilisateur existe sur la base de donnée
export const getFicheUser = (userId, token) => {
  return async (dispatch) => {
    //la requête GET
    const fetchGetData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/fiche_user/fiche/?userId=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dataResponse = await response.json();

      if (!response.ok) {
        throw new Error("Problème pour récupérer la donnée sur le serveur");
      }

      return dataResponse;
    };

    try {
      const ficheUserData = await fetchGetData();

      const transformedData = () => {
        if (ficheUserData && ficheUserData.results.length > 0) {
          return {
            job: ficheUserData.results[0].fiche_user_job,
            bio: ficheUserData.results[0].fiche_user_bio,
            age: ficheUserData.results[0].fiche_user_age,
            nom: ficheUserData.results[0].fiche_user_nom,
            photoProfilUrl: ficheUserData.results[0].fiche_user_photoProfilUrl,
            prenom: ficheUserData.results[0].fiche_user_prenom,
            userId: ficheUserData.results[0].fiche_user_userId,
            idFiche: ficheUserData.results[0].id_fiche_user,
            newFiche: ficheUserData.results[0].fiche_user_new_fiche,
          };
        } else {
          return ficheUserData.results;
        }
      };

      dispatch(ficheUserActions.getFicheUser(transformedData()));
    } catch (error) {
      console.log("error get");
      console.log(error);
    }
  };
};

//Requête POST pour envoyer la fiche utilisateur sur la base de données
//Création de la fiche sur la table fiche_user
export const postFicheUser = (
  userId,
  token,
  newPhotoState,
  dataUpdateFormData
) => {
  const formData = new FormData();
  formData.append("image", newPhotoState);
  formData.append("ficheUser", JSON.stringify(dataUpdateFormData));

  return async (dispatch) => {
    //La données a envoyer au serveur

    //la requête POST
    const fetchPostData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/fiche_user/?userId=${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const dataResponse = await response.json();

      if (!response.ok) {
        throw new Error("Problème pour envoyer la donnée sur le serveur");
      }

      return dataResponse;
    };

    try {
      await fetchPostData();     
      dispatch(ficheUserActions.postFicheUser(dataUpdateFormData));
    } catch (error) {
      console.log("error postFicheUser");
      console.log(error);
    }
  };
};

//Pour éffacer le compte de l'utilisateur et toutes ces données
export const deleteAccount = (userId, token) => {
  return async (dispatch) => {
    //La requête pour effacer toutes les données de l'user

    const fetchDeleteData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/authentification/delete/?userId=${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataResponse = await response.json();

      if (!response.ok) {
        throw new Error("Problème pour envoyer la donnée sur le serveur");
      }
      return dataResponse;
    };

    try {
      await fetchDeleteData();
      dispatch(ficheUserActions.deleteAccount());
    } catch (error) {
      console.log(" deleteAccount error");
      console.log(error);
    }
  };
};

//Pour modifier la les données de la fiche utilisateur
export const putFicheUser = (
  userId,
  token,
  idFiche,
  newPhotoState,
  dataUpdateFormData
) => {
  const formData = new FormData();
  formData.append("image", newPhotoState);
  formData.append("ficheUser", JSON.stringify(dataUpdateFormData));

  return async (dispatch) => {
    //La requête PUT
    const fetchPutData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/fiche_user/${idFiche}?userId=${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const dataResponse = await response.json();

      if (!response.ok) {
        throw new Error("Problème pour envoyer la donnée sur le serveur");
      }

      return dataResponse;
    };

    try {
      await fetchPutData();
      dispatch(ficheUserActions.putFicheUser(dataUpdateFormData));
    } catch (error) {
      console.log("putFicheUser error");
      console.log(error);
    }
  };
};

export const getIdFicheUser = (userId, token) => {
  return async (dispatch) => {
    // La requête GET
    const fetchGetData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/fiche_user/fiche/?userId=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dataResponse = await response.json();

      if (!response.ok) {
        throw new Error("Problème pour récupérer la donnée sur le serveur");
      }

      return dataResponse;
    };

    try {
      const ficheUserData = await fetchGetData();

      const transformedData = () => {
        if (ficheUserData && ficheUserData.results.length > 0) {
          return {
            idFiche: ficheUserData.results[0].id_fiche_user,
          };
        } else {
          return ficheUserData.results;
        }
      };

      dispatch(ficheUserActions.getIdFiche(transformedData()));
    } catch (error) {
      console.log("error get");
      console.log(error);
    }
  };
};
