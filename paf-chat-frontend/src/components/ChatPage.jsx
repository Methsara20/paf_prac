import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import { useChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const navigate = useNavigate();
  useEffect(() => {
    if (!connected) {
      navigate("/chat");
    }
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        setMessages(messages);
      } catch (error) {}
    }
    if (connected) {
      loadMessages();
    }
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      const client = new Client({
        webSocketFactory: () => sock,
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        setStompClient(client);
        toast.success("connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      };

      client.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      };

      client.activate();
    };

    if (connected) {
      connectWebSocket();
    }

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.deactivate();
      }
    };
  }, [roomId, connected]);

  const sendMessage = async () => {
    if (stompClient && stompClient.connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClient.publish({
        destination: `/app/sendMessage/${roomId}`,
        body: JSON.stringify(message)
      });
      
      setInput("");
    }
  };

  function handleLogout() {
    if (stompClient) {
      stompClient.deactivate();
    }
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/chat");
  }

  return (
    <div className="container-fluid p-0 vh-100 d-flex flex-column">
      {/* Header */}
      <header className="navbar navbar-dark bg-dark shadow-sm p-3">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <h1 className="h5 mb-0 me-3">
              Room: <span className="badge bg-secondary">{roomId}</span>
            </h1>
            <h1 className="h5 mb-0">
              User: <span className="badge bg-info text-dark">{currentUser}</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-danger"
          >
            Leave Room
          </button>
        </div>
      </header>

      {/* Chat messages */}
      <main
        ref={chatBoxRef}
        className="flex-grow-1 overflow-auto p-4 bg-light"
        style={{ marginTop: "60px", marginBottom: "80px" }}
      >
        <div className="container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`d-flex ${
                message.sender === currentUser ? "justify-content-end" : "justify-content-start"
              } mb-3`}
            >
              <div
                className={`card ${
                  message.sender === currentUser ? "bg-primary text-white" : "bg-white"
                }`}
                style={{ maxWidth: "400px" }}
              >
                <div className="card-body p-2">
                  <div className="d-flex gap-2">
                    <img
                      className="rounded-circle"
                      src="https://avatar.iran.liara.run/public/43"
                      alt="User avatar"
                      width="40"
                      height="40"
                    />
                    <div>
                      <h6 className="card-title mb-1">{message.sender}</h6>
                      <p className="card-text mb-1">{message.content}</p>
                      <small className="text-muted">
                        {timeAgo(message.timeStamp)}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Message input */}
      <footer className="bg-dark p-3 fixed-bottom">
        <div className="container">
          <div className="input-group">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              type="text"
              placeholder="Type your message here..."
              className="form-control rounded-pill"
            />
            <div className="input-group-append ms-2">
              <button className="btn btn-secondary rounded-circle me-2" style={{ width: "40px", height: "40px" }}>
                <MdAttachFile size={20} />
              </button>
              <button
                onClick={sendMessage}
                className="btn btn-success rounded-circle"
                style={{ width: "40px", height: "40px" }}
              >
                <MdSend size={20} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;