import React from "react";
import { useNavigate } from "react-router-dom";

function useRegisterHooks() {
  const navigate = useNavigate();
  const goLogin = () => {
    navigate("/login");
  };

  const emailCheck = (email: string): boolean => {
    const emailReggex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

    return emailReggex.test(email);
  };

  return { emailCheck, goLogin };
}

export default useRegisterHooks;
