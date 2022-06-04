import { useContext } from "react";
import AuthForm from "../components/Auth/AuthForm";
import Feed from "../components/Feed/Feed";
import AuthContext from "../store/authContext";
import classes from "./Home.module.css";

const Home = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  return (
    <section className={classes.home}>
      {!isLoggedIn && <AuthForm />}
      {isLoggedIn && <Feed />}
    </section>
  );
};

export default Home;
