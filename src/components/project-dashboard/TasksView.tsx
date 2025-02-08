import styles from "./project-dashboard.module.css";

const TasksView = () => {
  return (
    <div className={styles.projectTabView}>
      <h3>Tasks View</h3>
      <p>
        Kanban board, list, and calendar views for project tasks will be
        implemented here.
      </p>
      {/* Task views components will go here (Kanban, List, Calendar) */}
    </div>
  );
};

export default TasksView;
