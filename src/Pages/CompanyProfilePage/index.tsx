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
import { Link } from "react-router-dom";
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
import { Link } from "react-router-dom";

const CompanyProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    userData: user,
    companies,
    token,
  } = useSelector((state: RootState) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
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
        dispatch(
          fetchCompanies({ token: token ?? "", user_id: user?.user_id ?? 0 })
        );
      } catch (error: any) {
        toast.error(`${error.response.data.detail}`);
      }
    } else {
      setErrors(errors);
    }
  };

  useEffect(() => {
    dispatch(
      fetchCompanies({ token: token ?? "", user_id: user?.user_id ?? 0 })
    );
  }, [dispatch, token, user]);

  return (
    <Layout>
      <Helmet>
        <title>Company Profile</title>
      </Helmet>

      <div className={styles.wrapper}>
        <h1>Your companies</h1>
        {companies && companies.length > 0 ? (
          companies.map((item) => (
            <div key={item.company_id} className={styles.companyCard}>
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
                <p className={styles.companyId}>ID: {item.company_id}</p>
                {item.company_title && (
                  <p className={styles.companyTitle}>
                    Title: {item.company_title}
                  </p>
                )}
                <p className={styles.companyVisibility}>
                  Visibility: {item.is_visible ? "Visible" : "Hidden"}
                </p>
                <p className={styles.companyAction}>Action: {item.action}</p>
              </div>
              <div className={styles.company_btns}>
                <Link
                  to={`/companies/${item.company_id}`}
                  className={styles.see_all}
                >
                  Show
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>You don't have companies</p>
        )}
        <div className={styles.btn_wrapper}>
          <Button text="Create company" type="button" onClick={openModal} />
          <Link to="/companies" className={styles.see_all}>
            See all companies
          </Link>
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
      </div>
    </Layout>
  );
};

export default CompanyProfilePage;
