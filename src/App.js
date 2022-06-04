import { Route, Routes } from "react-router-dom";
import FicheUserDisplayRead from "./components/FicheUser/FicheUserDisplayRead";
import MainHeader from "./components/Layout/MainHeader";
import Test from "./components/Test";
import FicheUser from "./pages/FicheUser";
import Home from "./pages/Home";

function App() {
  return (
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
  );
}

export default App;
