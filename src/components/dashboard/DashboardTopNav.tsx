import styles from "./dashboard.module.css";
import SignOutButton from "@/components/SignOutButton/SignOutButton"; // Assuming your SignOutButton is here

const DashboardTopNav = () => {
  return (
    <nav className={styles.dashboardTopNav}>
      <div className={styles.navBrand}>Cosmos</div>
      <div className={styles.navActions}>
        {/* Profile Dropdown would go here in a real app */}
        <SignOutButton />
      </div>
    </nav>
  );
};

export default DashboardTopNav;
