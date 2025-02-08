// src/components/dashboard/CreateProjectModal.tsx

import styles from "./dashboard.module.css";
import { useState } from "react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess?: () => void; // Optional callback after successful project creation
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateSuccess,
}) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [startDate, setStartDate] = useState<string | undefined>("");
  const [endDate, setEndDate] = useState<string | undefined>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message

  const handleCreateProject = async () => {
    setErrorMessage(null); // Clear any previous error messages

    if (!projectName) {
      setErrorMessage("Project name is required.");
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
          startDate: startDate || null, // Send null if empty string
          endDate: endDate || null, // Send null if empty string
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Try to get error message from backend
        const message =
          errorData?.message ||
          `Failed to create project. Status: ${response.status}`;
        throw new Error(message);
      }

      // Project created successfully
      console.log("Project created successfully");
      onClose(); // Close the modal
      if (onCreateSuccess) {
        onCreateSuccess(); // Call the success callback to refresh project list
      }
    } catch (error: unknown) {
      console.error("Error creating project:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to create project. Please try again."
      ); // Display error to user
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Create New Project</h2>
        <form className={styles.createProjectForm}>
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}{" "}
          {/* Display error message */}
          <div className={styles.formGroup}>
            <label htmlFor="projectName" className={styles.formLabel}>
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              className={styles.formInput}
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setErrorMessage(null);
              }} // Clear error on input change
              placeholder="Enter project name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="projectDescription" className={styles.formLabel}>
              Description (Optional)
            </label>
            <textarea
              id="projectDescription"
              className={styles.formTextarea}
              value={projectDescription}
              onChange={(e) => {
                setProjectDescription(e.target.value);
                setErrorMessage(null);
              }} // Clear error on input change
              placeholder="Enter project description"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="startDate" className={styles.formLabel}>
              Start Date (Optional)
            </label>
            <input
              type="date"
              id="startDate"
              className={styles.formInput}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setErrorMessage(null);
              }} // Clear error on input change
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endDate" className={styles.formLabel}>
              Due Date (Optional)
            </label>
            <input
              type="date"
              id="endDate"
              className={styles.formInput}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setErrorMessage(null);
              }} // Clear error on input change
            />
          </div>
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleCreateProject}
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
