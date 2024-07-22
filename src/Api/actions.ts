import api from "./api";

export const acceptUserInvitation = (actionId: number) => {
  return api.get(`/action/${actionId}/accept_invite/`);
};

export const declineUserInvitation = (actionId: number) => {
  return api.get(`/action/${actionId}/decline_action/`);
};

export const leaveCompany = (actionId: number) => {
  return api.get(`/action/${actionId}/leave_company/`);
};

export const acceptRequest = (actionId: number) => {
  return api.get(`/action/${actionId}/accept_request/`);
};

export const requestJoin = (company_id: number) => {
  return api.get(`/action/create_from_user/company/${company_id}/`);
};

export const sendInvite = (company_id: number, user_id: number) => {
  return api.get(`/action/create_from_company/${company_id}/user/${user_id}/`);
};
