import { ReduxStatus } from "../../Types/enums";

export interface userState {
  token: string;
  userData: TUser | null;
  usersList: UsersResult | null;
  fetchedById: TUser[];
  status: ReduxStatus;
  listStatus: ReduxStatus;
  fetchedByIdStatus: ReduxStatus;
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

export type TListUserItem = {
  user_id: number;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_avatar: string;
};

export type TPagination = {
  current_page: number;
  total_page: number;
  total_results: number;
};

export type UsersResult = {
  users: TListUserItem[];
  pagination: TPagination;
};

export type UsersListResponse = {
  status_code: number;
  detail: string;
  result: UsersResult;
};
