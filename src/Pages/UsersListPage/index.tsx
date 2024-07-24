import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./UsersListPage.module.scss";
import { RootState, useAppDispatch } from "../../Store/store";
import { useEffect, useState } from "react";
import {
  fetchCompanies,
  fetchUsersList,
  setActivePage,
} from "../../Store/user/slice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReduxStatus } from "../../Types/enums";
import Pagination from "../../Components/Pagination";
import { toast } from "react-toastify";
import Modal from "../../Components/Modal";
import Button from "../../Components/Button";
import { TListUserItem } from "../../Store/user/types";
import { sendInvite } from "../../Api/actions";

const UsersListPage = () => {
  const dispatch = useAppDispatch();
  const {
    listStatus,
    usersList,
    companies,
    userData: user,
    token,
  } = useSelector((state: RootState) => state.user);
  const [selectedCompanyId, setSelectedCompanyId] = useState<
    number | undefined
  >(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TListUserItem | null>(null);

  const page_size = 20;
  const current_page = usersList?.pagination.current_page ?? 1;
  const total_page = usersList?.pagination.total_page ?? 5;

  const openModal = (user: TListUserItem) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompanyId(Number(event.target.value));
  };

  const handleInvite = async (companyId: number, userId: number) => {
    try {
      await sendInvite(companyId, userId);
      toast.success(`Invite sent successfully`);
    } catch (error: any) {
      if (error.response.data.detail === "you cannot send this request 2") {
        toast.warning(
          "You have already sent a request to this company or you have already been invited to it"
        );
      } else {
        toast.error("Failed to send invite");
      }
    }
  };

  useEffect(() => {
    if (token && listStatus === ReduxStatus.INIT) {
      dispatch(
        fetchUsersList({
          page: usersList?.pagination.current_page ?? 1,
          page_size,
        })
      );
    }
  }, [dispatch, listStatus, token, usersList]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCompanies({ user_id: user?.user_id ?? 0 }));
    }
  }, [dispatch, token, user]);

  return (
    <Layout>
      <Helmet>
        <title>List of users</title>
      </Helmet>

      <div className={styles.wrapper}>
        <h1>List of users</h1>
        <div className={styles.usersList}>
          {usersList?.users.map((item, index) => (
            <div key={index} className={styles.userCard}>
              <p className={styles.userName}>
                {item.user_firstname !== "" ? item.user_firstname : "User"}
              </p>

              <p className={styles.userEmail}>{item.user_email}</p>
              <div className={styles.actions}>
                <Link to={`/user/${item.user_id}`} className={styles.userLink}>
                  Show user
                </Link>
                {item.user_id !== user?.user_id && (
                  <Button
                    text="Invite user"
                    type="button"
                    onClick={() => openModal(item)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedUser && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2>
              Choose to which company you want to invite{" "}
              {selectedUser.user_firstname}
            </h2>
            <form
              onSubmit={() => {
                handleInvite(selectedCompanyId ?? -1, selectedUser.user_id);
                setIsModalOpen(false);
              }}
              className={styles.form_wrapper}
            >
              <div>
                <label htmlFor="company-select">Select a company:</label>
                <select
                  id="company-select"
                  value={selectedCompanyId ?? ""}
                  onChange={handleSelectChange}
                  required
                >
                  <option value="" disabled>
                    Select a company
                  </option>
                  {companies.map((company) => (
                    <option key={company.company_id} value={company.company_id}>
                      {company.company_name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" text="Invite" />
              {selectedCompanyId && (
                <div>Selected Company ID: {selectedCompanyId}</div>
              )}
            </form>
          </Modal>
        )}

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
