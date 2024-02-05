import React, { useEffect, useState } from "react";
import Sidebar from "../components/home/sidebar";
import ProjectList from "../components/home/projectList";
import "../styles/home/home.css";
import Nav from "../components/home/navigator";
import axios from "axios";

const USER_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/member";

interface UserInfo {
  memberId: number;
  email: string;
  name: string;
  nickname: string;
  helpNumber: number;
  role: string;
}

const Home: React.FC = () => {
  // user 정보 저장용 state
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [sideClose, setSideClosed] = useState(false);
  const requestData = { data: "" };
  const handleSidebar = (changeState: boolean) => {
    setSideClosed(changeState);
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        console.log(requestData);
        if (accessToken) {
          const response = await axios.get<UserInfo>(`${USER_API_URL}/my`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          sessionStorage.setItem("user", JSON.stringify(response.data));
          setUserInfo(response.data);
        } else {
          console.error("accessToken 오류...");
        }
      } catch (error) {
        console.error("서버 오류입니다.", error);
      }
    };
    fetchUserInfo();
  }, []);
  return (
    <div>
      <nav className="nav">
        <Nav onChange={handleSidebar} sideClose={sideClose} />
      </nav>
      <div className="container">
        <aside className={`sidebar ${sideClose ? "closed" : ""}`}>
          <Sidebar
            onChange={handleSidebar}
            sideClose={sideClose}
            userInfo={userInfo}
          />
        </aside>
        <div className={`main-content ${sideClose ? "wide" : ""}`}>
          <ProjectList onChange={handleSidebar} sideClose={sideClose} />
        </div>
      </div>
    </div>
  );
};
export default Home;
