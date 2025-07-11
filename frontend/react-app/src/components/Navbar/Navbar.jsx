import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-button">Главная</Link>
      <Link to="/about" className="nav-button">Для админов</Link>
      <Link to="/jira-report" className="nav-button">Jira Report</Link>
      <Link to="/contact" className="nav-button">Контакты</Link>
    </nav>
  );
};

export default Navbar;
