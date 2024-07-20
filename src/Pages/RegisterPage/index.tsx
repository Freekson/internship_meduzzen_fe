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
import { registerFormFields } from "./static";

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
        {registerFormFields.map((field) => (
          <div className={styles.form__group} key={field.id}>
            <InputLabel
              label={field.label}
              id={field.id}
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={handleChange}
            />
            {errors[field.name] && (
              <div className={styles.error}>{errors[field.name]}</div>
            )}
          </div>
        ))}
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
