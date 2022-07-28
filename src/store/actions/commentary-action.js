import { commentaryActions } from "../slices/commentary-slice";

//Pour aller chercher les données sur le serveur
export const getFetchCommentary = (idPostsUser, userIdToken, token) => {
  return async (dispatch) => {
    //la requête GET
    const fetchGetData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts/comments/${idPostsUser}?userId=${userIdToken}`,
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
      const commentaryData = await fetchGetData();
      dispatch(commentaryActions.getComments(commentaryData));
    } catch (error) {
      console.log(error);
    }
  };
};

//Pour envoyer le nouveau commentaire vers le serveur
export const postFetchCommentary = (userId, token, data) => {
  return async (dispatch) => {
    //la requête POST
    const fetchPostData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts/comments?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
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
      dispatch(commentaryActions.postCommentary());
    } catch (error) {
      console.log(error);
    }
  };
};

//Pour supprimer un commentaire de la base de données
export const deleteFetchCommentary = (idCommentUser, userIdToken, token) => {
  return async (dispatch) => {
    //la requête DELETE
    const fetchDeleteData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts/comment/${idCommentUser}?userId=${userIdToken}`,
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
      dispatch(commentaryActions.deleteCommentary(idCommentUser));
    } catch (error) {
      console.log(error);
    }
  };
};

//Pour modifier un commentaire sous un post
export const putFetchCommentary = (
  idComment,
  userIdToken,
  token,
  messageTextarea
) => {
  return async (dispatch) => {
    //la requête PUT
    const fetchPUTData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts/comment/${idComment}?userId=${userIdToken}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(messageTextarea),
        }
      );

      const dataResponse = await response.json();

      if (!response.ok) {
        throw new Error("Problème pour modifier le commentaire sur le serveur");
      }
      return dataResponse;
    };

    try {
      await fetchPUTData();
      dispatch(
        commentaryActions.putCommentary({
          messageTextarea,
          idComment,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};
