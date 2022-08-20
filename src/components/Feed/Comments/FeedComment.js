import { useState } from "react";
import classes from "./FeedComment.module.css";
import Linkify from "linkify-react";
import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {putFetchCommentary} from "../../../store/actions/commentary-actions"

const FeedComment = ({
  idComment,
  userIdToken,
  comment,  
  token,  
}) => {
  const [messageTextarea, setMessageTextarea] = useState({
    comments_user_message: comment,
  });

  const buttonSend = useSelector((state) =>state.commentary.modificationComment.buttonSend)
  const isUpdatingComment = useSelector((state) =>state.commentary.modificationComment )  

  const commentToEdit =  isUpdatingComment.commentToEdit;  

  const dispatch = useDispatch()

  //Condition pour afficher l'interface de MODIFICATION
  const modificationOneComment = (commentToEdit === idComment ) &&  isUpdatingComment.isUpdating;

  //fonction exécuté par onChange du textarea du post
  const messageModificationHandler = (event) => {
    setMessageTextarea({ comments_user_message: event.target.value });
  };

  //La requête PUT avec le custom Hook HTTP
  useEffect(() => {
    if (buttonSend && modificationOneComment) {
      //exécution de la fonction     
      dispatch(putFetchCommentary(idComment,userIdToken,token,messageTextarea))      
    }
  }, [
    buttonSend,
    dispatch,
    idComment,
    messageTextarea,
    modificationOneComment,   
    token,
    userIdToken,
  ]);

  return (
    <div className={classes.feedComment}>
      {modificationOneComment ? (
        <textarea
          defaultValue={comment}
          onChange={messageModificationHandler}
        />
      ) : (
        <Linkify options={{ target: "_blank" }}>
          <p>{comment}</p>
        </Linkify>
      )}
    </div>
  );
};

export default FeedComment;
