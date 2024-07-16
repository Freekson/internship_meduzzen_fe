import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./CompaniesListPage.module.scss";

const CompaniesListPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>List of companies</title>
      </Helmet>

      <div className={styles.wrapper}>
        <h1>Hello there</h1>
        <p>Welcome to List of companies page</p>
      </div>
    </Layout>
  );
};

export default CompaniesListPage;
