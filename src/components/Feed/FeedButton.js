import classes from "./FeedButton.module.css";
import Button from "../UI/Button";
import { useContext, useState } from "react";
import ConfirmationModal from "../UI/ConfirmationModal";
import AuthContext from "../../store/authContext";
import FeedBadge from "./Comments/FeedBadge";


const FeedButton = ({
  userIdToken,
  userIdPost,
  idPostsUser,
  token,
  onUpdateDelete,
  onModicatifionMessage,
  isUpdatingPost,
  onSendMessage,
  onCommentsDisplayPost,
  newComment,
  updateDeleteComment
}) => {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const authCtx = useContext(AuthContext);

  //Pour supprimer un post dans le feed
  const deletePost = () => {
    console.log("J'ai appuyer sur le boutton supprimer");
    console.log(idPostsUser);

    //La requête à envoyer au backend pour supprimer le post dans le feed
    const url = `http://localhost:3000/api/posts/${idPostsUser}?userId=${userIdToken}`;

    const fetchDeletePostFeedHandler = async () => {
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const dataResponse = await response.json();

        if (response.ok) {
          console.log("response.ok");
          console.log(response);
          console.log(dataResponse);
          console.log(`Le post : ${idPostsUser} a été supprimé dans le feed`);
          onUpdateDelete(idPostsUser);
        } else {
          console.log("-->response PAS OK");
          console.log(response);
          console.log(dataResponse);
          throw new Error(dataResponse.error);
        }
      } catch (error) {
        console.log("-->Dans le catch ");
      }
    };

    fetchDeletePostFeedHandler();
  };

  //confirmation modal pour suppression du compte---------------------------------
  const confirmationModalHandler = () => {
    console.log("je suis dans confirmationModalHandler");
    setConfirmationModal({
      title: "Confirmation de la suppression du message",
      message: "La suppression du message est une action irréversible",
    });
  };
  //--------------------------------------------------------------------------------
  console.log("Je suis dans FeedButton isUpdatingPost");
  console.log(isUpdatingPost && isUpdatingPost.postToEdit);

  //Gestion du bouton ENVOYER

  const modificationOnePost =
    idPostsUser === (isUpdatingPost && isUpdatingPost.postToEdit);

  return (
    <div className={classes.feedButton}>
      {/* Bouton COMMENTAIRE pour AFFICHER les commentaires sous le post  */}
      {!modificationOnePost && (
        <Button id={idPostsUser} onClick={onCommentsDisplayPost}>
           <FeedBadge
              userIdToken={userIdToken}
              token={token}
              idPostsUser={idPostsUser}
              newComment={newComment}
              updateDeleteComment={updateDeleteComment}
            />
          Commentaire
        </Button>
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
        {(userIdToken === userIdPost || authCtx.admin === 1) &&
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
