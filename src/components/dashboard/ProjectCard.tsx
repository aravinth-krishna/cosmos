import styles from "./dashboard.module.css";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    status: string;
    progress: number;
    dueDate?: string;
    teamMembers: string[];
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className={styles.projectCard}>
      <h3 className={styles.projectCardTitle}>{project.name}</h3>
      <p className={styles.projectCardDescription}>{project.description}</p>
      <div className={styles.projectCardStatus}>Status: {project.status}</div>
      <div className={styles.projectCardProgress}>
        Progress: {project.progress}%
      </div>
      {project.dueDate && (
        <div className={styles.projectCardDueDate}>
          Due Date: {project.dueDate}
        </div>
      )}
      {/* Team member avatars could be added here later */}
    </div>
  );
};

export default ProjectCard;
