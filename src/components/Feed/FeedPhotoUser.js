import classes from "./FeedPhotoUser.module.css";
import emptyPortrait from "../../assets/images/empty-portrait.jpg"

const FeedPhotoUser = ({ photoProfilUrl }) => {
  return (
    <div className={classes.feedPhotoUser}>
      <img src={photoProfilUrl ? photoProfilUrl : emptyPortrait} alt="tête profil" />
    </div>
  );
};

export default FeedPhotoUser;
