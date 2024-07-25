import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import styles from "./ProtectedRoute.module.scss";
import { RootState, useAppDispatch } from "../../Store/store";
import { fetchUser } from "../../Store/user/slice";
import { ReduxStatus } from "../../Types/enums";
import routes from "../../routes";

type TProps = {
  children: JSX.Element;
};

const ProtectedRoute: React.FC<TProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { status, token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (token && status === ReduxStatus.INIT) {
      dispatch(fetchUser(""));
    }
  }, [dispatch, status, token]);

  if (status === "loading") {
    return (
      <div className={styles["loading"]}>
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#fb791b"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          visible={true}
        />
      </div>
    );
  }

  return token && status !== ReduxStatus.ERROR ? (
    children
  ) : (
    <Navigate to={routes.login} />
  );
};

export default ProtectedRoute;
