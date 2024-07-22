import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import Modal from "../../Components/Modal";
import { useEffect, useState } from "react";
import styles from "./AboutPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setTestString } from "../../Store/store";
import { apiWithoutAuth } from "../../Api/api";
import { toast } from "react-toastify";

const AboutPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const testString = useSelector((state: RootState) => state.test.testString);
  const dispatch = useDispatch();

  const changeTestString = () => {
    dispatch(setTestString("New test string"));
  };

  const [res, setRes] = useState("idk");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiWithoutAuth.get("/");
        setRes(res.data.result);
      } catch (error: any) {
        toast.error(`${error.response.data.detail}`);
      }
    };

    fetchData();
  }, []);

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
        <p>Backend response: {res}</p>
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
