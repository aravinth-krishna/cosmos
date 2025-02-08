// src/components/dashboard/CreateProjectButton.tsx
import styles from "./dashboard.module.css";
import { useState } from "react";
import CreateProjectModal from "./CreateProjectModal";

interface CreateProjectButtonProps {
  onProjectCreated?: () => void; // Optional: Callback for when project is created
}

const CreateProjectButton: React.FC<CreateProjectButtonProps> = ({
  onProjectCreated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProjectClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className={styles.createProjectButton}
        onClick={handleCreateProjectClick}
      >
        Create New Project
      </button>
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateSuccess={() => {
          setIsModalOpen(false); // Ensure modal closes on success too (if not already)
          if (onProjectCreated) {
            onProjectCreated(); // Call the callback to refresh project list in ProjectList
          }
        }}
      />
    </>
  );
};

export default CreateProjectButton;
