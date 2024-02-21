import { useParams } from "react-router-dom";
import ChatComponentModal from "../../chat/ChatComponentModal";

const Chat = () => {
  const {projectId} = useParams();
  return (
    <div className="side-content">
      <div className="side-container-header">
        <span className="side-container-title">CHAT</span>
      </div>
        <ChatComponentModal projectId={projectId} />
    </div>
  );
};

export default Chat;
