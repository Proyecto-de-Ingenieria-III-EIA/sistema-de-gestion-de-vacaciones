import React from "react";
import styles from "./header.module.css";

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <h1>Absences by Los Arturos</h1>
            <img src={"/logoApp2.jpg"} alt="Logo de la app" className={styles.logo} />
        </header>
    );
};

export default Header;
