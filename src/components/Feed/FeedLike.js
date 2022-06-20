import { useEffect, useState } from "react";
import classes from "./FeedLike.module.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import useHttp from "../../hooks/use-http";

const FeedLike = ({ token, idPostsUser, userIdToken }) => {
  const [like, setLike] = useState(null);
  const [reload, setReload] = useState(false);
  const { sendRequest: fetchPUTLikeHandler } = useHttp();
  const { sendRequest: fetchGetLikeHandler } = useHttp();
  const { sendRequest: fetchPOSTLikeHandler } = useHttp();

  //Quand je clique sur le bouton du like du post (le bouton j'aime est à 0 ou neutre - pouce vide-coeur vide)
  const neutralLikeHandler = () => {
    if (like && like.length === 0) {
      const data = {
        likes_user_id_posts: idPostsUser,
        likes_user_userId: userIdToken,
        likes_user_like: 1,
      };

      const resquestConfig = {
        url: `http://localhost:3000/api/posts/likes/?userId=${userIdToken}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: data,
      };

      fetchPOSTLikeHandler(resquestConfig, () =>
        setReload((prevState) => !prevState)
      );
    } else if (like && like[0]) {
      const data = {
        likes_user_like: like[0].likes_user_like,
      };

      const requestConfig = {
        url: `http://localhost:3000/api/posts/likes/${like[0].id_likes_user}?userId=${userIdToken}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: data,
      };

      fetchPUTLikeHandler(requestConfig, () =>
        setReload((prevState) => !prevState)
      );
    }
  };

  //Lorsque la ligne like existe sur la bdd passer le like de 1 à 0 ou de 0 à 1
  const likeHandler = () => {
    const data = {
      likes_user_like: like[0].likes_user_like,
    };

    const requestConfig = {
      url: `http://localhost:3000/api/posts/likes/${like[0].id_likes_user}?userId=${userIdToken}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data,
    };

    fetchPUTLikeHandler(requestConfig, () =>
      setReload((prevState) => !prevState)
    );
  };

  useEffect(() => {
    //objet de configuration
    const sendRequest = {
      url: `http://localhost:3000/api/posts/likes/${idPostsUser}?userId=${userIdToken}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetchGetLikeHandler(sendRequest, (dataResponse) => setLike(dataResponse));
  }, [reload, fetchGetLikeHandler, idPostsUser, token, userIdToken]);

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
          {" "}
          <ThumbUpOutlinedIcon fontSize="large" />
        </p>
      )}
    </div>
  );
};

export default FeedLike;
