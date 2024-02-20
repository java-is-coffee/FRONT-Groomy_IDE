import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH_Client_ID;

root.render(
  <GoogleOAuthProvider clientId={CLIENT_ID ? CLIENT_ID : "NO-KEY"}>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
);

reportWebVitals();
