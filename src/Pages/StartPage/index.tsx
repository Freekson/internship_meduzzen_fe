import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./StartPage.module.scss";

const StartPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Meduzzen</title>
      </Helmet>
      <div className={styles.wrapper}>
        <h1>Hello there</h1>
        <p>Welcome to our website</p>
      </div>
    </Layout>
  );
};

export default StartPage;
