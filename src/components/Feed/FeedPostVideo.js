import { useEffect, useState } from "react";
import classes from "./FeedPostVideo.module.css";

const FeedPostVideo = ({ videoPost }) => {
  const [idVideo, setIdVideo] = useState(null);

  //Lesformats de lien accepté
  // https://www.youtube.com/watch?v=PKjDWbeKUUU  lien qui vient du navigateur barre d'adresse
  // https://youtu.be/PKjDWbeKUUU                 lien qui vient du bouton partager

  useEffect(() => {
    if (videoPost && videoPost.split("=")[1]) {
      setIdVideo(videoPost.split("=")[1]);
    } else if (videoPost && videoPost.split("/")[3]) {
      setIdVideo(videoPost && videoPost.split("/")[3]);
    } else {
      //iD Vidéo INVALIDE
      setIdVideo(null);
    }
  }, [videoPost]);

  return (
    <section className={classes.feedPostVideo}>
      {videoPost && (
        <iframe
          width="300"
          height="170"
          src={`https://www.youtube.com/embed/${idVideo}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </section>
  );
};

export default FeedPostVideo;
