import { Route, Routes } from "react-router-dom";
import FicheUserDisplayRead from "./components/FicheUser/FicheUserDisplayRead";
import MainHeader from "./components/Layout/MainHeader";
import FicheUser from "./pages/FicheUser";
import Home from "./pages/Home";
import { useSelector } from "react-redux";

function App() {
  const isLoggedIn = useSelector((state) => state.authentification.isLoggedIn);

  const newFiche = useSelector(
    (state) => state.ficheUser.ficheUserData.newFiche
  );
  const conditionLinkActive = newFiche;

  return (
    <>
      <MainHeader />

      {/* c'est pour le controle des URL qui sont entrées manuellementdans le navigateur*/}
      <Routes>
        {conditionLinkActive || (!isLoggedIn && !conditionLinkActive) ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/fiche_utilisateur" element={<FicheUser />} />
            <Route
              path="/fiche_utilisateur/read/:id"
              element={<FicheUserDisplayRead />}
            />
            <Route path="*" element={<Home />} />
          </>
        ) : (
          <>
            <Route path="/" element={<FicheUser />} />
            <Route path="/fiche_utilisateur" element={<FicheUser />} />
            <Route path="*" element={<FicheUser />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
