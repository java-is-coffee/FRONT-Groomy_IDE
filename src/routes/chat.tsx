

import React, { useState } from 'react';
import ChatComponents from '../components/chat/ChatComponentModal'; 
import './chat.css';

const Chat: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div>
      <button onClick={toggleModal}>채팅</button>
      {showModal && <ChatComponents projectId={''} token={''} />}
    </div>
  );
};

export default Chat;

