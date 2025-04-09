import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { MdSend, MdAttachFile } from "react-icons/md";

const ChatPage = () => {
  const currentUser = "Methsara";
  

  const [messages, setMessages] = useState([
    {
      content: "Hello kouhshdshdaihidj",
      sender: "Methsara",
      
    },
    {
      content: "Hello",
      sender: "OtherUser",
      
    },
    {
      content: "Hello",
      sender: "Methsara",
      
    },

    {
        content: "bfuwfgaiwughawliughwilughwlhguawhergkjwj",
        sender: "other",
        
      },
  ]);

  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [roomId, setRoomId] = useState("");

  // Implemented sendMessage function
  const sendMessage = () => {
    if (input.trim() === "") return;

    const newMessage = {
      content: input,
      sender: currentUser,
      timestamp: new Date()
    };

    // For demo purposes - in real app, send via WebSocket
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    inputRef.current?.focus();
    
    // Scroll to bottom after sending message
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  return (
    <div className="vh-100 d-flex flex-column">
      {/* Navbar */}
      <header className="border-dark bg-secondary shadow-sm border py-3 d-flex justify-content-around align-items-center">
        <div>
          <h1 className="h4 font-weight-bold text-white">
            Room: <span className="font-weight-normal text-light">Family Room</span>
          </h1>
        </div>
        <div>
          <h1 className="h4 font-weight-bold text-white">
            User: <span className="font-weight-normal text-light">{currentUser}</span>
          </h1>
        </div>
        <div>
          <button className="btn btn-danger px-3 py-2 rounded-pill">
            Leave Room
          </button>
        </div>
      </header>

      {/* Message display area */}
      <div ref={chatBoxRef} className="flex-grow-1 overflow-auto p-3 bg-dark">
        <div className="w-75 mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 p-3 rounded ${
                message.sender === currentUser 
                  ? "bg-primary ms-auto" 
                  : "bg-secondary me-auto"
              }`}
              style={{ maxWidth: "75%", width: "fit-content" }}
            >
              <div className="d-flex align-items-start gap-2">
                <img
                  src="https://avatar.iran.liara.run/public/43"
                  className="rounded-circle"
                  width="40"
                  height="40"
                  alt="User avatar"
                />
                <div className="border-start ps-2 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-baseline">
                    <p className="mb-1 fw-bold small">{message.sender}</p>
                    
                  </div>
                  <p className="mb-0 text-break">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message input container */}
      <div className="p-3 bg-light border-top">
        <div className="input-group w-75 mx-auto">
          <button
            className="btn btn-outline-secondary rounded-start-pill border-end-0"
            type="button"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <MdAttachFile className="fs-5" />
            <input
              type="file"
              id="fileInput"
              className="d-none"
              onChange={(e) => console.log(e.target.files)}
            />
          </button>
          <input
            type="text"
            ref={inputRef}
            className="form-control border-end-0 border-start-0"
            placeholder="Type Your Message Here....."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            className="btn btn-success rounded-end-pill border-start-0 px-3"
            onClick={sendMessage}
            disabled={!input.trim()}
          >
            <MdSend className="fs-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;