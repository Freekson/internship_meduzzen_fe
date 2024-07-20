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
  updateCompany,
  updateVisibility,
} from "../../Api/company";
import { toast } from "react-toastify";

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

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

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

  useEffect(() => {
    if (token && id) {
      dispatch(
        fetchCompanyById({
          token,
          company_id: Number(id),
        })
      );
    }
  }, [dispatch, id, token]);

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

  const handleDelete = async () => {
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
          token: token ?? "",
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
          token: token ?? "",
          company_id: Number(id),
        })
      );
      setIsInfoOpen(false);
      toast.success("Company updated successfully");
    } catch (error) {
      toast.error("Failed to update company.");
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
            <p>Visibility: {company.is_visible ? "Visible" : "Hidden"}</p>
            <p className={styles.description}>{company.company_description}</p>
            <p className={styles.city}>City: {company.company_city}</p>
            <p className={styles.phone}>Phone: {company.company_phone}</p>

            {company.company_links && company.company_links.length > 0 ? (
              <div className={styles.links}>
                <h3>Links:</h3>
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
              <p className={styles.noLinks}>No Links Available</p>
            )}
            <div className={styles.owner}>
              <h3>Owner:</h3>
              <div className={styles.ownerInfo}>
                {company.company_owner.user_avatar ? (
                  <img
                    src={company.company_owner.user_avatar}
                    alt={company.company_owner.user_firstname}
                    className={styles.ownerAvatar}
                  />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}
                <div className={styles.ownerDetails}>
                  <p>
                    {company.company_owner.user_firstname}{" "}
                    {company.company_owner.user_lastname}
                  </p>
                  <p>{company.company_owner.user_email}</p>
                </div>
              </div>
            </div>
            {user?.user_id === company.company_owner.user_id && (
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
            )}
          </div>
        </div>
      ) : (
        <div className={styles.error}>Company not found</div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        text="Are you sure you want to delete this company? This action is
            irreversible"
        btnText="Yes, Delete"
      />
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
          <InputLabel
            label="Company name"
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleInfoChange}
            required
          />
          <InputLabel
            label="Company title"
            type="text"
            id="company_title"
            name="company_title"
            value={formData.company_title}
            onChange={handleInfoChange}
          />
          <InputLabel
            label="Company description"
            type="text"
            id="company_description"
            name="company_description"
            value={formData.company_description}
            onChange={handleInfoChange}
          />
          <InputLabel
            label="Company city"
            type="text"
            id="company_city"
            name="company_city"
            value={formData.company_city}
            onChange={handleInfoChange}
          />
          <InputLabel
            label="Company phone"
            type="text"
            id="company_phone"
            name="company_phone"
            value={formData.company_phone}
            onChange={handleInfoChange}
          />
          <InputLabel
            label="Company Links (comma separated)"
            type="text"
            id="company_links"
            name="company_links"
            value={formData.company_links}
            onChange={handleInfoChange}
          />
          <Button type="submit" text="Change" />
        </form>
      </Modal>
    </Layout>
  );
};

export default CompanyPage;
