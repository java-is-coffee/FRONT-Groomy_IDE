import { useState, useCallback, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp, { Client, Subscription } from "stompjs";
import { patchAccessToken } from "../api/auth/patchAccessToken";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from './../redux/store/store';
import { setSocket } from "../redux/reducers/socketReducer";



let connectionCount = 0;

const fetchToken = async() => {
  const result = await patchAccessToken();
  if(!result){
    console.log("커낵션 에러 재로그인이 필요합니다.");
    return false;
  }else{
    console.log("토큰 패치" + result);
    return true;
  }
}

const useWebSocket = () => {
  const isStampClient = useSelector((state:RootState) => state.socket.socketConnect);
  const subscriptions = useRef(new Map()).current;
  const dispatch = useDispatch();

  const connect = useCallback(async(url: string) => {
    connectionCount++; 
    // 이미 연결된 클라이언트가 있으면 재사용
    const tokenUpdated : boolean = await fetchToken();
    if (!tokenUpdated) {
      return;
    }

    const storedToken = localStorage.getItem("accessToken")?.trim();
    const config = {
      Authorization: storedToken
    }
    
    const BaseUrl =
      "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080";
    const socket = new SockJS(`${BaseUrl}/${url}`);
    const client = Stomp.over(socket);
    
    // client.debug = () => {};
    client.connect(
      config,
      (frame) => {
        console.log("Connected: " + frame);
        dispatch(setSocket(false)) ;
      },
      (error) => {
        console.log(error);
        connect(url);
      }
    );
  }, []);

  const disconnect = useCallback(() => {
    connectionCount--;
    if (connectionCount === 0 && globalStompClient) {
      globalStompClient.disconnect(() => {
        console.log("Disconnected");
        dispatch(setSocket(false));
      });
    }
    if (globalStompClient) {
      globalStompClient.disconnect(() => {
        console.log("Disconnected");
        dispatch(setSocket(false)); // 전역 변수를 null로 설정
      });
    }
  }, [globalStompClient]);

  const subscribe = useCallback(
    (
      destination: string,
      callback: (message: any) => void
    ): Subscription | null => {
      if(!globalStompClient){
        return null;
      }
        console.log("sub" + destination);
        // 이미 존재하는 구독 확인
        if (subscriptions.has(destination)) {
          console.log("이미 존재");
          return subscriptions.get(destination);
        }
        const subscription = globalStompClient.subscribe(destination, (message) => {
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
    [globalStompClient, subscriptions]
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
      if (!globalStompClient) {
        return;
      }
      globalStompClient.send(destination, headers, JSON.stringify(body));
    },
    [globalStompClient]
  );

  return {
    globalStompClient,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    sendMessage,
  };
};

export default useWebSocket;
