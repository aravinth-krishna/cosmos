import styles from "./dashboard.module.css";
import Link from "next/link";

const DashboardSidebar = () => {
  return (
    <aside className={styles.dashboardSidebar}>
      <div className={styles.sidebarNavigation}>
        <ul>
          <li className={styles.navItem}>
            <Link href="/dashboard" className={styles.navLink}>
              {" "}
              {/* Assuming dashboard route is /dashboard */}
              Projects
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/dashboard/tasks" className={styles.navLinkPlaceholder}>
              {" "}
              {/* Placeholder link */}
              Tasks (Coming Soon)
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              href="/dashboard/calendar"
              className={styles.navLinkPlaceholder}
            >
              {" "}
              {/* Placeholder link */}
              Calendar (Coming Soon)
            </Link>
          </li>
          {/* Add more sidebar navigation items here */}
        </ul>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
