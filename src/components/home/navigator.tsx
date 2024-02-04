import React from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { GoPlus } from "react-icons/go";

import "../../styles/home/nav.css";

type navProps = {
  onChange: (newState: boolean) => void;
  sideClose: boolean;
};

const Nav: React.FC<navProps> = ({ onChange, sideClose }) => {
  return (
    <div className="menu-bar">
      <div
        className={`sidebar-button ${sideClose ? "close" : ""}`}
        onClick={() => onChange(!sideClose)}
      >
        <MdKeyboardDoubleArrowRight size={"32px"} />
      </div>
      <div>
        <button className="new-project">
          <span>NEW PROJECT</span>
          <GoPlus size={"20px"} />
        </button>
      </div>
    </div>
  );
};
export default Nav;
