/**
 * WebSocketサーバー側 Expressアプリケーション
 */
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
  },
});

// 接続中のユーザーを管理するオブジェクト
const users = {};

/**
 * WebSocket クライアントがサーバーに接続したときのイベントリスナー
 */
io.on("connection", (socket) => {
  console.log("start connection ");
  const clientAddress = socket.handshake.address;
  const clientId = socket.id;
  console.log(`Client connected: ID=${clientId}, IP=${clientAddress}`);

  // ユーザーが名前を送信したときのイベントリスナー
  socket.on("enter", (name) => {
    users[clientId] = name;
    io.emit("updateUserList", Object.values(users)); // 全クライアントにユーザーリストを送信
  });

  // クライアントからメッセージが送られたときのイベントリスナー
  socket.on("send", (payload) => {
    // 受信したメッセージをコンソールに表示
    console.log(payload);
    // 全クライアントにメッセージをブロードキャストする
    socket.broadcast.emit("broadcast", payload);
  });

  // クライアントが切断したときのイベントリスナー
  socket.on("disconnect", () => {
    // 切断した旨、コンソールに表示
    console.log(`Client disconnected: ID=${clientId}, IP=${clientAddress}`);
    delete users[clientId];
    io.emit("updateUserList", Object.values(users)); // 全クライアントにユーザーリストを送信
  });
});

/**
 * Express サーバー起動
 */
server.listen(3001, () => {
  console.log("Listening..");
});
