"use client";

import styles from "./project-dashboard.module.css";
import ProjectDashboardNav from "./ProjectDashboardNav";
import DashboardSidebar from "../dashboard/DashboardSidebar"; // Assuming sidebar is reused
import DashboardTopNav from "../dashboard/DashboardTopNav"; // Assuming top nav is reused
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProjectDashboardLayoutProps {
  children: React.ReactNode;
}

interface Project {
  // Define Project type based on API response. Adapt this interface to your actual Project type from your API.
  id: string;
  name: string;
  description?: string;
  // ... other project properties you need -  add more fields based on your API response
}

const ProjectDashboardLayout: React.FC<ProjectDashboardLayoutProps> = ({
  children,
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!projectId) {
          throw new Error("Project ID is missing.");
        }
        const token = localStorage.getItem("token"); // 1. Retrieve token from localStorage
        if (!token) {
          throw new Error("No authentication token found. Are you logged in?"); // Handle case where token is missing
        }

        // Corrected fetch URL to API route WITH Authorization header:
        const response = await fetch(`/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // 2. Include JWT token in Authorization header
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Project not found.");
          } else if (response.status === 401) {
            throw new Error(
              "Unauthorized. Invalid or expired token. Please sign in again."
            ); // More user-friendly error for 401
          } else {
            throw new Error(
              `Failed to fetch project. Status: ${response.status}`
            );
          }
        }
        const data = await response.json();
        setProject(data);
      } catch (e: any) {
        console.error("Error fetching project details:", e);
        setError(e.message || "Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return <p>Loading project dashboard...</p>; // Or a more styled loading indicator
  }

  if (error) {
    return <p>Error: {error}</p>; // Display user-friendly error message including auth issues
  }

  if (!project) {
    return <p>Project details could not be loaded.</p>; // Should not happen ideally if error state is handled
  }

  return (
    <div className={styles.dashboardContainer}>
      <DashboardSidebar />
      <div className={styles.dashboardContent}>
        <DashboardTopNav />
        <ProjectDashboardNav
          projectId={projectId}
          projectName={project.name}
        />{" "}
        {/* Pass projectId and projectName */}
        <main className={styles.mainContent}>
          {children}{" "}
          {/* Render the specific view components (ChatView, TasksView, etc.) */}
        </main>
      </div>
    </div>
  );
};

export default ProjectDashboardLayout;
