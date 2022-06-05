import { useCallback, useEffect, useState } from "react";
import classes from "./FeedLike.module.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";

const FeedLike = ({ token, idPostsUser, userIdToken }) => {
  const [like, setLike] = useState(null);
  const [reload, setReload] = useState(false);

  const fetchGetLikeHandler = useCallback(async () => {
    //Aller chercher tous les likes  de la base de données qui sont la table likes_user
    const url = `http://localhost:3000/api/posts/likes/${idPostsUser}?userId=${userIdToken}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataResponse = await response.json();

      if (response.ok) {
        setLike(dataResponse.results);
      } else {
        console.log("-->fetchGetLikeHandler response PAS ok");
        throw new Error(dataResponse.error);
      }
    } catch (error) {
      console.log("-->Dans le catch requête fetchGetLikeHandler");
      console.log(error);
    }
  }, [idPostsUser, token, userIdToken]);

  //Quand je clique sur le bouton du like du post (le bouton j'aime est à 0 ou neutre - pouce vide-coeur vide)
  const neutralLikeHandler = () => {
    if (like && like.length === 0) {
      //La requête POST avec fetch pour pour créer la ligne du like dans la table likes_user
      const fetchPOSTLikeHandler = async () => {
        const url = `http://localhost:3000/api/posts/likes/?userId=${userIdToken}`;

        const data = {
          likes_user_id_posts: idPostsUser,
          likes_user_userId: userIdToken,
          likes_user_like: 1,
        };
        try {
          //La requête POST avec text (pas d'image)
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });

          //Convertir la reponse du serveur avec la méthode json()
          const dataResponse = await response.json();

          //Si la response du serveur est OK
          if (response.ok) {
            setReload((prevState) => !prevState);
          } else {
            console.log("--->fetchPOSTLikeHandler dataResponse PAS OK");
            console.log(dataResponse);
          }
        } catch (error) {
          console.log("--->Dans le CATCH fetchPOSTLikeHandler");
          throw new Error(error);
        }
      };

      fetchPOSTLikeHandler();
    } else if (like && like[0]) {
      //La requête PUT  pour faire passer le like de 1 a 0 ou de 0 à 1
      const fetchPUTLikeHandler = async () => {
        const url = `http://localhost:3000/api/posts/likes/${like[0].id_likes_user}?userId=${userIdToken}`;

        const data = {
          likes_user_like: like[0].likes_user_like,
        };

        try {
          //La requête POST avec text (pas d'image)
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });

          //Convertir la reponse du serveur avec la méthode json()
          const dataResponse = await response.json();

          //Si la response du serveur est OK
          if (response.ok) {
            setReload((prevState) => !prevState);
          } else {
            console.log("--->fetchPUTLikeHandler dataResponse PAS OK");
            console.log(dataResponse);
          }
        } catch (error) {
          console.log("--->Dans le CATCH fetchPUTLikeHandler");
          throw new Error(error);
        }
      };
      fetchPUTLikeHandler();
    }
  };

  //Lorsque la ligne like existe sur la bdd passer le like de 1 à 0 ou de 0 à 1
  const likeHandler = () => {
    //La requête PUT  pour faire passer le like de 1 a 0 ou de 0 à 1
    const fetchPUTLikeHandler = async () => {
      const url = `http://localhost:3000/api/posts/likes/${like[0].id_likes_user}?userId=${userIdToken}`;

      const data = {
        likes_user_like: like[0].likes_user_like,
      };

      try {
        //La requête POST avec text (pas d'image)
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        //Convertir la reponse du serveur avec la méthode json()
        const dataResponse = await response.json();

        //Si la response du serveur est OK
        if (response.ok) {
          setReload((prevState) => !prevState);
        } else {
          console.log(
            "--->fetchPUTLikeHandler - likeHandler- dataResponse PAS OK"
          );
          console.log(dataResponse);
        }
      } catch (error) {
        console.log("--->Dans le CATCH fetchPUTLikeHandler - likeHandler");
        throw new Error(error);
      }
    };

    fetchPUTLikeHandler();
  };

  useEffect(() => {
    fetchGetLikeHandler();
  }, [reload, fetchGetLikeHandler]);

  return (
    <div className={classes.feedLike}>
      {/* <p>
        LIKE userId: {userIdToken} ET idPost: {idPostsUser}
      </p> */}
      {like && like[0] && like[0].likes_user_like ? (
        <p onClick={likeHandler}>
          <ThumbUpIcon fontSize="large" />
        </p>
      ) : (
        <p onClick={neutralLikeHandler}>
          <ThumbUpOutlinedIcon fontSize="large" />
        </p>
      )}
    </div>
  );
};

export default FeedLike;
