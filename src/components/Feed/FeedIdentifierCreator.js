import classes from "./FeedIdentifierCreator.module.css";
import dateFormat from "dateformat";

const FeedIdentifierCreator = ({ user_prenom, user_nom, posts_date }) => {

  //Modification du format de la date
  const date = dateFormat(posts_date, "isoDate");
  const time = dateFormat(posts_date, "isoTime");  
  
  return (
    <div className={classes.feedIdentifierCreator}>
      <p>
        {user_prenom} {user_nom} 
      </p>
      <p>Posté le : {`${date} ${time}`}</p>
    </div>
  );
};

export default FeedIdentifierCreator;
