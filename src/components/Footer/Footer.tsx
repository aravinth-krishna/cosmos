import styles from "./Footer.module.css";
import React from "react";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Cosmos. All rights reserved.</p>
    </div>
  );
};

export default Footer;
