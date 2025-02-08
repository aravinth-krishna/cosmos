"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProjectDashboardLayout from "@/components/project-dashboard/ProjectDashboardLayout";
import TasksView from "@/components/project-dashboard/TasksView"; // Default to Tasks view for now
import { useParams } from "next/navigation"; // Import useParams

const ProjectDashboardPage = () => {
  const { projectId } = useParams(); // Get projectId from route params

  if (!projectId || typeof projectId !== "string") {
    return <div>Error: Invalid Project ID</div>; // Handle invalid projectId
  }

  return (
    <DashboardLayout>
      <ProjectDashboardLayout projectId={projectId}>
        {" "}
        {/* Pass projectId to ProjectDashboardLayout */}
        <TasksView /> {/* Default view is TasksView */}
      </ProjectDashboardLayout>
    </DashboardLayout>
  );
};

export default ProjectDashboardPage;
