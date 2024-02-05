import React, { useEffect, useState } from "react";
import Sidebar from "../components/home/sidebar";
import ProjectsContainer from "../components/home/projectsContainer";
import "../styles/home/home.css";
import Nav from "../components/home/navigator";
import {
  MemberInfo,
  getMemberInfo,
} from "../components/api/auth/getMemberInfo";

const Home: React.FC = () => {
  // user 정보 저장용 state
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);
  const [sideClose, setSideClosed] = useState<boolean>(false);
  const accessToken = localStorage.getItem("accessToken");
  const handleSidebar = (changeState: boolean) => {
    setSideClosed(changeState);
  };
  useEffect(() => {
    const fetchMemberData = async () => {
      const hasMemberInfo = await getMemberInfo();
      if (hasMemberInfo) {
        const storedMemberInfo = sessionStorage.getItem("member");
        if (storedMemberInfo) {
          try {
            const memberInfoObj: MemberInfo = JSON.parse(storedMemberInfo);
            setMemberInfo(memberInfoObj);
          } catch (error) {
            console.error("Auth error", error);
            setMemberInfo(null);
          }
        } else {
          setMemberInfo(null);
        }
      }
    };

    if (!memberInfo) {
      fetchMemberData();
    }
  }, [accessToken]);
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
            userInfo={memberInfo}
          />
        </aside>
        <div className={`main-content ${sideClose ? "wide" : ""}`}>
          <ProjectsContainer onChange={handleSidebar} sideClose={sideClose} />
        </div>
      </div>
    </div>
  );
};
export default Home;
