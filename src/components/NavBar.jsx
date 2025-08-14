import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from './NavBar.module.css';
import KeeperLogo from './KeeperLogo';

function NavBar(props) {
  const navigate = useNavigate();
  const islogged = props.islogged;
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className={styles.navBar}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <KeeperLogo size={32} />
        <h1 className={styles.logo}>Keeper</h1>
      </div>
      {islogged && <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>}
    </nav>
  );
}

export default NavBar;
