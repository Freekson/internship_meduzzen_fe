import { ReduxStatus } from "../../Types/enums";
import { TCompany, TPagination } from "../../Types/types";

export interface userState {
  token: string;
  userData: TUser | null;
  usersList: UsersResult | null;
  fetchedById: TUser[];
  companies: TCompany[];
  status: ReduxStatus;
  listStatus: ReduxStatus;
  fetchedByIdStatus: ReduxStatus;
  companiesStatus: ReduxStatus;
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

export type TListUserItem = {
  user_id: number;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_avatar: string;
};

export type UsersResult = {
  users: TListUserItem[];
  pagination: TPagination;
};
