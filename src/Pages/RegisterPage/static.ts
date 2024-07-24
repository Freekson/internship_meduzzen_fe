interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface RegisterFormField {
  label: string;
  id: keyof RegisterFormData;
  name: keyof RegisterFormData;
  type: string;
}

export const registerFormFields: RegisterFormField[] = [
  { label: "Email", id: "email", name: "email", type: "email" },
  { label: "Password", id: "password", name: "password", type: "password" },
  {
    label: "Confirm Password",
    id: "confirmPassword",
    name: "confirmPassword",
    type: "password",
  },
  { label: "First Name", id: "firstName", name: "firstName", type: "text" },
  { label: "Last Name", id: "lastName", name: "lastName", type: "text" },
];
