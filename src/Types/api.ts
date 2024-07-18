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
