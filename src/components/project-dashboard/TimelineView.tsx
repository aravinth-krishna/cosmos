import styles from "./project-dashboard.module.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProjectTimelineData {
  // Define ProjectTimelineData type based on API response
  id: string;
  projectId: string;
  ganttData: any; // Or define structure of your Gantt data
  // ... other timeline properties
}

const TimelineView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [timelineData, setTimelineData] = useState<ProjectTimelineData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimelineData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!projectId) {
          throw new Error("Project ID is missing.");
        }
        // Corrected fetch URL to API route:
        const response = await fetch(`/api/projects/${projectId}/timeline`);
        if (!response.ok) {
          if (response.status === 404) {
            setTimelineData({
              projectId: projectId,
              ganttData: null,
            } as ProjectTimelineData);
            return;
          }
          throw new Error(
            `Failed to fetch timeline data. Status: ${response.status}`
          );
        }
        const data = await response.json();
        setTimelineData(data);
      } catch (e: any) {
        console.error("Error fetching timeline data:", e);
        setError(e.message || "Failed to load timeline data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, [projectId]);

  if (loading) {
    return <p>Loading timeline...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!timelineData) {
    return <p>No timeline data available.</p>; // Handle case where timeline is not found
  }

  return (
    <div className={styles.timelineViewContainer}>
      <h2>Project Timeline</h2>
      {timelineData.ganttData ? (
        <pre>{JSON.stringify(timelineData.ganttData, null, 2)}</pre>
      ) : (
        // In the future, integrate a Gantt chart library here and render the ganttData
        <p>No timeline data added yet.</p>
      )}
      {/* Add Timeline Editing/Updating Features later */}
    </div>
  );
};

export default TimelineView;
