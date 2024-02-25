import ChatComponent from "../../chat/chatComponent";
import sideStyles from "./sideContents.module.css";

const Chat = () => {
  return (
    <div className={sideStyles[`side-content`]}>
      <ChatComponent />
    </div>
  );
};

export default Chat;
