import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./LoginPage.module.scss";
import { useState } from "react";
import { LoginFormData } from "./types";

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password in to short";
      valid = false;
    }

    if (valid) {
      console.log("Form submitted:", formData);
      setErrors({
        email: "",
        password: "",
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
            required
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
      </form>
    </Layout>
  );
};

export default LoginPage;
