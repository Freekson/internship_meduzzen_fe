import { ActionResponse } from "../Types/api";
import api from "./api";

export const acceptUserInvitation = async (
  actionId: number
): Promise<ActionResponse> => {
  return api.get(`/action/${actionId}/accept_invite/`).then((res) => res.data);
};

export const declineUserInvitation = (actionId: number): Promise<void> => {
  return api.get(`/action/${actionId}/decline_action/`);
};

export const leaveCompany = (actionId: number): Promise<void> => {
  return api.get(`/action/${actionId}/leave_company/`);
};

export const acceptRequest = async (
  actionId: number
): Promise<ActionResponse> => {
  return api.get(`/action/${actionId}/accept_request/`).then((res) => res.data);
};

export const requestJoin = async (
  company_id: number
): Promise<ActionResponse> => {
  return api
    .get(`/action/create_from_user/company/${company_id}/`)
    .then((res) => res.data);
};

export const sendInvite = async (
  company_id: number,
  user_id: number
): Promise<ActionResponse> => {
  return api
    .get(`/action/create_from_company/${company_id}/user/${user_id}/`)
    .then((res) => res.data);
};

export const addAdmin = async (actionId: number): Promise<ActionResponse> => {
  return api.get(`/action/${actionId}/add_to_admin/`).then((res) => res.data);
};

export const deleteAdmin = async (
  actionId: number
): Promise<ActionResponse> => {
  return api
    .get(`/action/${actionId}/remove_from_admin/`)
    .then((res) => res.data);
};
