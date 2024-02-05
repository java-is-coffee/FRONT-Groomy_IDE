import React, { useState } from "react";
import Sidebar from "../components/home/sidebar";
import ProjectList from "../components/home/projectList";
import "../styles/home/home.css";
import Nav from "../components/home/navigator";

const Home: React.FC = () => {
  const [sideClose, setSideClosed] = useState(false);
  const handleSidebar = (changeState: boolean) => {
    setSideClosed(changeState);
  };
  return (
    <div>
      <nav className="nav">
        <Nav onChange={handleSidebar} sideClose={sideClose} />
      </nav>
      <div className="container">
        <aside className={`sidebar ${sideClose ? "closed" : ""}`}>
          <Sidebar onChange={handleSidebar} sideClose={sideClose} />
        </aside>
        <div className={`main-content ${sideClose ? "wide" : ""}`}>
          <ProjectList onChange={handleSidebar} sideClose={sideClose} />
        </div>
      </div>
    </div>
  );
};
export default Home;
