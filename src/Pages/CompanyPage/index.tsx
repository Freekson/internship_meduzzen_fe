import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./CompanyPage.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  updateCompany,
  updateVisibility,
} from "../../Api/company";
import { toast } from "react-toastify";
import { UserResponse } from "../../Types/api";
import { addAdmin, deleteAdmin, leaveCompany } from "../../Api/actions";

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
  const [members, setMembers] = useState<UserResponse[]>([]);
  const [admins, setAdmins] = useState<UserResponse[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDeleteAdminOpen, setIsDeleteAdminOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

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
    const fetchCompanyMembers = async () => {
      if (!id) return;

      try {
        const response = await getCompanyMembers(parseInt(id));
        setMembers(response.data.result.users);
      } catch (error: any) {
        toast.dismiss();
      }
    };

    fetchCompanyMembers();
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

  const handleLeave = async (user_name: string, action_id: number) => {
    try {
      await leaveCompany(action_id);
      if (!id) return;

      try {
        const response = await getCompanyMembers(parseInt(id));
        setMembers(response.data.result.users);
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
        const response = await getCompanyMembers(parseInt(id));
        setMembers(response.data.result.users);
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
        const response = await getCompanyMembers(parseInt(id));
        setMembers(response.data.result.users);
      } catch (error) {
        toast.error("Error while fetching company members");
      }
      toast.success(`Member ${user_name} has been deleted from admins`);
    } catch (error) {
      toast.error(`Failed to delete admin: ${user_name}`);
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
            {user?.user_id === company.company_owner.user_id && (
              <div className={styles.actions}>
                <Link
                  to={`/company/${company.company_id}/requests`}
                  className={styles.showLink}
                >
                  See company requests
                </Link>
                <Link
                  to={`/company/${company.company_id}/invites`}
                  className={styles.showLink}
                >
                  See company invites
                </Link>
              </div>
            )}
            {members.length > 0 && (
              <h1 className={styles.header}>Company members</h1>
            )}
            <div className={styles.usersList}>
              {members.map((item, index) => (
                <div key={index} className={styles.userCard}>
                  <p className={styles.userName}>
                    {item.user_firstname !== "" ? item.user_firstname : "User"}
                  </p>

                  <p className={styles.userEmail}>{item.user_email}</p>
                  <Link
                    to={`/user/${item.user_id}`}
                    className={styles.userLink}
                  >
                    Show user
                  </Link>
                  {user?.user_id === company.company_owner.user_id &&
                    item.user_id !== company.company_owner.user_id && (
                      <div className={styles.actions}>
                        <Button
                          text="Delete user"
                          type="button"
                          variant="danger"
                          onClick={() => openConfirmModal(item)}
                        />
                        {item.action !== "admin" && (
                          <Button
                            text="Make admin"
                            type="button"
                            variant="warning"
                            onClick={() => openAdminModal(item)}
                          />
                        )}
                        {item.action === "admin" && (
                          <Button
                            text="Delete admin"
                            type="button"
                            variant="danger"
                            onClick={() => openDeleteAdminModal(item)}
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
              {admins.map((item, index) => (
                <div key={index} className={styles.userCard}>
                  <p className={styles.userName}>
                    {item.user_firstname !== "" ? item.user_firstname : "User"}
                  </p>

                  <p className={styles.userEmail}>{item.user_email}</p>
                  <Link
                    to={`/user/${item.user_id}`}
                    className={styles.userLink}
                  >
                    Show user
                  </Link>
                  {user?.user_id === company.company_owner.user_id &&
                    item.user_id !== company.company_owner.user_id && (
                      <div className={styles.actions}>
                        <Button
                          text="Delete user"
                          type="button"
                          variant="danger"
                          onClick={() => openConfirmModal(item)}
                        />
                        {item.action === "admin" && (
                          <Button
                            text="Delete admin"
                            type="button"
                            variant="danger"
                            onClick={() => openDeleteAdminModal(item)}
                          />
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
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
