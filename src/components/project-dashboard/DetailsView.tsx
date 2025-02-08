import styles from "./project-dashboard.module.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProjectDetails {
  // Define ProjectDetails type based on API response
  id: string;
  projectId: string;
  links: any; // Or more specific type if you structure links
  notes?: string;
  otherDetails: any; // Or more specific type
  // ... other detail properties
}

const DetailsView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableDetails, setEditableDetails] = useState<ProjectDetails | null>(
    null
  ); // State for form data

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!projectId) {
          throw new Error("Project ID is missing.");
        }
        // Corrected fetch URL to API route:
        const response = await fetch(`/api/projects/${projectId}/details`);
        if (!response.ok) {
          if (response.status === 404) {
            setProjectDetails({
              projectId: projectId,
              links: [],
              notes: "",
              otherDetails: {},
            } as ProjectDetails);
            setEditableDetails({
              projectId: projectId,
              links: [],
              notes: "",
              otherDetails: {},
            } as ProjectDetails);
            return;
          }
          throw new Error(
            `Failed to fetch project details. Status: ${response.status}`
          );
        }
        const data = await response.json();
        setProjectDetails(data);
        setEditableDetails(data);
      } catch (e: any) {
        console.error("Error fetching project details:", e);
        setError(e.message || "Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableDetails(projectDetails); // Revert form data to original details
  };

  const handleSaveDetails = async () => {
    if (!editableDetails) return; // Should not happen, but type safety

    try {
      const response = await fetch(`/api/projects/${projectId}/details`, {
        method: "PATCH", // Or PUT, depending on your API design
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableDetails), // Send the form data
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update project details. Status: ${response.status}`
        );
      }

      const updatedDetails = await response.json();
      setProjectDetails(updatedDetails); // Update displayed details
      setIsEditing(false); // Exit edit mode
    } catch (e: unknown) {
      console.error("Error updating project details:", e);
      if (e instanceof Error) {
        setError(e.message || "Failed to update project details.");
      } else {
        setError("Failed to update project details.");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editableDetails) return; // Type safety
    const { name, value } = e.target;
    setEditableDetails({ ...editableDetails, [name]: value });
  };

  if (loading) {
    return <p>Loading project details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!projectDetails) {
    return <p>No project details available.</p>; // Handle case where details are not found (or API returns null)
  }

  return (
    <div className={styles.detailsViewContainer}>
      {isEditing ? (
        <div className={styles.detailsForm}>
          <div className={styles.formGroup}>
            <label htmlFor="notes" className={styles.formLabel}>
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className={styles.detailsTextarea}
              value={editableDetails.notes || ""}
              onChange={handleChange}
            />
          </div>
          {/* Example for links - adjust based on how you want to handle links (JSON array, etc.) */}
          <div className={styles.formGroup}>
            <label htmlFor="links" className={styles.formLabel}>
              Links (JSON)
            </label>
            <textarea
              id="links"
              name="links"
              className={styles.detailsTextarea}
              value={JSON.stringify(editableDetails.links || [])} // Assuming links are JSON, stringify for textarea
              onChange={handleChange} // You'll need to parse JSON on change if you want to edit JSON directly in textarea
            />
          </div>
          {/* Example for otherDetails - adjust based on how you want to handle otherDetails (JSON, etc.) */}
          <div className={styles.formGroup}>
            <label htmlFor="otherDetails" className={styles.formLabel}>
              Other Details (JSON)
            </label>
            <textarea
              id="otherDetails"
              name="otherDetails"
              className={styles.detailsTextarea}
              value={JSON.stringify(editableDetails.otherDetails || {})} // Stringify JSON
              onChange={handleChange} // Parse JSON on change
            />
          </div>

          <div className={styles.detailsActions}>
            <button
              className={styles.secondaryButton}
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              className={styles.primaryButton}
              onClick={handleSaveDetails}
            >
              Save Details
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.detailsDisplay}>
          <div className={styles.detailSection}>
            <h3>Notes</h3>
            <p>{projectDetails.notes || "No notes added."}</p>
          </div>
          <div className={styles.detailSection}>
            <h3>Links</h3>
            {projectDetails.links && Array.isArray(projectDetails.links) ? (
              <ul>
                {projectDetails.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.name || link.url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No links added.</p>
            )}
          </div>
          <div className={styles.detailSection}>
            <h3>Other Details</h3>
            <pre>
              {JSON.stringify(projectDetails.otherDetails, null, 2)}
            </pre>{" "}
            {/* Pretty print JSON */}
          </div>

          <button className={styles.primaryButton} onClick={handleEditClick}>
            Edit Details
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailsView;
