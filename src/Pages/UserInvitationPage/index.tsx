import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./UserInvitationPage.module.scss";
import { useEffect, useState } from "react";
import { RootState } from "../../Store/store";
import { useSelector } from "react-redux";
import { getUserInvitation } from "../../Api/user";
import { toast } from "react-toastify";
import Button from "../../Components/Button";
import { acceptUserInvitation, declineUserInvitation } from "../../Api/actions";
import ConfirmModal from "../../Components/ConfirmModal";
import { TCompany } from "../../Types/types";
import { ThreeDots } from "react-loader-spinner";
import CustomLink from "../../Components/CustomLink";
import routes from "../../routes";

const UserInvitationPage = () => {
  const { userData: user } = useSelector((state: RootState) => state.user);

  const [companies, setCompanies] = useState<TCompany[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<TCompany | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openConfirmModal = (company: TCompany) => {
    setSelectedCompany(company);
    setIsConfirmOpen(true);
  };

  useEffect(() => {
    const fetchUserInvitation = async () => {
      try {
        setIsLoading(true);
        const res = await getUserInvitation(user?.user_id ?? 0);
        setCompanies(res);
        toast.dismiss();
        setIsLoading(false);
      } catch (error) {
        toast.error("Error while getting invitations");
      }
    };

    if (user?.user_id) {
      fetchUserInvitation();
    }
  }, [user?.user_id]);

  const handleAccept = async (
    company_id: number,
    company_name: string,
    action_id: number
  ) => {
    try {
      await acceptUserInvitation(action_id);
      toast.success(`Accepted invitation for company: ${company_name}`);
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.company_id !== company_id)
      );
    } catch (error) {
      toast.warning(`Failed to accept invitation for company: ${company_name}`);
    }
  };

  const handleDecline = async (
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
        <title>List of Invitation</title>
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
          <h1>List of Invitations</h1>
          <div className={styles.companyList}>
            {companies.length > 0 ? (
              companies.map((company) => (
                <div key={company.company_id} className={styles.companyItem}>
                  <p>{company.company_name}</p>
                  <div className={styles.btns}>
                    <Button
                      type="button"
                      text="Accept"
                      onClick={() =>
                        handleAccept(
                          company.company_id,
                          company.company_name,
                          company.action_id
                        )
                      }
                    />
                    <Button
                      type="button"
                      text="Decline"
                      variant="danger"
                      onClick={() => openConfirmModal(company)}
                    />
                    <CustomLink
                      to={routes.companyPage(company.company_id)}
                      text="Show"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noCompanies}>You have no invitations.</p>
            )}
          </div>
          {selectedCompany && (
            <ConfirmModal
              isOpen={isConfirmOpen}
              onClose={() => setIsConfirmOpen(false)}
              onConfirm={() => {
                handleDecline(
                  selectedCompany.company_id,
                  selectedCompany.company_name,
                  selectedCompany.action_id
                );
                setIsConfirmOpen(false);
              }}
              text={`Are you sure you want to decline invitation to ${selectedCompany.company_name}? `}
              btnText="Yes, Decline"
            />
          )}
        </div>
      )}
    </Layout>
  );
};

export default UserInvitationPage;
