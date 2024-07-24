interface ChangeUserFormData {
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_city: string;
  user_phone: string;
  user_status: string;
  user_links: string;
}

interface ChangeUserFormField {
  label: string;
  type: string;
  id: keyof ChangeUserFormData;
  name: keyof ChangeUserFormData;
  required?: boolean;
}

export const formChangeUserFields: ChangeUserFormField[] = [
  {
    label: "Email",
    type: "email",
    id: "user_email",
    name: "user_email",
    required: true,
  },
  {
    label: "First Name",
    type: "text",
    id: "user_firstname",
    name: "user_firstname",
    required: true,
  },
  {
    label: "Last Name",
    type: "text",
    id: "user_lastname",
    name: "user_lastname",
    required: true,
  },
  { label: "City", type: "text", id: "user_city", name: "user_city" },
  { label: "Phone", type: "tel", id: "user_phone", name: "user_phone" },
  { label: "Status", type: "text", id: "user_status", name: "user_status" },
  {
    label: "Links (comma separated)",
    type: "text",
    id: "user_links",
    name: "user_links",
  },
];
