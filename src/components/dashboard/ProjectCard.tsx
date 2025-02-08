import styles from "./dashboard.module.css";
import Link from "next/link"; // Import Link

interface ProjectCardProps {
  project: {
    // Assuming you have ProjectData interface defined in ProjectList.tsx or elsewhere
    id: string;
    name: string;
    description?: string;
    status: string;
    progress: number;
    endDate?: string;
    teamMembers: string[];
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className={styles.projectCardLink}
    >
      {" "}
      {/* Use Link and wrap card content */}
      <div className={styles.projectCard}>
        {" "}
        {/* Keep the projectCard div for styling */}
        <h3 className={styles.projectCardTitle}>{project.name}</h3>
        <p className={styles.projectCardDescription}>{project.description}</p>
        <div className={styles.projectCardStatus}>Status: {project.status}</div>
        <div className={styles.projectCardProgress}>
          Progress: {project.progress}%
        </div>
        {project.endDate && (
          <div className={styles.projectCardDueDate}>
            Due Date: {project.endDate}
          </div>
        )}
        {/* Team member avatars could be added here later */}
      </div>
    </Link>
  );
};

export default ProjectCard;
