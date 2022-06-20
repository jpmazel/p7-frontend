import classes from "./FeedButtonComment.module.css";
import Button from "../../UI/Button";
import { useContext, useState } from "react";
import ConfirmationModal from "../../UI/ConfirmationModal";
import AuthContext from "../../../store/authContext";
import useHttp from "../../../hooks/use-http";

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

  const { sendRequest: fetchDeleteCommentFeedHandler } = useHttp();

  //Importation du context
  const authCtx = useContext(AuthContext);

  //Pour supprimer un commentaire dans le feed
  const deleteComment = () => {
    const requestConfig = {
      url: `http://localhost:3000/api/posts/comment/${idCommentUser}?userId=${userIdToken}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetchDeleteCommentFeedHandler(requestConfig, () =>
      onUpdateDelete(idCommentUser)
    );
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
            onConfirmDelete={() => deleteComment()}
          />
        )}
      </>
    </div>
  );
};

export default FeedButtonComment;
