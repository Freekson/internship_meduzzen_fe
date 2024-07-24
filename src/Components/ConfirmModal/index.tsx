import Button from "../Button";
import Modal from "../Modal";
import styles from "./ConfirmModal.module.scss";

type TProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  text: string;
  btnText?: string;
};

const ConfirmModal: React.FC<TProps> = ({
  isOpen,
  onClose,
  onConfirm,
  text,
  btnText,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={styles.header}>{text}</h2>
      <div className={styles.btn__wrapper}>
        <Button
          onClick={onConfirm}
          text={btnText ?? "Yes"}
          type="button"
          variant="danger"
        />
        <Button onClick={onClose} text="Cancel" type="button" />
      </div>
    </Modal>
  );
};

export default ConfirmModal;
