import { Dispatch } from "react";
import { NavigateFunction } from "react-router-dom";
import { resetState } from "../Store/user/slice";
import { AnyAction } from "@reduxjs/toolkit";

export const handleLogout = (
  dispatch: Dispatch<AnyAction>,
  navigate: NavigateFunction
) => {
  localStorage.removeItem("BearerToken");
  dispatch(resetState());
  navigate("/");
};
