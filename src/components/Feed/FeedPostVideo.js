import { useEffect, useState } from "react";
import classes from "./FeedPostVideo.module.css";

const FeedPostVideo = ({ videoPost }) => {
  const [idVideo, setIdVideo] = useState(null);

  //Prise en compte des 2 formats URL des liens vidéos YouTube
  //https://www.youtube.com/watch?v=N0DhCV_-Qbg
  //https://youtu.be/N0DhCV_-Qbg

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
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      )}
    </section>
  );
};

export default FeedPostVideo;
