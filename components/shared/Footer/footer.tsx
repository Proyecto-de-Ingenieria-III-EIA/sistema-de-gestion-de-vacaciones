import React from "react";
import styles from "./footer.module.css"; // Importamos los estilos

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>
      © {new Date().getFullYear()} <span className={styles.brand}>Los Arturos</span> All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;