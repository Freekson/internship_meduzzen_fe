import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";
const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.footer__nav}>
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
      <div className={styles.footer__social}>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <i className="fab fa-facebook-f"></i>
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <i className="fab fa-twitter"></i>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <i className="fab fa-linkedin-in"></i>
        </a>
      </div>
      <div className={styles.footer__contact}>
        <p>Email: freeksons@gmail.com</p>
        <p>Phone: +123 456 7890</p>
      </div>
      <div className={styles.footer__copyright}>
        &copy; {new Date().getFullYear()} Meduzzen. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
