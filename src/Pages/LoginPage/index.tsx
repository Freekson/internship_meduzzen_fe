import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./LoginPage.module.scss";
import { useState } from "react";
import { LoginFormData } from "./types";
import api from "../../Api/api";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password is to short";
      valid = false;
    }

    if (valid) {
      try {
        const response = await api.post("/auth/login", {
          user_email: formData.email,
          user_password: formData.password,
        });

        localStorage.setItem("BearerToken", response.data.result.access_token);
        navigate("/profile");
      } catch (error) {
        console.error("Login error:", error);
      }
    } else {
      setErrors(newErrors);
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className={styles.error}>{errors.email}</div>}
        </div>
        <div className={styles.form__group}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className={styles.error}>{errors.password}</div>
          )}
        </div>
        <button type="submit" className={styles.button}>
          Login
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => loginWithRedirect()}
        >
          Login with Auth0
        </button>
      </form>
    </Layout>
  );
};

export default LoginPage;
