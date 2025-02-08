import styles from "./dashboard.module.css";
import ProjectCard from "./ProjectCard";
import CreateProjectButton from "./CreateProjectButton";

// Mock project data for now
const mockProjects = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Redesign company website",
    status: "In Progress",
    progress: 50,
    dueDate: "2024-08-15",
    teamMembers: ["user1", "user2"],
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Develop iOS and Android app",
    status: "To Do",
    progress: 10,
    dueDate: "2024-09-30",
    teamMembers: ["user3", "user4", "user5"],
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Q4 Marketing Campaign",
    status: "Completed",
    progress: 100,
    dueDate: "2024-07-20",
    teamMembers: ["user1", "user3"],
  },
  // ... add more mock projects
];

const ProjectList = () => {
  return (
    <div className={styles.projectListContainer}>
      <div className={styles.projectListHeader}>
        <h2>Projects</h2>
        <CreateProjectButton />
      </div>
      <div className={styles.projectList}>
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
