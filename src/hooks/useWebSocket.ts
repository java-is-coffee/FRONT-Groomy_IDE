import { useState, useCallback, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp, { Client, Subscription } from "stompjs";
import { patchAccessToken } from "../api/auth/patchAccessToken";

let globalStompClient: Client | null = null;
let connectionCount = 0;

const useWebSocket = () => {
  const [stompClient, setStompClient] = useState<Client | null>(
    globalStompClient
  );

  const connect = useCallback((url: string) => {
    connectionCount++; // 연결을 설정할 때마다 카운트 증가
    // 이미 연결된 클라이언트가 있으면 재사용
    if (globalStompClient && globalStompClient.connected) {
      setStompClient(globalStompClient);
      return;
    }
    const BaseUrl =
      "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080";
    const socket = new SockJS(`${BaseUrl}/${url}`);
    const client = Stomp.over(socket);
    patchAccessToken();
    const storedToken = localStorage.getItem("accessToken")?.trim();
    client.connect(
      { Authorization: `${storedToken}` },
      (frame) => {
        console.log("Connected: " + frame);
        globalStompClient = client; // 전역 변수에 저장
        setStompClient(client);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const disconnect = useCallback(() => {
    connectionCount--;
    if (connectionCount === 0 && stompClient) {
      stompClient.disconnect(() => {
        console.log("Disconnected");
        globalStompClient = null;
      });
    }
    if (stompClient) {
      stompClient.disconnect(() => {
        console.log("Disconnected");
        globalStompClient = null; // 전역 변수를 null로 설정
        setStompClient(null);
      });
    }
  }, [stompClient]);

  const subscribe = useCallback(
    (
      destination: string,
      callback: (message: any) => void
    ): Subscription | null => {
      if (!stompClient) return null;

      const subscription = stompClient.subscribe(destination, (message) => {
        callback(message);
      });

      return {
        id: subscription.id,
        unsubscribe: () => {
          subscription.unsubscribe();
        },
      };
    },
    [stompClient]
  );

  const sendMessage = useCallback(
    (destination: string, body: any, headers = {}) => {
      if (!stompClient) {
        return;
      }
      stompClient.send(destination, headers, JSON.stringify(body));
    },
    [stompClient]
  );

  return { stompClient, connect, disconnect, subscribe, sendMessage };
};

export default useWebSocket;
