import styles from "./Layout.module.scss";
import Header from "../Header";
import Footer from "../Footer";
import { RootState, useAppDispatch } from "../../Store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchUser } from "../../Store/user/slice";
import { Status } from "../../Types/enums";

type TProps = {
  children: React.ReactNode;
};

const Layout: React.FC<TProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("BearerToken");
  const { status } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (token && status === Status.INIT) {
      dispatch(fetchUser({ token }));
    }
  }, [dispatch, status, token]);
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
