import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import Modal from "../../Components/Modal";
import { useState } from "react";
import styles from "./AboutPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setTestString } from "../../Store/store";

const AboutPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const testString = useSelector((state: RootState) => state.test.testString);
  const dispatch = useDispatch();

  const changeTestString = () => {
    dispatch(setTestString("New test string"));
  };

  return (
    <Layout>
      <Helmet>
        <title>About us</title>
      </Helmet>
      <div className={styles.wrapper}>
        <h1>About us page</h1>
        <button onClick={openModal} className={styles.modal_btn}>
          Check modal
        </button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Modal Title</h2>
          <img src="https://i.waifu.pics/8-xAiM1.png" alt="img" width={400} />
          <p>Test String from Redux: {testString}</p>
          <button onClick={changeTestString}>Change Test String</button>
        </Modal>
      </div>
    </Layout>
  );
};

export default AboutPage;
