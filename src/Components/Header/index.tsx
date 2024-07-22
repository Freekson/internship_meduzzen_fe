import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "../../Store/store";
import { useSelector } from "react-redux";
import { ReduxStatus } from "../../Types/enums";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "../Button";
import { handleLogout } from "../../Utils/handleLogout";
const Header: React.FC = () => {
  const { status, userData } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated, logout } = useAuth0();

  return (
    <header className={styles.header}>
      <Link className={styles.header__logo} to="/">
        Meduzzen
      </Link>
      <nav className={styles.header__nav}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/company">Company</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.header__buttons}>
        {isAuthenticated ? (
          <>
            <span>{user?.given_name}</span>
            <Button type="button" text="Logout" onClick={() => logout()} />
          </>
        ) : status === ReduxStatus.SUCCESS && userData ? (
          <>
            <p className={styles.userName}>{userData.user_firstname}</p>
            <Button
              type="button"
              text="Logout"
              onClick={() => handleLogout(dispatch, navigate)}
            ></Button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.button}>
              Login
            </Link>
            <Link to="/register" className={styles.button}>
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
