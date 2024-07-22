import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./RegisterPage.module.scss";
import { FormEvent, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../Api/user";
import { RegisterFormData } from "../../Types/api";
import { validateRegisterFormData } from "../../Utils/formValidation";
import { toast } from "react-toastify";
import InputLabel from "../../Components/InputLabel";
import Button from "../../Components/Button";

const RegisterPage = () => {
  const initialRegisterFormData: RegisterFormData = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  };

  const [formData, setFormData] = useState<RegisterFormData>(
    initialRegisterFormData
  );
  const [errors, setErrors] = useState<RegisterFormData>(
    initialRegisterFormData
  );

  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  const handleRegister = () => {
    loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { errors, isValid } = validateRegisterFormData(formData);

    if (isValid) {
      setErrors(initialRegisterFormData);
      try {
        await createUser(formData);
        navigate("/login");
      } catch (error: any) {
        toast.error(`${error.response.data.detail}`);
      }
    } else {
      setErrors(errors);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  return (
    <Layout>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.form__title}>Register</h2>
        <div className={styles.form__group}>
          <InputLabel
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className={styles.error}>{errors.email}</div>}
        </div>
        <div className={styles.form__group}>
          <InputLabel
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className={styles.error}>{errors.password}</div>
          )}
        </div>
        <div className={styles.form__group}>
          <InputLabel
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <div className={styles.error}>{errors.confirmPassword}</div>
          )}
        </div>
        <div className={styles.form__group}>
          <InputLabel
            label="First Name"
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <div className={styles.error}>{errors.firstName}</div>
          )}
        </div>
        <div className={styles.form__group}>
          <InputLabel
            label="Last Name"
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <div className={styles.error}>{errors.lastName}</div>
          )}
        </div>
        <div className={styles.btns}>
          <Button type="submit" text="Register" />
          <Button
            type="button"
            text="Register with Auth0"
            onClick={handleRegister}
          />
        </div>
      </form>
    </Layout>
  );
};

export default RegisterPage;
