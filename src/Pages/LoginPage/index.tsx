import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./LoginPage.module.scss";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { LoginFormData } from "../../Types/api";
import { loginUser } from "../../Api/user";
import { validateLoginFormData } from "../../Utils/formValidation";
import { toast } from "react-toastify";
import InputLabel from "../../Components/InputLabel";
import Button from "../../Components/Button";

const LoginPage = () => {
  const initialLoginFormData: LoginFormData = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState<LoginFormData>(initialLoginFormData);
  const [errors, setErrors] = useState<LoginFormData>(initialLoginFormData);

  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  const handleLoginWithRedirect = () => {
    loginWithRedirect();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { errors, isValid } = validateLoginFormData(formData);

    if (isValid) {
      setErrors(initialLoginFormData);
      try {
        const response = await loginUser(formData);
        localStorage.setItem("BearerToken", response.result.access_token);
        navigate("/profile");
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
        <title>Login</title>
      </Helmet>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.form__title}>Login</h2>
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
        <div className={styles.btns}>
          <Button type="submit" text="Login" />
          <Button
            type="button"
            text="Login with Auth0"
            onClick={handleLoginWithRedirect}
          />
        </div>
      </form>
    </Layout>
  );
};

export default LoginPage;
