// src/app/dashboard/[projectId]/page.tsx
import ProjectDashboardLayout from "@/components/project-dashboard/ProjectDashboardLayout";
import TasksView from "@/components/project-dashboard/TasksView"; // Or any other view to start with

const ProjectDashboardPage = () => {
  return (
    <ProjectDashboardLayout>
      <TasksView /> {/* Or ChatView, DetailsView, etc. */}
    </ProjectDashboardLayout>
  );
};

export default ProjectDashboardPage;
