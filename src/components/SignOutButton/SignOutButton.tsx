"use client";

import { useRouter } from "next/navigation";
import styles from "./SignOutButton.module.css";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  return (
    <button className={styles.button} onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
