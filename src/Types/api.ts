export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  status_code: number;
  detail: string;
  result: LoginResult;
}

interface LoginResult {
  access_token: string;
  token_type: string;
}

export interface ChangePasswordParams {
  user_password: string;
  user_password_repeat: string;
}

export interface CreateCompanyFormData {
  company_name: string;
  is_visible: boolean;
}
