import styles from "./project-dashboard.module.css";
import Link from "next/link";

interface ProjectDashboardNavProps {
  projectId: string;
  projectName: string;
}

const ProjectDashboardNav: React.FC<ProjectDashboardNavProps> = ({
  projectId,
  projectName,
}) => {
  return (
    <nav className={styles.projectDashboardNav}>
      <h2 className={styles.projectName}>{projectName}</h2>{" "}
      {/* Display project name */}
      <ul className={styles.navLinks}>
        <li>
          <Link
            href={`/dashboard/projects/${projectId}/tasks`}
            className={styles.navLink}
          >
            Tasks
          </Link>
        </li>
        <li>
          <Link
            href={`/dashboard/projects/${projectId}/timeline`}
            className={styles.navLink}
          >
            Timeline
          </Link>
        </li>
        <li>
          <Link
            href={`/dashboard/projects/${projectId}/team`}
            className={styles.navLink}
          >
            Team
          </Link>
        </li>
        <li>
          <Link
            href={`/dashboard/projects/${projectId}/details`}
            className={styles.navLink}
          >
            Details
          </Link>
        </li>
        <li>
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
