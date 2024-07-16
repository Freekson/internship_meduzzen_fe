import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./UserProfilePage.module.scss";

const UserProfilePage = () => {
  return (
    <Layout>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <div className={styles.wrapper}>
        <h1>Hello there</h1>
        <p>Welcome to User Profile Page</p>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
