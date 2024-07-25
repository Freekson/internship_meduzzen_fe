import React from "react";
import { Navigate } from "react-router-dom";
import { RootState } from "../../Store/store";
import { useSelector } from "react-redux";
import routes from "../../routes";

type TProps = {
  children: JSX.Element;
};

const UnauthenticatedRoute: React.FC<TProps> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.user);
  return token ? <Navigate to={routes.start} /> : children;
};

export default UnauthenticatedRoute;
