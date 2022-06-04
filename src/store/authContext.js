import { createContext, useState } from "react";

//création du context pour l'authentification
//pour stocker les données : token, userId etc
const defaultValue = {
  token: "",
  userId: null,
  admin: null,
  userIsLoggedIn: false,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext(defaultValue);

//Contrôle de la présence du token, de m'userId et de l'admin état dans le local storage
const tokenLocalStorage = localStorage.getItem("token");
const userIdLocalStorage = localStorage.getItem("userId");
const adminLocalStorage = Number(localStorage.getItem("admin"));

//le context provider pour wrapper app.js
export const AuthContextProvider = (props) => {
  //stockage du token d'authentification, de l'userId et de l'état admin
  const [token, setToken] = useState(tokenLocalStorage);
  const [userId, setUserId] = useState(userIdLocalStorage);
  const [admin, setAdmin] = useState(adminLocalStorage);

  //une fonction pour mettre à jour le token, l'userId et admin état dans le state
  const loginHandler = (token, userId, admin) => {
    setToken(token);
    setUserId(userId);
    setAdmin(admin);
    //mettre la donnée dans le local storage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("admin", admin);
  };

  //pour se déconnecter (faire passer le token à null)
  const logoutHandler = () => {
    setToken(null);
    setUserId(null);
    setAdmin(null);
    //supprimer la donnée dans le local storage
    localStorage.clear();
  };

  //s'il y présence du token ça veut dire que je suis loggé
  //convertir le token en valeur booléenne
  const userIsLoggedIn = !!token;

  //le context value
  const contextValue = {
    token: token,
    userId: userId,
    isLoggedIn: userIsLoggedIn,
    admin: admin,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
