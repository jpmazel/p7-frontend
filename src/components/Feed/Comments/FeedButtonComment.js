import classes from "./FeedButtonComment.module.css";
import Button from "../../UI/Button";
import { useState } from "react";
import ConfirmationModal from "../../UI/ConfirmationModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteFetchCommentary } from "../../../store/actions/commentary-actions";
import { commentaryActions } from "../../../store/slices/commentary-slice";

const FeedButtonComment = ({
  userIdToken,
  userIdComment,
  idCommentUser,
  token,
}) => {
  const [confirmationModal, setConfirmationModal] = useState(null);

  //Importation du context
  const authentification = useSelector(
    (state) => state.authentification.dataResponse
  );

  const dispatch = useDispatch();

  const isUpdatingComment = useSelector(
    (state) => state.commentary.modificationComment
  );

  //bouton envoyer pour valider la modification du commentaire
  const buttonSendHandler = () => dispatch(commentaryActions.boutonSend(true));

  //Pour supprimer un commentaire dans le feed
  const deleteCommentHandler = () => {
    dispatch(deleteFetchCommentary(idCommentUser, userIdToken, token));
    setConfirmationModal(null);
  };

  //confirmation modal pour suppression du compte------------------------------
  const confirmationModalHandler = () => {
    setConfirmationModal({
      title: "Confirmation de la suppression du commentaire",
      message: "La suppression du commentaire est une action irréversible",
    });
  };
  //---------------------------------------------------------------------------

  const modificationHandler = () => {
    dispatch(
      commentaryActions.modificationComment({
        isUpdating: true,
        commentToEdit: idCommentUser,
      })
    );
  };

  //Gestion du bouton ENVOYER
  const modificationOneComment =
    idCommentUser === isUpdatingComment.commentToEdit &&
    isUpdatingComment.isUpdating;

  return (
    <div className={classes.feedButtonComment}>
      <>
        {/* Bouton MODIFIER */}
        {userIdToken === userIdComment && !isUpdatingComment.isUpdating && (
          <div className={classes.orange}>
            <Button id={idCommentUser} onClick={modificationHandler}>
              Modifier
            </Button>
          </div>
        )}

        {/* Bouton ENVOYER  */}
        {userIdToken === userIdComment && modificationOneComment && (
          <Button id={idCommentUser} onClick={buttonSendHandler}>
            Envoyer
          </Button>
        )}

        {/* Bouton SUPPRIMER  */}
        {(userIdToken === userIdComment || authentification.admin === 1) &&
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
            onConfirmDelete={deleteCommentHandler}
          />
        )}
      </>
    </div>
  );
};

export default FeedButtonComment;
