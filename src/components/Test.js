import { useContext } from "react";
import AuthContext from "../store/authContext";
import classes from "./Test.module.css";
import Button from "./UI/Button";

const Test = () => {
  const authCtx = useContext(AuthContext);
  console.log(authCtx);

  const isLoggedIn = authCtx.isLoggedIn;

  //requête pour accéder à des ressources protéger qui nécessite un token et un userId
  const url = `http://localhost:3000/api/fiche_user/fiche/?userId=${authCtx.userId}`;
  
  const fecthHandler = async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        // body: JSON.stringify({
        //   userId: authCtx.userId,
        // }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCtx.token}`,
        },
      });
      
      const dataResponse = await response.json();

      if(response.ok){
        console.log(dataResponse)
      }else{
        throw new Error(dataResponse.error);
      }
      
    } catch (error) {
      console.log("Problème serveur la requête n'est pas parti");
      console.log(error);
    }
  };

  if(isLoggedIn){
    fecthHandler();
  }

  return (
    <>
      {isLoggedIn && <p>Ceci est un composant de test</p>}
      {!isLoggedIn && <p>Vous n'etes pas connecté</p>}
      {isLoggedIn && <p>Bienvenue, vous êtes connecté</p>}
      {isLoggedIn && <p>Votre token :{authCtx.token}</p>}
      {isLoggedIn && <p>Votre userID: {authCtx.userId} </p>}
      {isLoggedIn && <p onClick={authCtx.logout}>Se déconnecter</p>}
      {isLoggedIn && <Button onClick={authCtx.logout}>Se déconnecter</Button>}
    </>
  );
};

export default Test;
