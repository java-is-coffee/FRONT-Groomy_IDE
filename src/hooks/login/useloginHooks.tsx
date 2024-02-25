import { useNavigate } from "react-router-dom";

function useLoginHooks() {
  const navigate = useNavigate();

  const goMain = () => {
    navigate("/");
  };

  const goLogin = () => {
    navigate("/login");
  };

  const goRegister = () => {
    navigate("/register");
  };

  const goResetPassword = () => {
    navigate("/resetPassword");
  };

  return { goMain, goRegister, goResetPassword, goLogin };
}

export default useLoginHooks;
