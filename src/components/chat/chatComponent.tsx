import React, { useState, useRef, useEffect } from "react";
import { fetchChatLogs } from "../../api/chat/fetchChatLogs";
import { Input, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import useWebSocket from "../../hooks/useWebSocket";
import { FaCircleArrowUp } from "react-icons/fa6";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import chatStyles from "./chat.module.css";
import { useLocation, useParams } from "react-router-dom";
import { selectProjects } from "../../redux/reducers/projectReducer";


type Message = {
  id: number;
  text: string;
  user_name: string;
  user_icon: JSX.Element;
  is_mine: boolean;
};

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

const ChatComponent: React.FC = () => { 
  const curMember = useSelector((state: RootState) => state.member.member);
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState<IChatDetail[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const projects = useSelector(selectProjects);
  const { projectId } = useParams<{projectId: string}>(); 
  const [projectName, setProjectName] = useState('');
  
  const { stompClient, connect, subscribe, unsubscribe, sendMessage } = useWebSocket();

  // const location = useLocation();
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 채팅 불러오기
  useEffect(() => {
    const loadChatLogs = async () => { 
      if (!projectId) return;
        try {
          const response = await fetchChatLogs(projectId, 1);
          if (response) {
            setChatLog(response.reverse());
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

  // 자동 프로젝트 이름
  useEffect(() => {
    const project = projects.find((p: { projectId: { toString: () => string | undefined; }; }) => p.projectId.toString() === projectId);
    if (project) {
      setProjectName(project.projectName); // 프로젝트 이름 설정
    }
  }, [projectId, projects]);

  // 자동 스크롤
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);


  //웹소켓
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
  }, [projectId, subscribe, stompClient]);


  return curMember === null ? (
    <div></div>
  ) : (
    <div className={chatStyles.modal}>
      <div className={chatStyles.chat_header_container}>
        <div className={chatStyles.chat_project_name}>{projectName}</div>
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
                <div className={chatStyles.chat_name_icon_wrapper}>
                  <AccountCircleIcon className={chatStyles.chat_user_icon} />
                  <span className={chatStyles.chat_user_name}>
                    {message.name}
                  </span>
                </div>
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
            fontSize: "14px", 
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
