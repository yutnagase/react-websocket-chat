import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  name: string;
  text: string;
}

/**
 * WebSocketチャットメッセージ管理カスタムフック
 * @param initialMessage: 初期メッセージ
 * @param setUsers: ユーザーリストを更新する関数
 * @returns
 */
const useChatService = (
  initialMessage: Message,
  setUsers: (users: string[]) => void
): [
  Message[],
  (name: string, text: string) => void,
  (name: string) => void
] => {
  // 現在のメッセージを管理する状態を定義する
  // messages: 現在のメッセージ配列, sendMessage: メッセージを送信する関数
  const [messages, setMessages] = useState<Message[]>([initialMessage]);

  // WebSocketインスタンスを保持
  const socketRef = useRef<Socket | null>(null);

  /**
   * WebSocket 接続を開始し、切断を登録する
   * useEffect を使って 副作用の処理を行う
   */
  useEffect(() => {
    // socket.io-client を使って WebSocket インスタンスを生成する
    socketRef.current = io("http://localhost:3001");
    // 'broadcast'イベント(サーバーからのメッセージ)をリッスンし、メッセージを追加する
    socketRef.current.on("broadcast", (payload: Message) => {
      setMessages((prevMessages) => [...prevMessages, payload]);
    });
    socketRef.current.on("updateUserList", (users: string[]) => {
      setUsers(users);
    });
    // 関数が解除されるとき、WebSocket 切断をする
    return () => {
      socketRef.current?.disconnect();
    };
  }, [setUsers]);

  /**
   * メッセージ送信関数
   * @param name: 送信者の名前
   * @param text: 送信メッセージ
   */
  const sendMessage = (name: string, text: string) => {
    const chatMessage: Message = {
      name: name,
      text: text,
    };
    // クライアントからのメッセージをサーバーに送信する
    socketRef.current?.emit("send", chatMessage);
    // 送信したメッセージを現在のメッセージ配列に追加する
    setMessages((prevMessages) => [...prevMessages, chatMessage]);
  };

  const connect = (name: string) => {
    socketRef.current?.emit("enter", name);
  };

  // 現在のメッセージとメッセージ送信関数を返す
  return [messages, sendMessage, connect];
};

export default useChatService;
