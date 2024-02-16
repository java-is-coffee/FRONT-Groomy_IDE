import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import { WebsocketProvider } from "./context/webSocketContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <WebsocketProvider>
      <App />
    </WebsocketProvider>
  </Provider>
);

reportWebVitals();
