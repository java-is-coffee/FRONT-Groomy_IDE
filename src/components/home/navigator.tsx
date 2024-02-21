import React from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { GoPlus } from "react-icons/go";

import navStyles from "./nav.module.css";

type navProps = {
  onChange: (newState: boolean) => void;
  sideClose: boolean;
  onOpen: () => void;
};

const Nav: React.FC<navProps> = ({ onChange, sideClose, onOpen }) => {
  return (
    <div className={navStyles[`menu-bar`]}>
      <div
        className={`${navStyles[`sidebar-button`]} ${
          sideClose ? navStyles.close : ""
        }`}
        onClick={() => onChange(!sideClose)}
      >
        <MdKeyboardDoubleArrowRight size={"32px"} />
      </div>
      <div>
        <button className={navStyles[`new-project`]} onClick={onOpen}>
          <span>NEW PROJECT</span>
          <GoPlus size={"20px"} />
        </button>
      </div>
    </div>
  );
};
export default Nav;
