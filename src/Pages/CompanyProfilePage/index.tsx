import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./CompanyProfilePage.module.scss";
import { FormEvent, useEffect, useState } from "react";
import { RootState, useAppDispatch } from "../../Store/store";
import { fetchCompanies } from "../../Store/user/slice";
import { useSelector } from "react-redux";
import Button from "../../Components/Button";
import { CreateCompanyFormData } from "../../Types/api";
import { toast } from "react-toastify";
import InputLabel from "../../Components/InputLabel";
import { validateCreateCompanyFormData } from "../../Utils/formValidation";
import Modal from "../../Components/Modal";
import { createCompany } from "../../Api/company";
import { leaveCompany } from "../../Api/actions";
import ConfirmModal from "../../Components/ConfirmModal";
import { TCompany } from "../../Types/types";
import CustomLink from "../../Components/CustomLink";
import Notification from "../../Components/Notification";
import { ReduxStatus } from "../../Types/enums";
import { ThreeDots } from "react-loader-spinner";
import routes from "../../routes";

const CompanyProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    userData: user,
    companies,
    token,
    companiesStatus,
  } = useSelector((state: RootState) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<TCompany | null>(null);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const initialCompanyFormData: CreateCompanyFormData = {
    company_name: "",
    is_visible: true,
  };
  const [formData, setFormData] = useState<CreateCompanyFormData>(
    initialCompanyFormData
  );
  const [errors, setErrors] = useState<Partial<CreateCompanyFormData>>({});

  const openConfirmModal = (company: TCompany) => {
    setSelectedCompany(company);
    setIsConfirmOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVisibilityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, is_visible: event.target.checked });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { errors, isValid } = validateCreateCompanyFormData(formData);

    if (isValid) {
      setErrors({});
      try {
        await createCompany(formData);
        setIsModalOpen(false);
        toast.success("Company created");
        dispatch(fetchCompanies({ user_id: user?.user_id ?? 0 }));
      } catch (error: any) {
        toast.error(`${error.response.data.detail}`);
      }
    } else {
      setErrors(errors);
    }
  };

  const handleLeave = async (company_name: string, action_id: number) => {
    try {
      await leaveCompany(action_id);
      dispatch(fetchCompanies({ user_id: user?.user_id ?? 0 }));
      toast.success(`You leave company: ${company_name}`);
    } catch (error) {
      toast.error(`Failed to leave company: ${company_name}`);
    }
  };

  useEffect(() => {
    dispatch(fetchCompanies({ user_id: user?.user_id ?? 0 }));
  }, [dispatch, token, user]);

  return (
    <Layout>
      <Helmet>
        <title>Company Profile</title>
      </Helmet>

      <div className={styles.wrapper}>
        <h1>Your companies</h1>
        {companiesStatus === ReduxStatus.LOADING ? (
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#fb791b"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            visible={true}
          />
        ) : companies && companies.length > 0 ? (
          companies.map((company) => (
            <div key={company.company_id} className={styles.companyCard}>
              {company.company_avatar ? (
                <img
                  src={company.company_avatar}
                  alt={company.company_name}
                  className={styles.companyAvatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>No Avatar</div>
              )}
              <div className={styles.companyDetails}>
                <h3 className={styles.companyName}>{company.company_name}</h3>
                <p className={styles.companyId}>
                  <b>ID:</b> {company.company_id}
                </p>
                {company.company_title && (
                  <p className={styles.companyTitle}>
                    <b>Title:</b> {company.company_title}
                  </p>
                )}
                <p className={styles.companyVisibility}>
                  <b>Visibility:</b> {company.is_visible ? "Visible" : "Hidden"}
                </p>
                <p className={styles.companyAction}>
                  <b>Role:</b> {company.action}
                </p>
              </div>
              <div className={styles.company_btns}>
                <CustomLink
                  to={routes.companyPage(company.company_id)}
                  text="Show"
                />
                {company.action !== "owner" && (
                  <Button
                    text="Leave company"
                    type="button"
                    variant="danger"
                    onClick={() => openConfirmModal(company)}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <Notification message="You don't have companies" type="info" />
        )}
        <div className={styles.btn_wrapper}>
          <Button text="Create company" type="button" onClick={openModal} />
          <CustomLink to={routes.companiesList} text="See all companies" />
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.form__title}>Create Company</h2>
            <div className={styles.form__group}>
              <InputLabel
                label="Company Name"
                id="company_name"
                name="company_name"
                type="text"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
              {errors.company_name && (
                <div className={styles.error}>{errors.company_name}</div>
              )}
            </div>
            <div className={styles.form__group}>
              <label htmlFor="is_visible" className={styles.label}>
                <input
                  id="is_visible"
                  name="is_visible"
                  type="checkbox"
                  checked={formData.is_visible}
                  onChange={handleVisibilityChange}
                />
                Is Visible
              </label>
            </div>
            <div className={styles.btns}>
              <Button type="submit" text="Create" />
            </div>
          </form>
        </Modal>
        {selectedCompany && (
          <ConfirmModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={() => {
              handleLeave(
                selectedCompany.company_name,
                selectedCompany.action_id
              );
              setIsConfirmOpen(false);
            }}
            text={`Are you sure you want to leave ${selectedCompany.company_name}? This action is irreversible`}
            btnText="Yes, Leave"
          />
        )}
      </div>
    </Layout>
  );
};

export default CompanyProfilePage;
