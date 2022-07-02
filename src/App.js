import { useContext } from "react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import FicheUserDisplayRead from "./components/FicheUser/FicheUserDisplayRead";
import MainHeader from "./components/Layout/MainHeader";
import FicheUser from "./pages/FicheUser";
import Home from "./pages/Home";
import AuthContext from "./store/authContext";

function App() {
  const [ficheRefresh, setFicheRefresh] = useState(false);
  const [conditionLinkInactive, setConditionLinkInactive] = useState(false);

  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const newFicheHandler = () => {
    setFicheRefresh((prevState) => !prevState);
  };

  //---------------------------
  const conditionLinkInactiveHandler = (value) => {
    setConditionLinkInactive(value);
  };

  //-----------------------------------------------------------------------

  return (
    // <section className={classes.app}>
    <>
      <MainHeader
        ficheRefresh={ficheRefresh}
        onConditionLinkInactive={conditionLinkInactiveHandler}
      />

      <Routes>
        {!conditionLinkInactive || (!isLoggedIn && conditionLinkInactive) ? (
          <>
            <Route path="/" element={<Home />} />
            <Route
              path="/fiche_utilisateur"
              element={<FicheUser onNewFiche={newFicheHandler} />}
            />
            <Route
              path="/fiche_utilisateur/read/:id"
              element={<FicheUserDisplayRead />}
            />
            <Route path="*" element={<Home />} />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={<FicheUser onNewFiche={newFicheHandler} />}
            />
            <Route
              path="/fiche_utilisateur"
              element={<FicheUser onNewFiche={newFicheHandler} />}
            />
            <Route
              path="*"
              element={<FicheUser onNewFiche={newFicheHandler} />}
            />
          </>
        )}
      </Routes>
    </>
    // </section>
  );
}

export default App;
