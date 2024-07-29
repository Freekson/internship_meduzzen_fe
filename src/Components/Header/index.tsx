import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "../../Store/store";
import { useSelector } from "react-redux";
import { ReduxStatus } from "../../Types/enums";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "../Button";
import { handleLogout } from "../../Utils/handleLogout";
import CustomLink from "../CustomLink";
import routes from "../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { fetchUserNotifications } from "../../Store/user/slice";
const Header: React.FC = () => {
  const { status, userData, unreadNotifications } = useSelector(
    (state: RootState) => state.user
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated, logout } = useAuth0();

  useEffect(() => {
    if (userData && status === ReduxStatus.SUCCESS) {
      dispatch(fetchUserNotifications({ user_id: userData.user_id ?? 0 }));
    }
  }, [dispatch, status, userData]);

  return (
    <header className={styles.header}>
      <Link className={styles.header__logo} to={routes.start}>
        Meduzzen
      </Link>
      <nav className={styles.header__nav}>
        <ul>
          <li>
            <Link to={routes.start}>Home</Link>
          </li>
          <li>
            <Link to={routes.about}>About</Link>
          </li>
          <li>
            <Link to={routes.companyProfile}>Company</Link>
          </li>
          <li>
            <Link to={routes.userProfile}>Profile</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.header__buttons}>
        {isAuthenticated ? (
          <>
            <span>{user?.given_name}</span>
            <Button
              type="button"
              text="Logout"
              variant="danger"
              onClick={() => logout()}
            />
          </>
        ) : status === ReduxStatus.SUCCESS && userData ? (
          <>
            <div className={styles.notificationButton}>
              <CustomLink
                text={
                  <>
                    <FontAwesomeIcon icon={faBell} />{" "}
                    {unreadNotifications.length > 0 && (
                      <span className={styles.notificationCount}>
                        {unreadNotifications.length}
                      </span>
                    )}
                  </>
                }
                to={routes.userNotifications}
                variant="primary"
              />
            </div>
            <p className={styles.userName}>{userData.user_firstname}</p>
            <Button
              type="button"
              text="Logout"
              variant="danger"
              onClick={() => handleLogout(dispatch, navigate)}
            ></Button>
          </>
        ) : (
          <div className={styles.actions}>
            <CustomLink to={routes.login} text="Login" variant="primary" />
            <CustomLink
              to={routes.register}
              text="Register"
              variant="primary"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
