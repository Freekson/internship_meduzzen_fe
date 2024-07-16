import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./CompanyProfilePage.module.scss";

const CompanyProfilePage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Company Profile</title>
      </Helmet>

      <div className={styles.wrapper}>
        <h1>Hello there</h1>
        <p>Welcome to Company Profile page</p>
      </div>
    </Layout>
  );
};

export default CompanyProfilePage;
