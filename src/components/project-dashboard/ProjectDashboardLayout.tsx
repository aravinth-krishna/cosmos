import styles from "./project-dashboard.module.css";
import ProjectDashboardNav from "./ProjectDashboardNav";
import { ReactNode } from "react";

interface ProjectDashboardLayoutProps {
  children: ReactNode;
  projectId: string; // Add projectId as prop
}

const ProjectDashboardLayout: React.FC<ProjectDashboardLayoutProps> = ({
  children,
  projectId,
}) => {
  return (
    <div className={styles.projectDashboardLayout}>
      <ProjectDashboardNav projectId={projectId} />{" "}
      {/* Pass projectId to Nav */}
      <main className={styles.projectDashboardMainContent}>{children}</main>
    </div>
  );
};

export default ProjectDashboardLayout;
