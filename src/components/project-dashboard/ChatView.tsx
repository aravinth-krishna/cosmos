import styles from "./project-dashboard.module.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ChatMessage {
  // Define ChatMessage type based on API response
  id: string;
  message: string;
  createdAt: string; // or Date, depending on your API response
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    // ... other user properties you need
  };
  // ... other message properties
}

const ChatView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!projectId) {
          throw new Error("Project ID is missing.");
        }
        const response = await fetch(`/api/projects/${projectId}/chat`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch chat messages. Status: ${response.status}`
          );
        }
        const data = await response.json();
        setMessages(data);
      } catch (e: unknown) {
        console.error("Error fetching chat messages:", e);
        if (e instanceof Error) {
          setError(e.message || "Failed to load chat messages.");
        } else {
          setError("Failed to load chat messages.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChatMessages();
  }, [projectId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message. Status: ${response.status}`);
      }

      const sentMessage = await response.json();
      setMessages((prevMessages) => [...prevMessages, sentMessage]); // Optimistically update UI
      setNewMessage(""); // Clear input
    } catch (e: unknown) {
      console.error("Error sending chat message:", e);
      if (e instanceof Error) {
        setError(e.message || "Failed to send message.");
      } else {
        setError("Failed to send message.");
      }
    }
  };

  if (loading) {
    return <p>Loading chat...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={styles.chatViewContainer}>
      <div className={styles.messageList}>
        {messages.map((message) => (
          <div key={message.id} className={styles.message}>
            <div className={styles.messageHeader}>
              <span className={styles.messageSender}>
                {message.user.username}
              </span>
              <span className={styles.messageTimestamp}>
                ({new Date(message.createdAt).toLocaleString()})
              </span>{" "}
              {/* Format timestamp */}
            </div>
            <p className={styles.messageText}>{message.message}</p>
          </div>
        ))}
      </div>
      <div className={styles.chatInputArea}>
        <input
          type="text"
          className={styles.chatInput}
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // Send on Enter key
        />
        <button className={styles.sendButton} onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatView;
