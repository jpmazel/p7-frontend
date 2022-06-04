import classes from "./FeedButtonComment.module.css";
import Button from "../../UI/Button";
import { useContext, useState } from "react";
import ConfirmationModal from "../../UI/ConfirmationModal";
import AuthContext from "../../../store/authContext";

const FeedButtonComment = ({
  userIdToken,
  userIdComment,
  idCommentUser,
  token,
  onUpdateDelete,
  onModicatifionMessage,
  isUpdatingComment,
  onSendMessage,
}) => {
  const [confirmationModal, setConfirmationModal] = useState(null);

  //Importation du context
  const authCtx = useContext(AuthContext);

  //Pour supprimer un commentaire dans le feed
  const deletePost = () => {
    //La requête à envoyer au backend pour supprimer le post dans le feed
    // http://localhost:3000/api/posts/comment/177?userId=46

    const fetchDeleteCommentFeedHandler = async () => {
      const url = `http://localhost:3000/api/posts/comment/${idCommentUser}?userId=${userIdToken}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const dataResponse = await response.json();

        if (response.ok) {
          console.log("fetchDeleteCommentFeedHandler response.ok");
          console.log(response);
          console.log(dataResponse);
          onUpdateDelete(idCommentUser);
        } else {
          console.log("-->fetchDeleteCommentFeedHandler response PAS OK");
          console.log(response);
          console.log(dataResponse);
          throw new Error(dataResponse.error);
        }
      } catch (error) {
        console.log("-->Dans le catch ");
      }
    };

    fetchDeleteCommentFeedHandler();
  };

  //confirmation modal pour suppression du compte---------------------------------
  const confirmationModalHandler = () => {
    setConfirmationModal({
      title: "Confirmation de la suppression du commentaire",
      message: "La suppression du commentaire est une action irréversible",
    });
  };
  //--------------------------------------------------------------------------------

  //Gestion du bouton ENVOYER
  const modificationOneComment =
    idCommentUser === (isUpdatingComment && isUpdatingComment.commentToEdit);

  return (
    <div className={classes.feedButtonComment}>
      <>
        {/* Bouton MODIFIER */}
        {userIdToken === userIdComment && !isUpdatingComment && (
          <div className={classes.orange}>
            <Button id={idCommentUser} onClick={onModicatifionMessage}>
              Modifier
            </Button>
          </div>
        )}

        {/* Bouton ENVOYER  */}
        {userIdToken === userIdComment && modificationOneComment && (
          <Button id={idCommentUser} onClick={onSendMessage}>
            Envoyer
          </Button>
        )}

        {/* Bouton SUPPRIMER  */}
        {(userIdToken === userIdComment || authCtx.admin === 1) &&
          !modificationOneComment && (
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

export default FeedButtonComment;
