import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./RegisterPage.module.scss";
import { FormEvent, useState } from "react";
import { RegisterFormData } from "./types";
import api from "../../Api/api";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  const handleRegister = () => {
    loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let valid = true;
    const newErrors: RegisterFormData = {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    };

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
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
      valid = false;
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters long";
      valid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
      valid = false;
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters long";
      valid = false;
    }

    if (valid) {
      try {
        await api.post("/user", {
          user_email: formData.email,
          user_password: formData.password,
          user_password_repeat: formData.confirmPassword,
          user_firstname: formData.firstName,
          user_lastname: formData.lastName,
        });
        navigate("/login");
      } catch (error) {
        console.error("Registration failed:", error);
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
        <title>Register</title>
      </Helmet>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.form__title}>Register</h2>
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
        <div className={styles.form__group}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <div className={styles.error}>{errors.confirmPassword}</div>
          )}
        </div>
        <div className={styles.form__group}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <div className={styles.error}>{errors.firstName}</div>
          )}
        </div>
        <div className={styles.form__group}>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <div className={styles.error}>{errors.lastName}</div>
          )}
        </div>
        <button type="submit" className={styles.button}>
          Register
        </button>
        <button onClick={handleRegister} className={styles.button}>
          Register with Auth0
        </button>
      </form>
    </Layout>
  );
};

export default RegisterPage;
