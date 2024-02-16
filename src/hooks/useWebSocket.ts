import { useState, useCallback } from "react";
import SockJS from "sockjs-client";
import Stomp, { Client, Subscription } from "stompjs";
import { patchAccessToken } from "../api/auth/patchAccessToken";

const useWebSocket = () => {
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const connect = useCallback((url: string) => {
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
        setStompClient(client);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const disconnect = useCallback(() => {
    if (stompClient) {
      stompClient.disconnect(() => {
        console.log("Disconnected");
        setStompClient(null); // 연결 해제 후 stompClient 상태를 null로 설정
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
      if (!stompClient) return;
      stompClient.send(destination, headers, JSON.stringify(body));
    },
    [stompClient]
  );

  return { stompClient, connect, disconnect, subscribe, sendMessage };
};

export default useWebSocket;
