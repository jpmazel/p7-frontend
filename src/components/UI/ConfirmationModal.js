import ReactDOM from "react-dom";

import Button from "./Button";
import classes from "./ConfirmationModal.module.css";
import Card from "./Card";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onConfirm} />;
};

const ConfirmationModalOverlay = (props) => {
  return (
    <section className={classes.modalConfirmation}>
      <Card className={classes.modal}>
        <header className={classes.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={classes.content}>
          <p>{props.message}</p>
        </div>
        <footer className={classes.actions}>
          <Button onClick={props.onConfirmDelete}>
            OK
          </Button>
          <Button onClick={props.onConfirm}>ANNULER</Button>
        </footer>
      </Card>
    </section>
  );
};

const ConfirmationModal = (props) => {
  return (
    <>
      {/* le backdrop */}
      {ReactDOM.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById("backdrop-root")
      )}

      {/* la modale */}
      {ReactDOM.createPortal(
        <ConfirmationModalOverlay
          title={props.title}
          message={props.message}
          onConfirm={props.onConfirm}
          onConfirmDelete={props.onConfirmDelete}
        />,
        document.getElementById("modal-root")
      )}
    </>
  );
};

export default ConfirmationModal;
