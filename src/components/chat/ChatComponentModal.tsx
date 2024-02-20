import React, { useState, useRef, useEffect } from "react";
import "../../styles/chat/chat.css";

import { IoIosSend, IoIosContact } from "react-icons/io";
import { fetchChatLogs } from "../../api/chat/fetchChatLogs";

type Message = {
  id: number;
  text: string;
  user_name: string;
  user_icon: JSX.Element;
  is_mine: boolean;
};

type ChatComponentsProps = {
  projectId: string;
  token: string;
}


interface ChatLog {
  id: number; 
  message: string;
  name: string;
  email: string;
}

const ChatComponentModal: React.FC<ChatComponentsProps> = ({
  projectId, 
  token, 
}) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    async function loadChatLogs() {
      try {
        const response = await fetchChatLogs(projectId, 0);
        if (response) {
          const formattedLogs = response.map((log: ChatLog) => ({
            id: Math.random(),
            text: log.message,
            user_name: log.name,
            user_icon: <IoIosContact size={32} />,
            is_mine: log.email === "your.email@example.com",
          }));
          setMessages(formattedLogs);
        } else {
          console.log("No chat logs were fetched.");
        }
      } catch (error) {
        console.error("Failed to fetch chat logs:", error);
      }
    }
    loadChatLogs();
  }, [projectId, token]);
  

  // 채팅 메시지 전송
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; 
    try {
      const updatedMessages = [...messages, {
        id: Date.now(), 
        text: newMessage,
        user_name: "나", 
        user_icon: <IoIosContact size={32} />, 
        is_mine: true 
      }];
      setMessages(updatedMessages); 
      setNewMessage(''); 
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' }); 
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Enter 키 이벤트 처리
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isModalOpen) return null;

  // 자동 스크롤
  // useEffect(() => {
  //   endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  const messageList = (
    <div className="chat_messages_container">
      {messages.map((message) => (
        <div key={message.id} className={`chat_message ${message.is_mine ? 'mine' : 'others'}`}>
          <div className="chat_user_info">
            {message.is_mine ? (
              <>
                <div className="chat_user_name">{message.user_name}</div>
                <div className="chat_user_icon">{message.user_icon}</div>
              </>
            ) : (
              <>
                <div className="chat_user_icon">{message.user_icon}</div>
                <div className="chat_user_name">{message.user_name}</div>
              </>
            )}
          </div>
          <div className="chat_message_content">
            <p className="chat_text">{message.text}</p>
          </div>
        </div>
        ))}
      <div ref={endOfMessagesRef} />
    </div>
  );

  const handleCloseModal = () => setIsModalOpen(false);



  return (
    <div className="modal">
      <div className="all">
        <div className="chat_header_container">
          <div className="chat_project_name">프로젝트 - A</div>
          <button className="chat_close_button" onClick={handleCloseModal}>&times;</button>
        </div>
        <div className="chat_messages_container">
          {messages.map((message) => (
            <div key={message.id} className={`chat_message ${message.is_mine ? 'mine' : 'others'}`}>
              <div className="chat_user_info">
                <div className="chat_user_name">{message.user_name}</div>
                <div className="chat_user_icon">{message.user_icon}</div>
              </div>
              <div className="chat_message_content">
                <p className="chat_text">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
        <div className="chat_input_container">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요"
          />
          <button className="chat_input_button" onClick={handleSendMessage}>
            <IoIosSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponentModal;

