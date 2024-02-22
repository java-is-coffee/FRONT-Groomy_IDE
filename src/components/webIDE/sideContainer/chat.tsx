import { useParams } from "react-router-dom";
import ChatComponent from "../../chat/chatComponent";
import sideStyles from "./sideContents.module.css";

const Chat = () => {
  const { projectId } = useParams();
  return (
    <div className={sideStyles[`side-content`]}>
      <div className={sideStyles[`side-container-header`]}>
        <span className={sideStyles[`side-container-title`]}>CHAT</span>
      </div>
      <ChatComponent projectId={projectId} />
    </div>
  );
};

export default Chat;