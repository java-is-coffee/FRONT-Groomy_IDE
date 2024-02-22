import React, { useState, useRef, useEffect } from "react";
import { fetchChatLogs } from "../../api/chat/fetchChatLogs";
import { Input, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import useWebSocket from "../../hooks/useWebSocket";
import { FaCircleArrowUp } from "react-icons/fa6";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import chatStyles from "./chat.module.css";

type ChatComponentsProps = {
  projectId: string | undefined;
};

interface IChatDTO {
  memberId: number;
  name?: string;
  email: string;
  message: string;
  createdTime?: string;
}

interface IChatDetail {
  name: string;
  email: string;
  message: string;
  createdTime: string;
}

const ChatComponent: React.FC<ChatComponentsProps> = ({ projectId }) => {
  const curMember = useSelector((state: RootState) => state.member.member);

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const { stompClient, subscribe, unsubscribe, sendMessage } = useWebSocket();
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState<IChatDetail[]>([]);

  useEffect(() => {
    const loadChatLogs = async () => {
      try {
        if (!projectId) return;
        const response = await fetchChatLogs(projectId, 1);
        if (response) {
          console.log(response);
          setChatLog(response.reverse());
        } else {
          console.log("No chat logs were fetched.");
        }
      } catch (error) {
        console.error("Failed to fetch chat logs:", error);
      }
    };
    loadChatLogs();
  }, [projectId]);

  // 채팅 메시지 전송
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = () => {
    console.log("message send");
    if (!curMember) {
      console.log("새로고침 진행해주세요");
      return;
    }
    const sendMsg: IChatDTO = {
      memberId: curMember.memberId,
      email: curMember.email,
      message: inputValue,
    };

    const message = {
      data: sendMsg,
    };

    const dst = `/app/project-chat/${projectId}/send`;
    console.log(message);

    sendMessage(dst, message);

    setInputValue("");
  };

  // // Enter 키 이벤트 처리
  // const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSendMessage();
  //   }
  // };

  // if (!isModalOpen) return null;

  // 자동 스크롤
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  useEffect(() => {
    if (!stompClient) {
      return;
    }
    console.log("구독시작");
    const subUrl = `/projectws/${projectId}/messages`;
    subscribe(subUrl, (message) => {
      const data = JSON.parse(message.body);
      const newMsg: IChatDetail = data;
      setChatLog((prev) => [...prev, newMsg]);
    });

    return () => {
      unsubscribe(subUrl);
    };
  }, [projectId, subscribe, unsubscribe, stompClient]);

  return curMember === null ? (
    <div></div>
  ) : (
    <div className={chatStyles.modal}>
      <div className={chatStyles.chat_header_container}>
        <div className={chatStyles.chat_project_name}>프로젝트 - A</div>
        {/* <button className={chatStyles.chat_close_button} onClick={handleCloseModal}>&times;</button> */}
      </div>
      <div className={chatStyles.chat_messages_container}>
        <div className={chatStyles.chat_messages_warpper}>
          {chatLog.map((message, index) => (
            <div
              key={index}
              className={`${chatStyles.chat_message} ${
                curMember.name === message.name
                  ? chatStyles.mine
                  : chatStyles.others
              }`}
            >
              <div className={chatStyles.chat_user_info}>
                <AccountCircleIcon />
                <span className={chatStyles.chat_user_name}>
                  {message.name}
                </span>
                <span className={chatStyles.chat_user_email}>
                  {message.email}
                </span>
              </div>
              <div className={chatStyles.chat_message_content}>
                <span className={chatStyles.chat_text}>{message.message}</span>
              </div>
              <div>
                <span className={chatStyles.chat_user_createdTime}>
                  {message.createdTime.replace("T", " ").split(".")[0]}
                </span>
              </div>
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
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

export default ChatComponent;
