import React, { useState, useRef, useEffect } from "react";
import "../../styles/chat/chat.css";

import { IoIosSend, IoIosContact } from "react-icons/io";
import { fetchChatLogs } from "../../api/chat/fetchChatLogs";
import { Input, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import chatStyles from "./chat.module.css"
import SendIcon from '@mui/icons-material/Send';
import useWebSocket from "../../hooks/useWebSocket";
import { FaCircleArrowUp } from "react-icons/fa6";

type Message = {
  id: number;
  text: string;
  user_name: string;
  user_icon: JSX.Element;
  is_mine: boolean;
};

type ChatComponentsProps = {
  projectId: string | undefined;
}


interface IChatDTO {
  memberId: number;
  name?: string;
  email: string;
  message: string;
  createdTime?: string;
}

interface IChatDetail {
  user_icon: JSX.Element;
  id: string;
  name: string;
  email: string;
  message: string;
  createdTime: string;
}

const ChatComponentModal: React.FC<ChatComponentsProps> = ({
  projectId, 
}) => {
  const curMember = useSelector((state:RootState) => state.member.member);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const {globalStompClient, connect, subscribe, unsubscribe, sendMessage} = useWebSocket();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const loadChatLogs = async() => {
      try {
        if(!projectId)
          return;
        const response = await fetchChatLogs(projectId, 1);
        if (response) {
          console.log(response);
          //setMessages(formattedLogs);
        } else {
          console.log("No chat logs were fetched.");
        }
      } catch (error) {
        console.error("Failed to fetch chat logs:", error);
      }
    }
    loadChatLogs();
  }, [projectId]);
  

  // 채팅 메시지 전송

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = () => {
    console.log("message send");
    if(!curMember){
      console.log("새로고침 진행해주세요");
      return;
    }
    const sendMsg : IChatDTO = {
      memberId : curMember.memberId,
      email : curMember.email,
      message : inputValue,
    }

    const message = {
      data : sendMsg,
    }
    
    const dst = `/app/project-chat/${projectId}/send`;
    console.log(message);

    sendMessage(dst, message);

    setInputValue("");
  }

  // // Enter 키 이벤트 처리
  // const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSendMessage();
  //   }
  // };

  // if (!isModalOpen) return null;

  // 자동 스크롤
  // useEffect(() => {
  //   endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  // const messageList = (
  //   <div className={chatStyles.modal}>
  //     {messages.map((message) => (
  //       <div key={message.id} className={`{chatStyles.chat_message} ${message.is_mine ? 'mine' : 'others'}`}>
  //         <div className="chat_user_info">
  //           {message.is_mine ? (
  //             <>
  //               <div className={chatStyles.chat}>{message.user_name}</div>
  //               <div className={chatStyles.}>{message.user_icon}</div>
  //             </>
  //           ) : (
  //             <>
  //               <div className={chatStyles.}>{message.user_icon}</div>
  //               <div className={chatStyles.chat_user_name}>{message.user_name}</div>
  //             </>
  //           )}
  //         </div>
  //         <div className={chatStyles.chat_message_content}>
  //           <p className={chatStyles.chat_text}>{message.text}</p>
  //         </div>
  //       </div>
  //       ))}
  //     <div ref={endOfMessagesRef} />
  //   </div>
  // );

  // const handleCloseModal = () => setIsModalOpen(false);

const test = [
  {
    id: 1,
      "name": "박상현",
      "email": "aaa@naver.com",
      "message": "테스트",
      "createdTime": "2024-02-07T18:16:50.388295"
  },
  {
    id: 2,
      "name": "박상현",
      "email": "aaa@naver.com",
      "message": "테스트",
      "createdTime": "2024-02-07T18:16:49.794555"
  },
  {
    id: 3,
      "name": "박상현",
      "email": "aaa@naver.com",
      "message": "테스트",
      "createdTime": "2024-02-07T18:16:49.196229"
  },
  {
    id: 4,
      "name": "박상현",
      "email": "aaa@naver.com",
      "message": "테스트",
      "createdTime": "2024-02-07T18:16:48.35639"
  },
  {
    id: 5,
      "name": "박상현",
      "email": "aaa@naver.com",
      "message": "테스트",
      "createdTime": "2024-02-07T18:16:28.313195"
  }
]

  useEffect(() => {
    if(!globalStompClient){
      return;
    }

    const subUrl = `/projectws/${projectId}/messages`;
    console.log(projectId);
    subscribe(subUrl, (message) => {
      console.log(message);
    })

    return () => {unsubscribe(subUrl);}

  },[projectId, subscribe, globalStompClient]);

  return (
    <div className={chatStyles.modal}>
      <div className={chatStyles.chat_header_container}>
          <div className={chatStyles.chat_project_name}>프로젝트 - A</div>
          {/* <button className={chatStyles.chat_close_button} onClick={handleCloseModal}>&times;</button> */}
        </div>
        <div className={chatStyles.chat_messages_container}>
        {curMember ? (
            test.map((message) => (
                <div
                  key={message.id}
                  className={`${chatStyles.chat_message} ${
                    curMember.name === message.name ? "mine" : "others"
                  }`}
                >
                  <div className={chatStyles.chat_user_info}>
                    <span className={chatStyles.chat_user_name}>
                      {message.name}
                    </span>
                    <span className={chatStyles.chat_user_email}>
                      {message.email}
                    </span>
                    {/* <div className={chatStyles.chat_user_icon}>{message.user_icon}</div> */}
                  </div>
                  <div className={chatStyles.chat_message_content}>
                    <p className={chatStyles.chat_text}>{message.message}</p>
                  </div>
                  <div>
                    <span className={chatStyles.chat_user_message}>
                      {message.message}
                    </span>
                  </div>
                  <div>
                    <span className={chatStyles.chat_user_createdTime}>
                      {message.createdTime}
                    </span>
                  </div>
                </div>
            ))
          ) : (
            <div>멤버 불러오기 오류</div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
        <form
          className={chatStyles.chat_input_container}
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            size="small"
            placeholder={"채팅을 입력하세요"}
            autoFocus
            required
            value={inputValue}
            onChange={handleInputChange}
            style={{
              width: "100%",
              fontSize: "14px", // 글꼴 크기를 줄입니다.
            }}
          />
          <IconButton aria-label="send-btn" type="submit">
            <FaCircleArrowUp />
          </IconButton>
        </form>
    </div>
  );
};

export default ChatComponentModal;

