import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./UserPage.module.scss";
import { useParams } from "react-router-dom";
import { RootState, useAppDispatch } from "../../Store/store";
import { useEffect } from "react";
import { fetchUserById } from "../../Store/user/slice";
import { useSelector } from "react-redux";
import { ReduxStatus } from "../../Types/enums";
import { ThreeDots } from "react-loader-spinner";

const UserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { fetchedById, fetchedByIdStatus, token } = useSelector(
    (state: RootState) => state.user
  );

  const user = fetchedById.find((user) => user.user_id === Number(id));

  useEffect(() => {
    if (token && id) {
      dispatch(
        fetchUserById({
          user_id: Number(id),
        })
      );
    }
  }, [dispatch, id, token]);

  return (
    <Layout>
      <Helmet>
        <title>List of users</title>
      </Helmet>

      {fetchedByIdStatus === ReduxStatus.LOADING ? (
        <div className={styles.loading}>
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#fb791b"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            visible={true}
          />
        </div>
      ) : user ? (
        <div className={styles.userProfile}>
          {user.user_avatar && (
            <img
              src={user.user_avatar}
              alt={`${user.user_firstname} ${user.user_lastname}`}
              className={styles.avatar}
            />
          )}
          <h1 className={styles.name}>
            {user.user_firstname} {user.user_lastname}
          </h1>
          <p className={styles.email}>Email: {user.user_email}</p>
          <p className={styles.city}>City: {user.user_city}</p>
          <p className={styles.phone}>Phone: {user.user_phone}</p>
          <p className={styles.status}>Status: {user.user_status}</p>
          {Array.isArray(user.user_links) && user.user_links.length > 0 && (
            <div className={styles.links}>
              <h2>Links</h2>
              <ul>
                {user.user_links.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.error}>User not found</div>
      )}
    </Layout>
  );
};

export default UserPage;
