import classes from "./FeedButton.module.css";
import Button from "../UI/Button";
import { useState } from "react";
import ConfirmationModal from "../UI/ConfirmationModal";

import FeedBadge from "./Comments/FeedBadge";
import useHttp from "../../hooks/use-http";
import {useSelector} from "react-redux"

const FeedButton = ({
  userIdToken,
  token,
  idPostsUser,
  userIdPost,
  onUpdateDelete,
  onModicatifionMessage,
  isUpdatingPost,
  onSendMessage,
  onCommentsDisplayPost,
}) => {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const authentification = useSelector((state) =>state.authentification.dataResponse)
  const { sendRequest: fetchDeletePostFeedHandler } = useHttp();
  
  //Pour supprimer un post dans le feed
  const deletePost = () => {
    //Objet de configuration du custom hook http
    const requestConfig = {
      url: `http://localhost:3000/api/posts/${idPostsUser}?userId=${userIdToken}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    };
    fetchDeletePostFeedHandler(requestConfig, () =>
      onUpdateDelete(idPostsUser)
    );
  };

  //confirmation modal pour suppression du compte------------------------------
  const confirmationModalHandler = () => {
    setConfirmationModal({
      title: "Confirmation de la suppression du message",
      message: "La suppression du message est une action irréversible",
    });
  };
  //---------------------------------------------------------------------------

  //Gestion du bouton ENVOYER

  const modificationOnePost =
    idPostsUser === (isUpdatingPost && isUpdatingPost.postToEdit);

  return (
    <div className={classes.feedButton}>
      {/* Bouton COMMENTAIRE pour AFFICHER les commentaires sous le post  */}
      {!modificationOnePost && (
        <>
          <Button id={idPostsUser} onClick={onCommentsDisplayPost}>
            <FeedBadge
              userIdToken={userIdToken}
              token={token}
              idPostsUser={idPostsUser}
            />
            Commentaire
          </Button>
        </>
      )}

      <>
        {/* Bouton MODIFIER */}
        {userIdToken === userIdPost && !isUpdatingPost && (
          <div className={classes.orange}>
            <Button id={idPostsUser} onClick={onModicatifionMessage}>
              Modifier
            </Button>
          </div>
        )}

        {/* Bouton ENVOYER  */}
        {userIdToken === userIdPost && modificationOnePost && (
          <Button id={idPostsUser} onClick={onSendMessage}>
            Envoyer
          </Button>
        )}

        {/* Bouton SUPPRIMER  */}
        {(userIdToken === userIdPost || authentification.admin === 1) &&
          !modificationOnePost && (
            <div className={classes.red}>
              <Button onClick={confirmationModalHandler}>Supprimer</Button>
            </div>
          )}

        {confirmationModal && (
          <ConfirmationModal
            title={confirmationModal.title}
            message={confirmationModal.message}
            onConfirm={() => setConfirmationModal(null)}
            onConfirmDelete={() => deletePost()}
          />
        )}
      </>
    </div>
  );
};

export default FeedButton;
