import React from "react";
import styles from "./header.module.css";

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <h1>TimeOff</h1>
            <img src={"/logoApp.jpg"} alt="Logo de la app" className={styles.logo} />
        </header>
    );
};

export default Header;
