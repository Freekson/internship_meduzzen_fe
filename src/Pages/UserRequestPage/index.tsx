import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./UserRequestPage.module.scss";
import { RootState } from "../../Store/store";
import { useSelector } from "react-redux";
import { getUserRequests } from "../../Api/user";
import { toast } from "react-toastify";
import { TCompany } from "../../Types/types";
import Button from "../../Components/Button";
import ConfirmModal from "../../Components/ConfirmModal";
import { declineUserInvitation } from "../../Api/actions";
import { ThreeDots } from "react-loader-spinner";

const UserRequestPage = () => {
  const { userData: user, token } = useSelector(
    (state: RootState) => state.user
  );

  const [companies, setCompanies] = useState<TCompany[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<TCompany | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openConfirmModal = (company: TCompany) => {
    setSelectedCompany(company);
    setIsConfirmOpen(true);
  };

  useEffect(() => {
    const fetchUserRequest = async () => {
      try {
        setIsLoading(true);
        const res = await getUserRequests(user?.user_id ?? 0);
        setCompanies(res.data.result.companies);
        toast.dismiss();
        setIsLoading(false);
      } catch (error) {
        toast.error("Error while getting invitations");
      }
    };

    if (user?.user_id) {
      fetchUserRequest();
    }
  }, [user?.user_id, token]);

  const handleCancel = async (
    company_id: number,
    company_name: string,
    action_id: number
  ) => {
    try {
      await declineUserInvitation(action_id);
      toast.success(`Declined invitation for company: ${company_name}`);
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.company_id !== company_id)
      );
    } catch (error) {
      toast.warning(
        `Failed to decline invitation for company: ${company_name}`
      );
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>List of Requests</title>
      </Helmet>

      {isLoading ? (
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
      ) : (
        <div className={styles.wrapper}>
          <h1>List of Requests</h1>
          <div className={styles.companyList}>
            {companies.length > 0 ? (
              companies.map((item) => (
                <div key={item.company_id} className={styles.companyItem}>
                  {item.company_avatar ? (
                    <img
                      src={item.company_avatar}
                      alt={item.company_name}
                      className={styles.companyAvatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>No Avatar</div>
                  )}
                  <div className={styles.companyDetails}>
                    <h3 className={styles.companyName}>{item.company_name}</h3>
                    {item.company_title && (
                      <p className={styles.companyTitle}>
                        Title: {item.company_title}
                      </p>
                    )}
                    <p
                      className={`${styles.companyVisibility} ${
                        item.is_visible ? styles.visible : styles.hidden
                      }`}
                    >
                      Visibility: {item.is_visible ? "Visible" : "Hidden"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    text="Cancel"
                    onClick={() => openConfirmModal(item)}
                  />
                </div>
              ))
            ) : (
              <p className={styles.noCompanies}>You have no requests.</p>
            )}
          </div>
          {selectedCompany && (
            <ConfirmModal
              isOpen={isConfirmOpen}
              onClose={() => setIsConfirmOpen(false)}
              onConfirm={() => {
                handleCancel(
                  selectedCompany.company_id,
                  selectedCompany.company_name,
                  selectedCompany.action_id
                );
                setIsConfirmOpen(false);
              }}
              text={`Are you sure you want to cancel request to ${selectedCompany.company_name}? `}
              btnText="Yes, cancel it"
            />
          )}
        </div>
      )}
    </Layout>
  );
};

export default UserRequestPage;
