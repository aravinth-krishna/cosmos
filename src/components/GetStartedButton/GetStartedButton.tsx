import Link from "next/link";
import styles from "./GetStartedButton.module.css";

const GetStartedButton = () => {
  return (
    <Link href="/signup" className={styles.link}>
      <button className={styles.button}>GET STARTED</button>
    </Link>
  );
};

export default GetStartedButton;
