import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./UserProfilePage.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../Store/store";
import { FormEvent, useState } from "react";
import Button from "../../Components/Button";
import Modal from "../../Components/Modal";
import InputLabel from "../../Components/InputLabel";
import {
  deleteUser,
  updateAvatar,
  updatePassword,
  updateUser,
} from "../../Api/user";
import { toast } from "react-toastify";
import { fetchUser } from "../../Store/user/slice";
import { handleLogout } from "../../Utils/handleLogout";
import ConfirmModal from "../../Components/ConfirmModal";
import { formChangeUserFields } from "./static";

const UserProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userData: user, token } = useSelector(
    (state: RootState) => state.user
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openPassword = () => setIsPasswordOpen(true);
  const closePassword = () => setIsPasswordOpen(false);

  const initialUserLinks = user?.user_links || [];
  const initialUserLinksString = initialUserLinks.join(", ");

  const [formData, setFormData] = useState({
    user_id: user?.user_id || 0,
    user_email: user?.user_email || "",
    user_firstname: user?.user_firstname || "",
    user_lastname: user?.user_lastname || "",
    user_city: user?.user_city || "",
    user_phone: user?.user_phone || "",
    user_status: user?.user_status || "",
    user_links: initialUserLinksString,
  });

  const [passwordData, setPasswordData] = useState({
    user_password: "",
    user_password_repeat: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "user_links" ? value : value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userLinksArray = formData.user_links
      .split(",")
      .map((link) => link.trim())
      .filter((link) => link.length > 0);
    const updatedFormData = {
      ...formData,
      user_links: userLinksArray,
    };

    try {
      await updateUser(user?.user_id ?? 0, updatedFormData);
      await dispatch(fetchUser({ token: token ?? "" }));

      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { user_password, user_password_repeat } = passwordData;
    if (user_password.length < 6) {
      toast.warning("Password must be at least 6 characters long");
      return;
    }

    if (user_password !== user_password_repeat) {
      toast.warning("Passwords do not match");
      return;
    }

    try {
      await updatePassword(user?.user_id ?? 0, passwordData);
      setIsPasswordOpen(false);
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error("Failed to update password.");
    }
  };

  const handleFileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      toast.warning("Please select a file to upload.");
      return;
    }

    const avatarData = new FormData();
    avatarData.append("file", file);

    try {
      await updateAvatar(user?.user_id ?? 0, avatarData);
      await dispatch(fetchUser({ token: token ?? "" }));
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error("Failed to update avatar.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(user?.user_id ?? 0);
      toast.success("User deleted successfully");
      handleLogout(dispatch, navigate);
    } catch (error) {
      toast.error("Failed to delete user.");
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <div className={styles.wrapper}>
        {user && (
          <div className={styles.userProfile}>
            {user.user_avatar && (
              <img
                src={user.user_avatar}
                alt={`${user.user_firstname} ${user.user_lastname}`}
                className={styles.avatar}
              />
            )}
            <h1 className={styles.name}>
              {user.user_firstname} {user.user_lastname}
            </h1>
            <p className={styles.email}>Email: {user.user_email}</p>
            <p className={styles.city}>City: {user.user_city}</p>
            <p className={styles.phone}>Phone: {user.user_phone}</p>
            <p className={styles.status}>Status: {user.user_status}</p>
            {Array.isArray(user.user_links) && user.user_links.length > 0 && (
              <div className={styles.links}>
                <h2>Links</h2>
                <ul>
                  {user.user_links.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className={styles.btns}>
          <Button text="Change user" type="button" onClick={openModal} />
          <Button text="Change password" type="button" onClick={openPassword} />
          <Button
            onClick={() => setIsConfirmOpen(true)}
            text="Delete User"
            type="submit"
            variant="danger"
          />
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <form className={styles.form__wrapper} onSubmit={handleSubmit}>
            {formChangeUserFields.map((field) => (
              <InputLabel
                key={field.id}
                label={field.label}
                type={field.type}
                id={field.id}
                name={field.name}
                value={formData[field.name]}
                required={field.required}
                onChange={handleChange}
              />
            ))}
            <Button text="Change user" type="submit" />
          </form>
        </Modal>
        <Modal isOpen={isPasswordOpen} onClose={closePassword}>
          <form
            className={styles.form__wrapper}
            onSubmit={handlePasswordSubmit}
          >
            <InputLabel
              label="Password"
              id="user_password"
              name="user_password"
              type="password"
              value={passwordData.user_password}
              onChange={handlePasswordChange}
            />
            <InputLabel
              label="Confirm Password"
              id="user_password_repeat"
              name="user_password_repeat"
              type="password"
              value={passwordData.user_password_repeat}
              onChange={handlePasswordChange}
            />
            <Button text="Change password" type="submit" />
          </form>
        </Modal>
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleDelete}
          text="Are you sure you want to delete this user? This action is
            irreversible"
          btnText="Yes, Delete"
        />
        <form className={styles.form__wrapper} onSubmit={handleFileSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          <Button type="submit" text="Upload Avatar" variant="warning" />
        </form>

        <Link to="/users-list" className={styles.see_all}>
          See all users
        </Link>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
