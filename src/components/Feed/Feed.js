import { useState } from "react";
import FeedDisplayPost from "./FeedDisplayPost";
import FeedNewPost from "./FeedNewPost";
import classes from "./Feed.module.css";

const Feed = () => {
  const [message, setMessage] = useState(null);

  //Remonter l'information de FeedNewPost et la transmettre pour indiquer qu'un message
  //a bien été envoyé vers la base de données pour pouvoir faire un
  //re render dans le composant FeedDisplayPort
  const onUpdate = (message) => {
    const messageUpdate = message;
    setMessage(messageUpdate);
  };

  return (
    <div className={classes.feed}>
      <FeedNewPost onUpdate={onUpdate} />
      <FeedDisplayPost onUpdate={message} />
    </div>
  );
};

export default Feed;
