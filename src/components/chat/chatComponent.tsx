import React, { useState, useRef, useEffect } from "react";
import { fetchChatLogs } from "../../api/chat/fetchChatLogs";
import { Input, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import useWebSocket from "../../hooks/useWebSocket";
import { FaCircleArrowUp } from "react-icons/fa6";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import chatStyles from "./chat.module.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { selectProjects } from "../../redux/reducers/projectReducer";
import SearchIcon from '@mui/icons-material/Search';



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
  const startOfMessage = useRef<HTMLDivElement | null>(null);

  const projects = useSelector(selectProjects);
  const { projectId } = useParams<{projectId: string}>(); 
  const [projectName, setProjectName] = useState('');
  
  const location = useLocation(); 
  const navigate = useNavigate();

  const { stompClient, connect, subscribe, unsubscribe, sendMessage } = useWebSocket();

  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

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


   // 채팅 로그 불러오기
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1); 

  useEffect(() => {
    const loadChatLogs = async () => {
      if (!projectId || isLoading || !hasMore) return;

      setIsLoading(true);
      try {
        const response = await fetchChatLogs(projectId, page);
        if (response) {
          setChatLog(prevLogs => [...prevLogs, ...response.reverse()]);
          setPage(prevPage => prevPage + 1);
          setHasMore(response.length > 0);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch chat logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatLogs();
  }, [projectId, page]);
  

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
  }, [projectId, subscribe, unsubscribe, stompClient]);

  useEffect(() => {
    if(!projectId){
      return;
    }
    const loadChatLogs =  async () => {
      const result = await fetchChatLogs(projectId, page);
      if(result){
        setChatLog((prev) => [...result.reverse(), ...prev]);
      }
    }
    loadChatLogs();
  }, [projectId, page])


  // 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        setPage(prevPage => prevPage + 1);
      }
    }, { threshold: 0.1 });

    if (startOfMessage.current) observer.observe(startOfMessage.current);

    return () => observer.disconnect();
  }, [hasMore, isLoading]);


   // 채팅 로그 추가 로딩
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (startOfMessage.current) observer.observe(startOfMessage.current);

    return () => {
      if (startOfMessage.current) {
        observer.unobserve(startOfMessage.current);
      }
    };
  }, [hasMore, isLoading]);

  
  // 최신 채팅으로 자동 스크롤
  useEffect(() => {
    if (!hasMore) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [hasMore]);


  // 채팅 검색
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChatLog, setFilteredChatLog] = useState<IChatDetail[]>([]);

  const handleSearchIconClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  useEffect(() => {
    setFilteredChatLog(chatLog);
  }, [chatLog]);

  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      const filtered = chatLog.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChatLog(filtered);
    } else {
      setFilteredChatLog(chatLog);
    }
  };

  // 


  return curMember === null ? (
    <div></div>
  ) : (
    <div className={chatStyles.modal}>
      <div className={chatStyles.chat_header_container}>
        <div className={chatStyles.chat_project_name}>{projectName}</div>
        <IconButton onClick={handleSearchIconClick}>
          <SearchIcon />
        </IconButton>
      </div>
      {showSearchBar && (
        <div className={chatStyles.searchBarContainer}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">검색</button>
          </form>
        </div>
      )}
      <div className={chatStyles.chat_messages_container}>
        <div className={chatStyles.chat_messages_warpper}>
          <div ref={startOfMessage}  style={{ minHeight: "20px"}}/>
          {filteredChatLog.map((message, index) => (
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
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            width: "85%", 
            marginRight: "10px"
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
