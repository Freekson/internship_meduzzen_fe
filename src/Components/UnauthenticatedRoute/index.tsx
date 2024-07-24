import React from "react";
import { Navigate } from "react-router-dom";
import { RootState } from "../../Store/store";
import { useSelector } from "react-redux";

type TProps = {
  children: JSX.Element;
};

const UnauthenticatedRoute: React.FC<TProps> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.user);
  return token ? <Navigate to="/" /> : children;
};

export default UnauthenticatedRoute;
