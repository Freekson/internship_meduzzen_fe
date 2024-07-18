import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./UsersListPage.module.scss";

const UsersListPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>List of users</title>
      </Helmet>

      <div className={styles.wrapper}>
        <h1>Hello there</h1>
        <p>Welcome to List of users page</p>
      </div>
    </Layout>
  );
};

export default UsersListPage;
