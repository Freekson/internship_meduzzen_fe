import styles from "./Header.module.scss";
import { Link } from "react-router-dom";
import { RootState } from "../../Store/store";
import { useSelector } from "react-redux";
import { Status } from "../../Types/enums";
const Header: React.FC = () => {
  const { status, userData } = useSelector((state: RootState) => state.user);

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
        {status === Status.SUCCESS && userData ? (
          `${userData.user_email} ${userData.user_firstname}`
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
