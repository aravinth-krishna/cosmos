import styles from "./project-dashboard.module.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Import useRouter and usePathname

interface ProjectDashboardNavProps {
  projectId: string;
}

const ProjectDashboardNav: React.FC<ProjectDashboardNavProps> = ({
  projectId,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname.startsWith(path); // Check if current path starts with the tab's path
  };

  return (
    <nav className={styles.projectDashboardNav}>
      <ul className={styles.projectNavList}>
        <li
          className={`${styles.navItem} ${
            isActive(`/dashboard/projects/${projectId}/tasks`)
              ? styles.activeNavItem
              : ""
          }`}
        >
          <Link
            href={`/dashboard/projects/${projectId}/tasks`}
            className={styles.navLink}
          >
            Tasks
          </Link>
        </li>
        <li
          className={`${styles.navItem} ${
            isActive(`/dashboard/projects/${projectId}/timeline`)
              ? styles.activeNavItem
              : ""
          }`}
        >
          <Link
            href={`/dashboard/projects/${projectId}/timeline`}
            className={styles.navLink}
          >
            Timeline
          </Link>
        </li>
        <li
          className={`${styles.navItem} ${
            isActive(`/dashboard/projects/${projectId}/team`)
              ? styles.activeNavItem
              : ""
          }`}
        >
          <Link
            href={`/dashboard/projects/${projectId}/team`}
            className={styles.navLink}
          >
            Team
          </Link>
        </li>
        <li
          className={`${styles.navItem} ${
            isActive(`/dashboard/projects/${projectId}/details`)
              ? styles.activeNavItem
              : ""
          }`}
        >
          <Link
            href={`/dashboard/projects/${projectId}/details`}
            className={styles.navLink}
          >
            Details
          </Link>
        </li>
        <li
          className={`${styles.navItem} ${
            isActive(`/dashboard/projects/${projectId}/chat`)
              ? styles.activeNavItem
              : ""
          }`}
        >
          <Link
            href={`/dashboard/projects/${projectId}/chat`}
            className={styles.navLink}
          >
            Chat
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default ProjectDashboardNav;
