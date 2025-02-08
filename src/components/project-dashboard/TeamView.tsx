import styles from "./project-dashboard.module.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TeamMember {
  // Define TeamMember type based on API response (ProjectTeam with User data)
  id: string;
  role: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    // ... other user properties
  };
  // ... other team member properties if needed
}

const TeamView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!projectId) {
          throw new Error("Project ID is missing.");
        }
        // Corrected fetch URL to API route:
        const response = await fetch(`/api/projects/${projectId}/team`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch team members. Status: ${response.status}`
          );
        }
        const data = await response.json();
        setTeamMembers(data);
      } catch (e: any) {
        console.error("Error fetching team members:", e);
        setError(e.message || "Failed to load team members.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [projectId]);

  if (loading) {
    return <p>Loading team members...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={styles.teamViewContainer}>
      <h2>Team Members</h2>
      {teamMembers.length === 0 ? (
        <p>No team members added yet.</p>
      ) : (
        <ul className={styles.teamList}>
          {teamMembers.map((member) => (
            <li key={member.id} className={styles.teamMemberItem}>
              <div className={styles.memberDetails}>
                <span className={styles.memberName}>
                  {member.user.firstName} {member.user.lastName}
                </span>
                <span className={styles.memberUsername}>
                  ({member.user.username})
                </span>
                <span className={styles.memberEmail}>
                  {" "}
                  - {member.user.email}
                </span>
              </div>
              <span className={styles.memberRole}>Role: {member.role}</span>
            </li>
          ))}
        </ul>
      )}
      {/* Add Team Management Features (Add/Remove/Edit Roles) later */}
    </div>
  );
};

export default TeamView;
