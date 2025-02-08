"use client";

import styles from "./dashboard.module.css";
import ProjectCard from "./ProjectCard";
import CreateProjectButton from "./CreateProjectButton";
import { useEffect, useState } from "react";

interface ProjectData {
  // Define interface for Project data based on your API response
  id: string;
  name: string;
  description?: string;
  status: string; // Or TaskStatus enum if you have it on frontend
  progress: number;
  endDate?: string; // Or Date if you are handling Date objects
  teamMembers: string[]; // Or User type if you have frontend User type
  // ... other project properties from your API response
}

const ProjectList = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    // Make fetchProjects reusable
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data);
    } catch (e: unknown) {
      console.error("Fetch projects error:", e);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(); // Fetch projects on component mount
  }, []);

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={styles.projectListContainer}>
      <div className={styles.projectListHeader}>
        <h2>Projects</h2>
        <CreateProjectButton onProjectCreated={fetchProjects} />{" "}
        {/* Pass fetchProjects as onCreateSuccess */}
      </div>
      <div className={styles.projectList}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
