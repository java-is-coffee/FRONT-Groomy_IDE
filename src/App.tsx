import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/login";
import Register from "./routes/register";
import Home from "./pages/homePage";
import "./styles/style.css";
import ResetPassword from "./routes/resetPassword";
import WebIDE from "./routes/webIDE";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/resetPassword" element={<ResetPassword />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/code-editor/:projectId" element={<WebIDE />}></Route>
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        limit={1}
        closeButton={false}
        autoClose={4000}
        draggable={true}
        closeOnClick={true}
        pauseOnHover={true}
        hideProgressBar
      />
    </div>
  );
}

export default App;
