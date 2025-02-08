"use client";

import styles from "./project-dashboard.module.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Task {
  // Define Task type based on API response
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string; // or Date
  assignee: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    // ... other user properties you need
  } | null;
  // ... other task properties
}

const TasksView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!projectId) {
          throw new Error("Project ID is missing.");
        }
        // Corrected fetch URL to API route:
        const response = await fetch(`/api/projects/${projectId}/tasks`);
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks. Status: ${response.status}`);
        }
        const data = await response.json();
        setTasks(data);
      } catch (e: any) {
        console.error("Error fetching tasks:", e);
        setError(e.message || "Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={styles.tasksViewContainer}>
      <h2>Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet for this project.</p>
      ) : (
        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <h3 className={styles.taskTitle}>{task.name}</h3>
              <p className={styles.taskDescription}>{task.description}</p>
              <div className={styles.taskMeta}>
                <span className={styles.taskStatus}>Status: {task.status}</span>
                <span className={styles.taskPriority}>
                  Priority: {task.priority}
                </span>
                {task.assignee && (
                  <span className={styles.taskAssignee}>
                    Assigned to: {task.assignee.username}
                  </span>
                )}
                {task.dueDate && (
                  <span className={styles.taskDueDate}>
                    Due Date: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* Add Task Creation Button/Form here later */}
    </div>
  );
};

export default TasksView;
