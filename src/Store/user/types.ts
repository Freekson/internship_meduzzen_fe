import { Status } from "../../Types/enums";

export interface userState {
  token: string;
  userData: TUser | null;
  status: Status;
}

export type TUser = {
  user_id: number;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_avatar: string;
  user_status: string;
  user_city: string;
  user_phone: string;
  user_links: string[];
  is_superuser: boolean;
};

export type UserResponse = {
  status_code: number;
  detail: string;
  result: TUser;
};
