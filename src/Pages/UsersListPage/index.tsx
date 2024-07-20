import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./UsersListPage.module.scss";
import { RootState, useAppDispatch } from "../../Store/store";
import { useEffect } from "react";
import { fetchUsersList, setActivePage } from "../../Store/user/slice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReduxStatus } from "../../Types/enums";
import Pagination from "../../Components/Pagination";

const UsersListPage = () => {
  const dispatch = useAppDispatch();
  const { listStatus, usersList } = useSelector(
    (state: RootState) => state.user
  );

  const token = localStorage.getItem("BearerToken");
  const page_size = 20;
  const current_page = usersList?.pagination.current_page ?? 1;
  const total_page = usersList?.pagination.total_page ?? 5;

  const handlePageChange = (pageNumber: number) => {
    dispatch(setActivePage(pageNumber));
  };

  const handlePrevious = () => {
    if (current_page > 1) {
      dispatch(setActivePage(current_page - 1));
    }
  };

  const handleNext = () => {
    if (current_page < total_page) {
      dispatch(setActivePage(current_page + 1));
    }
  };

  useEffect(() => {
    if (token && listStatus === ReduxStatus.INIT) {
      dispatch(
        fetchUsersList({
          token,
          page: usersList?.pagination.current_page ?? 1,
          page_size,
        })
      );
    }
  }, [dispatch, listStatus, token, usersList]);

  return (
    <Layout>
      <Helmet>
        <title>List of users</title>
      </Helmet>

      <div className={styles.wrapper}>
        <h1>List of users</h1>
        <div className={styles.usersList}>
          {usersList?.users.map((user, index) => (
            <div key={index} className={styles.userCard}>
              <p className={styles.userName}>
                {user.user_firstname !== "" ? user.user_firstname : "User"}
              </p>

              <p className={styles.userEmail}>{user.user_email}</p>
              <Link to={`/user/${user.user_id}`} className={styles.userLink}>
                Show user
              </Link>
            </div>
          ))}
        </div>

        <Pagination
          pageCount={total_page}
          activePage={current_page}
          onPageChange={handlePageChange}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>
    </Layout>
  );
};

export default UsersListPage;
