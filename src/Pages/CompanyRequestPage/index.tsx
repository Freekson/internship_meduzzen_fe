import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./CompanyRequestPage.module.scss";
import { RootState } from "../../Store/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "../../Components/Button";
import ConfirmModal from "../../Components/ConfirmModal";
import { acceptRequest, declineUserInvitation } from "../../Api/actions";
import { UserResponse } from "../../Types/api";
import { getCompanyRequests } from "../../Api/company";
import { useParams } from "react-router-dom";

const UserRequestPage = () => {
  const { id: companyId } = useParams<{ id: string }>();
  const { userData: user } = useSelector((state: RootState) => state.user);

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const openConfirmModal = (user: UserResponse) => {
    setSelectedUser(user);
    setIsConfirmOpen(true);
  };

  useEffect(() => {
    const fetchCompanyRequest = async () => {
      try {
        const res = await getCompanyRequests(Number(companyId) ?? 0);
        setUsers(res.data.result.users);
        toast.dismiss();
      } catch (error) {
        toast.error("Error while getting invitations");
      }
    };

    if (user?.user_id) {
      fetchCompanyRequest();
    }
  }, [user?.user_id, companyId]);

  const handleDecline = async (
    user_id: number,
    user_name: string,
    action_id: number
  ) => {
    try {
      await declineUserInvitation(action_id);
      toast.success(`Declined request from user: ${user_name}`);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.user_id !== user_id)
      );
    } catch (error) {
      toast.warning(`Failed to decline request from user: ${user_name}`);
    }
  };
  const handleAccept = async (action_id: number, user_name: string) => {
    try {
      await acceptRequest(action_id);
      toast.success(`Accepted request from user: ${user_name}`);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.action_id !== action_id)
      );
    } catch (error) {
      toast.warning(`Failed to accept request from user: ${user_name}`);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>List of Requests</title>
      </Helmet>

      <div className={styles.wrapper}>
        <h1>List of Requests</h1>
        <div className={styles.userList}>
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.user_id} className={styles.userItem}>
                {user.user_avatar ? (
                  <img
                    src={user.user_avatar}
                    alt={`${user.user_firstname} ${user.user_lastname}`}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>No Avatar</div>
                )}
                <div className={styles.userDetails}>
                  <h3 className={styles.userName}>
                    {user.user_firstname} {user.user_lastname}
                  </h3>
                  <p className={styles.userEmail}>{user.user_email}</p>
                </div>
                <div className={styles.userActions}>
                  <Button
                    type="button"
                    text="Accept"
                    onClick={() =>
                      handleAccept(user.action_id, user.user_firstname)
                    }
                  />
                  <Button
                    type="button"
                    variant="danger"
                    text="Decline"
                    onClick={() => openConfirmModal(user)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noUsers}>You have no requests.</p>
          )}
        </div>
        {selectedUser && (
          <ConfirmModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={() => {
              handleDecline(
                selectedUser.user_id,
                selectedUser.user_firstname,
                selectedUser.action_id
              );
              setIsConfirmOpen(false);
            }}
            text={`Are you sure you want to decline request from ${selectedUser.user_firstname}? `}
            btnText="Yes, decline"
          />
        )}
      </div>
    </Layout>
  );
};

export default UserRequestPage;
