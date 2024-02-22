import React from "react";
import ChatComponent from "../../chat/chatComponent"; 

const Chat = () => {
  return (
    <div className="side-content">
      <div className="side-container-header">
        <span className="side-container-title">CHAT</span>
      </div>
      <ChatComponent /> 
    </div>
  );
};

export default Chat;

