import { useEffect, useState } from "react";
import classes from "./FeedPostVideo.module.css";

const FeedPostVideo = ({ videoPost }) => {
  const [idVideo, setIdVideo] = useState(null);
  console.log("-->lien de la vidéo YOUTUBE videoPost");

  // https://www.youtube.com/watch?v=w_DrB8I-yX8 lien qui vient du navigateur barre d'adresse
  // https://youtu.be/yk2_zrtkvO8                lien qui vient du bouton partager

  // console.log("--->videoPost--");
  // console.log(videoPost);

  // const url = "https://youtu.be/yk2_zrtkvO8 ";
  // console.log("extraction identifiant URL 1");
  // console.log(url.split("=")[1]);

  // console.log("extraction identifiant URL 2");
  // console.log(url.split("/")[3]);

  useEffect(() =>{
     if(videoPost && videoPost.split("=")[1]){
       setIdVideo(videoPost.split("=")[1])
     }else if(videoPost && videoPost.split("/")[3]){
       setIdVideo(videoPost && videoPost.split("/")[3])
     }else{
       //iD Vidéo INVALIDE
      setIdVideo(null)
     }
  }, [videoPost])
  

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
