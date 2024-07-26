import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./CompanyPage.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, useAppDispatch } from "../../Store/store";
import { useSelector } from "react-redux";
import { FormEvent, useEffect, useState } from "react";
import { fetchCompanyById } from "../../Store/company/slice";
import { ReduxStatus } from "../../Types/enums";
import { ThreeDots } from "react-loader-spinner";
import Button from "../../Components/Button";
import ConfirmModal from "../../Components/ConfirmModal";
import Modal from "../../Components/Modal";
import InputLabel from "../../Components/InputLabel";
import {
  deleteCompany,
  getCompanyMembers,
  getCompanyQuizzes,
  updateCompany,
  updateVisibility,
} from "../../Api/company";
import { toast } from "react-toastify";
import { CompanyQuizzesResponse, UserResponse } from "../../Types/api";
import { addAdmin, deleteAdmin, leaveCompany } from "../../Api/actions";
import {
  QuizFormData,
  quizFormFields,
  updateCompanyFormFields,
} from "./static";
import CustomLink from "../../Components/CustomLink";
import Notification from "../../Components/Notification";
import QuizForm from "../../Components/QuizForm";
import { createQuiz, deleteQuiz, updateQuiz } from "../../Api/quizzes";
import { IQuiz } from "../../Types/types";
import { checkUserAction } from "../../Utils/checkUserAction";
import routes from "../../routes";

const CompanyPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { fetchedById, byIdStatus } = useSelector(
    (state: RootState) => state.company
  );
  const { userData: user, token } = useSelector(
    (state: RootState) => state.user
  );

  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDeleteAdminOpen, setIsDeleteAdminOpen] = useState(false);

  const [members, setMembers] = useState<UserResponse[]>([]);
  const [admins, setAdmins] = useState<UserResponse[]>([]);
  const [quizzes, setQuizzes] = useState<CompanyQuizzesResponse[]>([]);

  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isDeleteQuizOpen, setIsDeleteQuizOpen] = useState(false);
  const [isEditQuizOpen, setIsEditQuizOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [selectedQuizzes, setSelectedQuizzes] =
    useState<CompanyQuizzesResponse | null>(null);
  const isAdminOrOwner = checkUserAction(members, user?.user_id ?? 0);

  const openConfirmModal = (user: UserResponse) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const openAdminModal = (user: UserResponse) => {
    setSelectedUser(user);
    setIsAdminOpen(true);
  };

  const openDeleteAdminModal = (user: UserResponse) => {
    setSelectedUser(user);
    setIsDeleteAdminOpen(true);
  };

  const openDeleteQuizModal = (quiz: CompanyQuizzesResponse) => {
    setSelectedQuizzes(quiz);
    setIsDeleteQuizOpen(true);
  };

  const openEditQuizModal = (quiz: CompanyQuizzesResponse) => {
    setSelectedQuizzes(quiz);
    setQuizData({
      quiz_name: quiz.quiz_name,
      quiz_title: quiz.quiz_title,
      quiz_description: quiz.quiz_description,
      quiz_frequency: 0,
    });
    setIsEditQuizOpen(true);
  };

  const company =
    fetchedById.find((company) => company.company_id === Number(id)) || null;

  const [isVisible, setIsVisible] = useState(company?.is_visible ?? false);

  const initialUserLinks = user?.user_links || [];
  const initialCompanyLinksString = initialUserLinks.join(", ");
  const [formData, setFormData] = useState({
    company_name: company?.company_name || "",
    company_title: company?.company_title || "",
    company_description: company?.company_description || "",
    company_city: company?.company_city || "",
    company_phone: company?.company_phone || "",
    company_links: initialCompanyLinksString,
  });

  const [quizData, setQuizData] = useState<QuizFormData>({
    quiz_name: "",
    quiz_title: "",
    quiz_description: "",
    quiz_frequency: 0,
  });

  useEffect(() => {
    if (token && id) {
      dispatch(
        fetchCompanyById({
          company_id: Number(id),
        })
      );
    }
  }, [dispatch, id, token]);

  useEffect(() => {
    const fetchCompanyMembers = async () => {
      if (!id) return;

      try {
        const res = await getCompanyMembers(parseInt(id));
        setMembers(res);
      } catch (error: any) {
        toast.dismiss();
      }
    };

    const fetchCompanyQuizzes = async () => {
      if (!id) return;

      try {
        const res = await getCompanyQuizzes(parseInt(id));
        setQuizzes(res);
      } catch (error: any) {
        toast.dismiss();
      }
    };

    fetchCompanyMembers();
    fetchCompanyQuizzes();
  }, [id, token]);

  useEffect(() => {
    setIsVisible(company?.is_visible ?? false);
    setFormData({
      company_name: company?.company_name || "",
      company_title: company?.company_title || "",
      company_description: company?.company_description || "",
      company_city: company?.company_city || "",
      company_phone: company?.company_phone || "",
      company_links: (company?.company_links || []).join(", "),
    });
  }, [company]);

  useEffect(() => {
    const adminUsers = members.filter((member) => member.action === "admin");
    setAdmins(adminUsers);
  }, [members]);

  const handleVisibilityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsVisible(event.target.checked);
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleQuizChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setQuizData((prevData) => ({
      ...prevData,
      [name]: name === "quiz_frequency" ? Number(value) : value,
    }));
  };

  const handleUserDelete = async () => {
    try {
      await deleteCompany(company?.company_id ?? 0);
      toast.success("Company deleted successfully");
      navigate("/company");
    } catch (error) {
      toast.error("Failed to delete company.");
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const handleSubmitVisibility = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateVisibility(company?.company_id ?? 0, isVisible);
      await dispatch(
        fetchCompanyById({
          company_id: Number(id),
        })
      );
      setIsVisibilityOpen(false);
      toast.success("Visibility updated successfully");
    } catch (error) {
      toast.error("Failed to update visibility.");
    }
  };

  const handleInfoSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const companyLinksArray = formData.company_links
      .split(",")
      .map((link) => link.trim())
      .filter((link) => link.length > 0);
    const updatedFormData = {
      ...formData,
      company_links: companyLinksArray,
    };

    try {
      await updateCompany(company?.company_id ?? 0, updatedFormData);
      await dispatch(
        fetchCompanyById({
          company_id: Number(id),
        })
      );
      setIsInfoOpen(false);
      toast.success("Company updated successfully");
    } catch (error) {
      toast.error("Failed to update company.");
    }
  };

  const handleLeave = async (user_name: string, action_id: number) => {
    try {
      await leaveCompany(action_id);
      if (!id) return;

      try {
        const res = await getCompanyMembers(parseInt(id));
        setMembers(res);
      } catch (error) {
        toast.error("Error while fetching company members");
      }
      toast.success(`Member ${user_name} has been deleted`);
    } catch (error) {
      toast.error(`Failed to delete member: ${user_name}`);
    }
  };

  const handleMakeAdmin = async (user_name: string, action_id: number) => {
    try {
      await addAdmin(action_id);
      if (!id) return;

      try {
        const res = await getCompanyMembers(parseInt(id));
        setMembers(res);
      } catch (error) {
        toast.error("Error while fetching company members");
      }
      toast.success(`Member ${user_name} has been promoted to admin`);
    } catch (error) {
      toast.error(`Failed to promote member: ${user_name}`);
    }
  };

  const handleDeleteAdmin = async (user_name: string, action_id: number) => {
    try {
      await deleteAdmin(action_id);
      if (!id) return;

      try {
        const res = await getCompanyMembers(parseInt(id));
        setMembers(res);
      } catch (error) {
        toast.error("Error while fetching company members");
      }
      toast.success(`Member ${user_name} has been deleted from admins`);
    } catch (error) {
      toast.error(`Failed to delete admin: ${user_name}`);
    }
  };

  const handleSubmitQuiz = async (quiz: IQuiz) => {
    try {
      const response = await createQuiz(quiz);
      toast.success(`Quiz Created Successfully: ${response}`);
      setIsQuizOpen(false);

      if (!id) return;

      try {
        const res = await getCompanyQuizzes(parseInt(id));
        setQuizzes(res);
      } catch (error: any) {
        toast.dismiss();
      }
    } catch (error) {
      toast.error("Error Creating Quiz");
    }
  };

  const handleDeleteQuiz = async (quiz_id: number) => {
    try {
      await deleteQuiz(quiz_id);
      if (!id) return;

      try {
        const res = await getCompanyQuizzes(parseInt(id));
        setQuizzes(res);
      } catch (error) {
        toast.error("Error while fetching quizzes");
      }
      toast.success(`Quiz ${quiz_id} has been deleted`);
    } catch (error) {
      toast.error(`Failed to delete quiz: ${quiz_id}`);
    }
  };

  const handleEditQuiz = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEditQuizOpen(false);

    try {
      await updateQuiz(currentQuiz, quizData);
      setIsEditQuizOpen(false);

      if (!id) return;
      try {
        const res = await getCompanyQuizzes(parseInt(id));
        setQuizzes(res);
      } catch (error: any) {
        toast.dismiss();
      }
      toast.success("Quiz updated successfully");
    } catch (error) {
      toast.error("Failed to update quiz.");
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{company?.company_name}</title>
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
      ) : company ? (
        <div className={styles.container}>
          <div className={styles.avatarContainer}>
            {company.company_avatar ? (
              <img
                src={company.company_avatar}
                alt={company.company_name}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.noImage}>No Image</div>
            )}
          </div>
          <div className={styles.info}>
            <h1 className={styles.name}>{company.company_name}</h1>
            {company.company_title && (
              <h2 className={styles.title}>{company.company_title}</h2>
            )}
            <p>
              <b>Visibility:</b> {company.is_visible ? "Visible" : "Hidden"}
            </p>
            <p className={styles.description}>{company.company_description}</p>
            {company.company_city && (
              <p className={styles.city}>
                <b>City:</b> {company.company_city}
              </p>
            )}
            {company.company_phone && (
              <p className={styles.phone}>
                <b>Phone</b>: {company.company_phone}
              </p>
            )}

            {company.company_links && company.company_links.length > 0 ? (
              <div className={styles.links}>
                <b>Links:</b>
                <ul>
                  {company.company_links.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <b className={styles.noLinks}>No Links Available</b>
            )}
            <div className={styles.owner}>
              <h1>Owner:</h1>
              <div className={styles.ownerInfo}>
                {company.company_owner.user_avatar ? (
                  <img
                    src={company.company_owner.user_avatar}
                    alt={company.company_owner.user_firstname}
                    className={styles.ownerAvatar}
                  />
                ) : (
                  <div className={styles.noOwnerImage}>No Image</div>
                )}
                <div className={styles.ownerDetails}>
                  <b>
                    {company.company_owner.user_firstname}{" "}
                    {company.company_owner.user_lastname}
                  </b>
                  <p>{company.company_owner.user_email}</p>
                </div>
              </div>
            </div>
            {user?.user_id === company.company_owner.user_id && (
              <>
                <div className={styles.actions}>
                  <Button
                    text="Edit info"
                    type="button"
                    variant="warning"
                    onClick={() => setIsInfoOpen(true)}
                  />
                  <Button
                    text="Edit visibility"
                    type="button"
                    variant="warning"
                    onClick={() => setIsVisibilityOpen(true)}
                  />
                  <Button
                    text="Delete"
                    type="button"
                    variant="danger"
                    onClick={() => setIsConfirmOpen(true)}
                  />
                </div>
                <div className={styles.actions}>
                  <CustomLink
                    to={routes.companyRequests(company.company_id)}
                    text="See company requests"
                  />
                  <CustomLink
                    to={routes.companyInvites(company.company_id)}
                    text="See company invites"
                  />
                </div>
              </>
            )}
            {isAdminOrOwner && (
              <div className={styles.actions}>
                <Button
                  text="Create Quiz"
                  type="button"
                  variant="success"
                  onClick={() => setIsQuizOpen(true)}
                />
              </div>
            )}
            {members.length > 0 && (
              <h1 className={styles.header}>Company members</h1>
            )}
            <div className={styles.usersList}>
              {members.map((member, index) => (
                <div key={index} className={styles.card}>
                  <p className={styles.userName}>
                    {member.user_firstname !== ""
                      ? member.user_firstname
                      : "User"}
                  </p>

                  <p className={styles.userEmail}>{member.user_email}</p>
                  <CustomLink
                    to={routes.userPage(member.user_id)}
                    text="Show user"
                  />
                  {user?.user_id === company.company_owner.user_id &&
                    member.user_id !== company.company_owner.user_id && (
                      <div className={styles.actions}>
                        <Button
                          text="Delete user"
                          type="button"
                          variant="danger"
                          onClick={() => openConfirmModal(member)}
                        />
                        {member.action !== "admin" && (
                          <Button
                            text="Make admin"
                            type="button"
                            variant="warning"
                            onClick={() => openAdminModal(member)}
                          />
                        )}
                        {member.action === "admin" && (
                          <Button
                            text="Delete admin"
                            type="button"
                            variant="danger"
                            onClick={() => openDeleteAdminModal(member)}
                          />
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
            {admins.length > 0 && (
              <h1 className={styles.header}>Company admins</h1>
            )}
            <div className={styles.usersList}>
              {admins.map((admin, index) => (
                <div key={index} className={styles.card}>
                  <p className={styles.userName}>
                    {admin.user_firstname !== ""
                      ? admin.user_firstname
                      : "User"}
                  </p>
                  <p className={styles.userEmail}>{admin.user_email}</p>
                  <CustomLink
                    to={routes.userPage(admin.user_id)}
                    text=" Show user"
                  />
                  {user?.user_id === company.company_owner.user_id && (
                    <div className={styles.actions}>
                      <Button
                        text="Delete user"
                        type="button"
                        variant="danger"
                        onClick={() => openConfirmModal(admin)}
                      />
                      {admin.action !== "admin" && (
                        <Button
                          text="Make admin"
                          type="button"
                          variant="warning"
                          onClick={() => openAdminModal(admin)}
                        />
                      )}
                      {admin.action === "admin" && (
                        <Button
                          text="Delete admin"
                          type="button"
                          variant="danger"
                          onClick={() => openDeleteAdminModal(admin)}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {quizzes.length > 0 && <h1 className={styles.header}>Quizzes</h1>}
            <div className={styles.usersList}>
              {quizzes.map((item, index) => (
                <div key={index} className={styles.card}>
                  <p className={styles.quizName}>{item.quiz_name}</p>
                  <p className={styles.quizTitle}>
                    {item.quiz_title ? item.quiz_title : "No title"}
                  </p>
                  <p className={styles.quizDescription}>
                    {item.quiz_description
                      ? item.quiz_description
                      : "No description"}
                  </p>
                  <CustomLink
                    to={routes.quizPage(item.quiz_id)}
                    text="Start Quiz"
                    variant="primary"
                  />
                  {isAdminOrOwner && (
                    <div className={styles.actions}>
                      <Button
                        text="Delete quiz"
                        type="button"
                        variant="danger"
                        onClick={() => openDeleteQuizModal(item)}
                      />
                      <Button
                        text="Edit quiz"
                        type="button"
                        variant="warning"
                        onClick={() => {
                          openEditQuizModal(item);
                          setCurrentQuiz(item.quiz_id);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Notification message="Company not found" type="error" />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleUserDelete}
        text="Are you sure you want to delete this company? This action is
            irreversible"
        btnText="Yes, Delete"
      />
      {selectedUser && (
        <>
          <ConfirmModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={() => {
              handleLeave(selectedUser.user_firstname, selectedUser.action_id);
              setIsDeleteOpen(false);
            }}
            text={`Are you sure you want to delete ${selectedUser.user_firstname} from you company? `}
            btnText="Yes, delete"
          />
          <ConfirmModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            onConfirm={() => {
              handleMakeAdmin(
                selectedUser.user_firstname,
                selectedUser.action_id
              );
              setIsAdminOpen(false);
            }}
            text={`Are you sure you want to make ${selectedUser.user_firstname} admin in you company? `}
            btnText="Yes, promote"
          />
          <ConfirmModal
            isOpen={isDeleteAdminOpen}
            onClose={() => setIsDeleteAdminOpen(false)}
            onConfirm={() => {
              handleDeleteAdmin(
                selectedUser.user_firstname,
                selectedUser.action_id
              );
              setIsDeleteAdminOpen(false);
            }}
            text={`Are you sure you want to delete ${selectedUser.user_firstname} from admins? `}
            btnText="Yes, delete from admins"
          />
        </>
      )}
      {selectedQuizzes && (
        <>
          <ConfirmModal
            isOpen={isDeleteQuizOpen}
            onClose={() => setIsDeleteQuizOpen(false)}
            onConfirm={() => {
              handleDeleteQuiz(selectedQuizzes.quiz_id);
              setIsDeleteQuizOpen(false);
            }}
            text={`Are you sure you want to delete quest "${selectedQuizzes.quiz_name}"? `}
            btnText="Yes, delete"
          />
          <Modal
            isOpen={isEditQuizOpen}
            onClose={() => setIsEditQuizOpen(false)}
          >
            <form className={styles.form__wrapper} onSubmit={handleEditQuiz}>
              {quizFormFields.map((field) => (
                <div className={styles.form__group} key={field.id}>
                  <InputLabel
                    label={field.label}
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    value={
                      quizData[field.name] !== null
                        ? quizData[field.name].toString()
                        : ""
                    }
                    onChange={handleQuizChange}
                    required={field.required}
                  />
                </div>
              ))}
              <div className={styles.form__group}>
                <InputLabel
                  label="Quiz Frequency (days)"
                  id="quiz_frequency"
                  name="quiz_frequency"
                  type="number"
                  value={quizData.quiz_frequency}
                  onChange={handleQuizChange}
                  min={1}
                  required
                />
              </div>
              <Button type="submit" text="Submit" />
            </form>
          </Modal>
        </>
      )}
      <Modal
        isOpen={isVisibilityOpen}
        onClose={() => setIsVisibilityOpen(false)}
      >
        <form
          className={styles.form__wrapper}
          onSubmit={handleSubmitVisibility}
        >
          <label htmlFor="is_visible" className={styles.label}>
            <input
              id="is_visible"
              name="is_visible"
              type="checkbox"
              checked={isVisible}
              onChange={handleVisibilityChange}
            />
            Is Visible
          </label>
          <Button type="submit" text="Change" />
        </form>
      </Modal>
      <Modal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)}>
        <form className={styles.form__wrapper} onSubmit={handleInfoSubmit}>
          {updateCompanyFormFields.map((field) => (
            <div className={styles.form__group} key={field.id}>
              <InputLabel
                label={field.label}
                id={field.id}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleInfoChange}
                required={field.required}
              />
            </div>
          ))}
          <Button type="submit" text="Change" />
        </form>
      </Modal>
      <Modal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)}>
        <QuizForm
          onSubmit={handleSubmitQuiz}
          onClose={() => setIsQuizOpen(false)}
          company_id={company?.company_id ?? 0}
        />
      </Modal>
    </Layout>
  );
};

export default CompanyPage;
