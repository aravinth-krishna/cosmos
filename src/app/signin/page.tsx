import SignIn from "@/components/SignIn/SignIn";
import styles from "./page.module.css";

const page = () => {
  return (
    <div className={styles.container}>
      <SignIn />
    </div>
  );
};

export default page;
