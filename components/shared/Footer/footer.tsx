import React from "react";
import styles from "./footer.module.css"; // Importamos los estilos

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>
        All rights reserved for <span className={styles.brand}>Los Arturos©</span>
      </p>
    </footer>
  );
};

export default Footer;