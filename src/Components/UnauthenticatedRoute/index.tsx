import React from "react";
import { Navigate } from "react-router-dom";

type TProps = {
  children: JSX.Element;
};

const UnauthenticatedRoute: React.FC<TProps> = ({ children }) => {
  const tokenLS = localStorage.getItem("BearerToken");

  return tokenLS ? <Navigate to="/" /> : children;
};

export default UnauthenticatedRoute;
