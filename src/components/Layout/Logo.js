import classes from "./Logo.module.css";
import logo from "../../assets/images/logo-site-reseau-social.png";

const Logo = () => {
  return (
    <div className={classes.logo}>
      <img src={logo} alt="logo-reaseau-social" />
    </div>
  );
};

export default Logo;
