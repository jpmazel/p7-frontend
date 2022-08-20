import { useSelector } from "react-redux";
import AuthForm from "../components/Auth/AuthForm";
import Feed from "../components/Feed/Feed";

import classes from "./Home.module.css";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.authentification.isLoggedIn);

  return (
    <section className={classes.home}>
      {!isLoggedIn && <AuthForm />}
      {isLoggedIn && <Feed />}
    </section>
  );
};

export default Home;
