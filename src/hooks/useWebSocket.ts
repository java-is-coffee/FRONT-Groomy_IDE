import { useState, useCallback, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp, { Client, Subscription } from "stompjs";
import { patchAccessToken } from "../api/auth/patchAccessToken";

let globalStompClient: Client | null = null;

const useWebSocket = () => {
  const [stompClient, setStompClient] = useState<Client | null>(
    globalStompClient
  );

  const subscriptions = useRef(new Map()).current;

  const connect = useCallback(
    (url: string) => {
      // 이미 연결된 클라이언트가 있으면 재사용
      console.log(stompClient);
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
    },
    [stompClient]
  );

  const subscribe = useCallback(
    (
      destination: string,
      callback: (message: any) => void
    ): Subscription | null => {
      if (!stompClient) return null;

      // 이미 존재하는 구독 확인
      if (subscriptions.has(destination)) {
        return subscriptions.get(destination);
      }
      const subscription = stompClient.subscribe(destination, (message) => {
        callback(message);
      });
      // 구독 객체 생성
      const subscriptionObject = {
        id: subscription.id,
        unsubscribe: () => {
          subscription.unsubscribe();
          subscriptions.delete(destination); // 구독 해제 시 맵에서 제거
        },
      };

      subscriptions.set(destination, subscriptionObject);

      return subscriptionObject;
    },
    [stompClient, subscriptions]
  );

  const unsubscribe = useCallback(
    (destination: string) => {
      // `subscriptions` Map에서 구독 객체를 찾음
      const subscription = subscriptions.get(destination);
      if (subscription) {
        // 구독 해제
        subscription.unsubscribe();

        // Map에서 해당 구독 제거
        subscriptions.delete(destination);
      }
    },
    [subscriptions]
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

  const disconnect = useCallback(
    (projectId: string) => {
      // 구독 해제
      unsubscribe(`/projectws/${projectId}/code`);
      unsubscribe(`/projectws/${projectId}/files`);
      unsubscribe(`/projectws/${projectId}/messages`);

      // connectionCount를 감소시키고 연결이 0이 되면 연결을 끊습니다.
      if (stompClient) {
        stompClient.disconnect(() => {
          globalStompClient = null;
          setStompClient(null);
        });
      }
    },
    [stompClient, unsubscribe]
  );

  return {
    stompClient,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    sendMessage,
  };
};

export default useWebSocket;
