import { ficheUserActions } from "../slices/ficheUser-slice";

//ACTION ASYNCHRONE (REDUX THUNK intégré dans REDUX TOOLKIT)

//Requête GET, pour contrôler si la fiche utilisateur existe sur la base de données
//Pour aller chercher la fiche de l'utilisateur
export const getFicheUser = (userId, token) => {
  return async (dispatch) => {
    //La requête GET
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

      //convertir la donnée au bon format
      const transformerdData = () => {
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

      dispatch(ficheUserActions.getFicheUser(transformerdData()));
    } catch (error) {
      console("error get");
      console.log(error);
    }
  };
};

//Requête POST pour envoyer la fiche utilisateur sur la base de données
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
      dispatch(ficheUserActions.postFicherUser({ dataUpdateFormData }));
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteAccount = (userId, token) => {
  return async (dispatch) => {
    //La requête pour supprimer le compte et toutes les données de l'utilisateur
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
        throw new Error("Problème pour récupérer la donnée sur le serveur");
      }

      return dataResponse;
    };

    try {
      await fetchDeleteData();
      dispatch(ficheUserActions.deleteAccount());
    } catch (error) {
      console.log(error);
    }
  };
};

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
      dispatch(ficheUserActions.putFicheUser({ dataUpdateFormData }));
    } catch (error) {
      console.log(error);
    }
  };
};

//Récupérer l'idFiche pour le store redux si l'utilisateur veut modifier la fiche juste après ça création
//ou pour supprimer son compte juste après ça création
export const getIdFicheUser = (userId, token) => {
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

      //Convertir la donnée au bon format
      const transformerdData = () => {
        if (ficheUserData && ficheUserData.results.length > 0) {
          return {
            idFiche: ficheUserData.results[0].id_fiche_user,
          };
        } else {
          return ficheUserData.results;
        }
      };

      dispatch(ficheUserActions.getIdFiche(transformerdData()));
    } catch (error) {
      console.log(error);
    }
  };
};
