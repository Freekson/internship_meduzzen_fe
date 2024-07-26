import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import {
  CompanyLastPassResponse,
  UserQuizDataResponse,
  UserResponse,
} from "../../Types/api";
import { useEffect, useState } from "react";
import {
  getCompanyMembers,
  getUsersLastPass,
  getUsersRating,
} from "../../Api/company";
import { toast } from "react-toastify";
import { ReduxStatus } from "../../Types/enums";
import { ThreeDots } from "react-loader-spinner";
import styles from "./CompanyStatisticsPage.module.scss";
import CustomLink from "../../Components/CustomLink";
import routes from "../../routes";
import { checkUserAction } from "../../Utils/checkUserAction";
import CompanyUserAnalytics from "../../Components/CompanyUserAnalytics";
import CompanyUserChart from "../../Components/CompanyUserChart";
import Modal from "../../Components/Modal";
import Button from "../../Components/Button";

const CompanyStatisticsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { byIdStatus } = useSelector((state: RootState) => state.company);
  const { userData: user } = useSelector((state: RootState) => state.user);

  const [members, setMembers] = useState<UserResponse[]>([]);
  const [lastPass, SetLastPass] = useState<CompanyLastPassResponse[]>([]);
  const [globalChartData, setGlobalChartData] = useState<
    UserQuizDataResponse[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const openModal = (user: UserResponse) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!id) return;

    const fetchCompanyMembers = async () => {
      try {
        const res = await getCompanyMembers(parseInt(id));
        setMembers(res);
      } catch (error: any) {
        toast.error("Error while fetching company members");
      }
    };

    const fetchUsersLastPass = async () => {
      try {
        const res = await getUsersLastPass(parseInt(id));
        SetLastPass(res);
      } catch (error: any) {
        toast.error("Error while fetching user last pass");
      }
    };

    fetchCompanyMembers();
    fetchUsersLastPass();
  }, [id, navigate]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchUsersRating = async () => {
      try {
        const res = await getUsersRating(Number(id));
        setGlobalChartData(res);
      } catch (error) {
        toast.error("Error while fetching global rating");
      }
    };

    fetchUsersRating();
  }, [id]);

  useEffect(() => {
    if (!members && !checkUserAction(members, user?.user_id ?? 0)) {
      navigate(routes.companyPage(id ?? 0));
    }
  }, [user, navigate, id, members]);

  const getUserLastPasses = (userId: number) => {
    if (!lastPass) return [];
    const userLastPass = lastPass.find((entry) => entry.user_id === userId);
    return userLastPass ? userLastPass.quizzes : [];
  };

  return (
    <Layout>
      <Helmet>
        <title>Company Quiz Statistics</title>
      </Helmet>

      {byIdStatus === ReduxStatus.LOADING ? (
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
        <>
          <h1 className={styles.header}>
            Average Scores of all users over time
          </h1>
          <div className={styles.chart}>
            <CompanyUserAnalytics data={globalChartData} />
          </div>
          <h1 className={styles.header}>Company members</h1>
          <div className={styles.usersList}>
            {members.map((member, index) => (
              <div key={index} className={styles.card}>
                <p className={styles.userName}>
                  {member.user_firstname !== ""
                    ? member.user_firstname
                    : "User"}
                </p>
                <p className={styles.userEmail}>{member.user_email}</p>

                <div className={styles.lastPasses}>
                  <h4>Last Passed Quizzes:</h4>
                  {getUserLastPasses(member.user_id).length > 0 ? (
                    <ul>
                      {getUserLastPasses(member.user_id).map((quiz) => (
                        <li key={quiz.quiz_id}>
                          Quiz ID: {quiz.quiz_id} - Passed at:{" "}
                          {new Date(quiz.last_quiz_pass_at).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No quizzes passed yet</p>
                  )}
                </div>

                <div className={styles.actions}>
                  <CustomLink
                    to={routes.userPage(member.user_id)}
                    text="Show user"
                  />
                  <Button
                    type="button"
                    text="Show stats"
                    onClick={() => openModal(member)}
                  />
                </div>
              </div>
            ))}
          </div>

          {selectedUser && (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <CompanyUserChart
                company_id={Number(id)}
                user_id={selectedUser.user_id}
              />
            </Modal>
          )}
        </>
      )}
    </Layout>
  );
};

export default CompanyStatisticsPage;
