import styles from "./dashboard.module.css";
import DashboardTopNav from "./DashboardTopNav";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className={styles.dashboardLayout}>
      <DashboardTopNav />
      <DashboardSidebar />
      <main className={styles.dashboardMainContent}>{children}</main>
    </div>
  );
};

export default DashboardLayout;
