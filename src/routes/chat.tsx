

import React, { useState } from 'react';
import ChatComponentModal from '../components/chat/ChatComponentModal'; 
import './chat.css';

const Chat: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div>
      <button onClick={toggleModal}>채팅</button>
      {showModal && <ChatComponentModal projectId={''} />}
    </div>
  );
};

export default Chat;

