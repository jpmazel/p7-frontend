//ACTION ASYNCHRONE (REDUX THUNK intégré dans REDUX TOOLKIT)

import { authentificationActions } from "../slices/authentification-slice";

export const postFetchLoginAuthentification = (isLogin, credential) => {
  return async (dispatch) => {
    //la requête post
    const fetchPostData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/authentification/${
          isLogin ? "login" : "signup"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credential),
        }        
      );

      const dataResponse = await response.json();


      if(!response.ok){
        dispatch(authentificationActions.errorFetch(dataResponse));
        throw new Error("Problème pour envoyer la donnée vers le serveur")
      }

      return dataResponse;
    };

    try{
      const data = await fetchPostData();      
      dispatch(authentificationActions.postLogin(data.results))

    }catch(error){
      console.log("--->dans le catch error fetchPostData")
      console.log(error)
    }

  };
};
