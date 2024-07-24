import { UserResponse } from "../Types/api";

export const checkUserAction = (
  members: UserResponse[],
  user_id: number
): boolean => {
  const member = members.find((member) => member.user_id === user_id);
  return member
    ? member.action === "admin" || member.action === "owner"
    : false;
};
