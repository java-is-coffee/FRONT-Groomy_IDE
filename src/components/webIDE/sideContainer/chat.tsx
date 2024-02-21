import { useParams } from "react-router-dom";
import ChatComponent from "../../chat/chatComponent";

const Chat = () => {
  const { projectId } = useParams();
  return (
    <div className="side-content">
      <div className="side-container-header">
        <span className="side-container-title">CHAT</span>
      </div>
      <ChatComponent projectId={projectId} />
    </div>
  );
};

export default Chat;
