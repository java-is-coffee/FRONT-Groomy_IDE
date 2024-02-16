import React, { createContext, useContext, ReactNode } from "react";
import { Client, Subscription } from "stompjs";
import useWebSocket from "../hooks/useWebSocket";

// WebSocket 컨텍스트 타입 수정
interface WebSocketContextType {
  stompClient: Client | null;
  connect: (url: string) => void; // connect 함수 추가
  disconnect: () => void; // disconnect 함수 추가
  subscribe: (
    destination: string,
    callback: (message: any) => void
  ) => Subscription | null;
  sendMessage: (destination: string, body: any, headers?: {}) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

// WebSocketProvider 컴포넌트 정의
interface WebSocketProviderProps {
  children: ReactNode;
}

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebsocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const { stompClient, connect, disconnect, subscribe, sendMessage } =
    useWebSocket();

  return (
    <WebSocketContext.Provider
      value={{ stompClient, connect, disconnect, subscribe, sendMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
