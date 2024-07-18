import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./RegisterPage.module.scss";
import { useState } from "react";
import { RegisterFormData } from "./types";
const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let valid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.username) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
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

    if (valid) {
      console.log("Form submitted:", formData);
      setErrors({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
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
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <div className={styles.error}>{errors.username}</div>
          )}
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
        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
    </Layout>
  );
};

export default RegisterPage;
