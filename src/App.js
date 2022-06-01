import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import AuthForm from "./components/Auth/AuthForm";
import FicheUserDisplayRead from "./components/FicheUser/FicheUserDisplayRead";
import MainHeader from "./components/Layout/MainHeader";
import Test from "./components/Test";
import FicheUser from "./pages/FicheUser";
import Home from "./pages/Home";
import AuthContext from "./store/authContext";
import classes from "./App.module.css";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    // <section className={classes.app}>
    <>
      <MainHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fiche_utilisateur" element={<FicheUser />} />
        <Route
          path="/fiche_utilisateur/read/:id"
          element={<FicheUserDisplayRead />}
        />
        <Route path="*" element={<Home />} />
      </Routes>
      </>
    // </section>
  );
}

export default App;
