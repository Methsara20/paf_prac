import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend, MdClose, MdDelete, MdEdit, MdCheck, MdCancel } from "react-icons/md";
import { useChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { uploadFile } from "../services/FileService";
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const fileInputRef = useRef(null);
  const editInputRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        setMessages(messages);
      } catch (error) {
        console.error("Error loading messages:", error);
        toast.error("Failed to load messages");
      }
    }
    if (connected) {
      loadMessages();
    }
  }, [roomId, connected]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]); 

  useEffect(() => {
    if (editingMessage && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingMessage]);

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
        toast.success("Connected to chat server");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          console.log("Received message:", newMessage);
          
          setMessages((prevMessages) => {
            // Check if this is an update or delete
            if (newMessage.id) {
              const messageIndex = prevMessages.findIndex(msg => msg.id === newMessage.id);
              
              // If message exists, replace it
              if (messageIndex !== -1) {
                const updatedMessages = [...prevMessages];
                console.log("Updating message at index:", messageIndex);
                console.log("Old message:", updatedMessages[messageIndex]);
                console.log("New message:", newMessage);
                
                // For deleted messages, ensure we have the correct content
                if (newMessage.deleted) {
                  newMessage.content = "This message was deleted";
                }
                
                updatedMessages[messageIndex] = newMessage;
                
                // If this is a delete operation, show a toast for the receiver
                if (newMessage.deleted && newMessage.sender !== currentUser) {
                  toast.info(`${newMessage.sender} deleted a message`);
                }
                
                return updatedMessages;
              }
            }
            
            // For new deleted messages (unlikely but possible)
            if (newMessage.deleted) {
              newMessage.content = "This message was deleted";
            }
            
            // Otherwise add as a new message
            return [...prevMessages, newMessage];
          });
        });
      };

      client.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        toast.error("Connection error");
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
  }, [roomId, connected, currentUser]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        toast.error("File size exceeds 20MB limit");
        return;
      }
      setSelectedFile(file);
      toast.success(`Selected file: ${file.name}`);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessage = async () => {
    if (!stompClient || !stompClient.connected) {
      toast.error("Not connected to chat server");
      return;
    }
    
    if (!input.trim() && !selectedFile) {
      toast.error("Enter a message or select a file");
      return;
    }
    
    setIsUploading(true);
    
    try {
      let fileData = null;
      
      // Handle file upload if a file is selected
      if (selectedFile) {
        toast.loading("Uploading file...");
        
        try {
          fileData = await uploadFile(selectedFile);
          toast.dismiss();
          toast.success("File uploaded successfully");
        } catch (error) {
          toast.dismiss();
          toast.error("Failed to upload file");
          setIsUploading(false);
          return;
        }
      }
      
      const message = {
        sender: currentUser,
        content: input.trim(),
        roomId: roomId,
      };
      
      // Add file information if a file was uploaded
      if (fileData) {
        message.fileUrl = fileData.fileUrl;
        message.fileType = fileData.fileType;
        message.fileName = fileData.fileName;
      }

      stompClient.publish({
        destination: `/app/sendMessage/${roomId}`,
        body: JSON.stringify(message)
      });
      
      setInput("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsUploading(false);
    }
  };

  const startEditMessage = (message) => {
    if (message.sender !== currentUser) {
      toast.error("You can only edit your own messages");
      return;
    }
    
    if (message.deleted) {
      toast.error("Cannot edit a deleted message");
      return;
    }
    
    setEditingMessage(message);
    setEditText(message.content);
  };

  const cancelEditMessage = () => {
    setEditingMessage(null);
    setEditText("");
  };

  const saveEditMessage = () => {
    if (!editText.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    
    if (!stompClient || !stompClient.connected) {
      toast.error("Not connected to chat server");
      return;
    }
    
    const updateRequest = {
      id: editingMessage.id,
      content: editText.trim(),
      sender: currentUser,
      roomId: roomId,
      isUpdate: true
    };
    
    stompClient.publish({
      destination: `/app/sendMessage/${roomId}`,
      body: JSON.stringify(updateRequest)
    });
    
    setEditingMessage(null);
    setEditText("");
    toast.success("Message updated");
  };

  const deleteMessage = (message) => {
    if (message.sender !== currentUser) {
      toast.error("You can only delete your own messages");
      return;
    }
    
    if (message.deleted) {
      toast.error("Message already deleted");
      return;
    }
    
    if (!stompClient || !stompClient.connected) {
      toast.error("Not connected to chat server");
      return;
    }
    
    // Ask for confirmation
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        console.log("Sending delete request for message ID:", message.id);
        
        // Send delete request to server
        stompClient.publish({
          destination: `/app/sendMessage/${roomId}`,
          body: JSON.stringify({
            id: message.id,
            sender: currentUser,
            roomId: roomId,
            isDelete: true
          })
        });
        
        toast.success("Message deleted");
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error("Failed to delete message");
      }
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

  // Function to render different types of media
  const renderMedia = (message) => {
    if (!message.fileUrl) return null;
    
    const fileUrl = `${baseURL}${message.fileUrl}`;
    
    switch (message.fileType) {
      case 'image':
        return (
          <div className="mb-2">
            <img 
              src={fileUrl} 
              alt={message.fileName || "Image"} 
              className="img-fluid rounded" 
              style={{ maxHeight: "200px", cursor: "pointer" }}
              onClick={() => window.open(fileUrl, "_blank")}
            />
          </div>
        );
      case 'video':
        return (
          <div className="mb-2">
            <video 
              src={fileUrl} 
              controls 
              className="rounded" 
              style={{ maxHeight: "200px", maxWidth: "100%" }}
            />
          </div>
        );
      case 'audio':
        return (
          <div className="mb-2">
            <audio 
              src={fileUrl} 
              controls 
              className="w-100" 
            />
          </div>
        );
      default:
        return (
          <div className="d-flex align-items-center mb-2 p-2 bg-light rounded">
            <MdAttachFile size={24} className="me-2" />
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-truncate"
              download={message.fileName}
            >
              {message.fileName || "Download attachment"}
            </a>
          </div>
        );
    }
  };

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
          {messages.length === 0 && (
            <div className="text-center text-muted my-5">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          
          {messages.map((message, index) => {
            console.log(`Rendering message ${index}:`, message);
            console.log(`Message deleted status: ${message.deleted}`);
            console.log(`Message content: "${message.content}"`);
            return (
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
                  style={{ maxWidth: "70%" }}
                >
                  <div className="card-body p-2">
                    <div className="d-flex gap-2">
                      <img
                        className="rounded-circle"
                        src={`https://avatar.iran.liara.run/public/${message.sender.length * 3}`}
                        alt="User avatar"
                        width="40"
                        height="40"
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className="card-title mb-0">{message.sender}</h6>
                          
                          {message.sender === currentUser && !message.deleted && (
                            <div className="btn-group">
                              <button 
                                className="btn btn-sm btn-light text-primary"
                                onClick={() => startEditMessage(message)}
                                title="Edit message"
                              >
                                <MdEdit size={16} />
                              </button>
                              <button 
                                className="btn btn-sm btn-light text-danger"
                                onClick={() => deleteMessage(message)}
                                title="Delete message"
                              >
                                <MdDelete size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {/* Display file attachment if not deleted */}
                        {!message.deleted && renderMedia(message)}
                        
                        {/* Message editing UI */}
                        {editingMessage && editingMessage.id === message.id ? (
                          <div className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              ref={editInputRef}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditMessage();
                                if (e.key === 'Escape') cancelEditMessage();
                              }}
                            />
                            <button 
                              className="btn btn-success"
                              onClick={saveEditMessage}
                              title="Save"
                            >
                              <MdCheck />
                            </button>
                            <button 
                              className="btn btn-danger"
                              onClick={cancelEditMessage}
                              title="Cancel"
                            >
                              <MdCancel />
                            </button>
                          </div>
                        ) : (
                          /* Message content display */
                          <div className="mb-1">
                            {message.deleted === true ? (
                              /* Deleted message */
                              <p className="card-text">
                                <span className={`fst-italic ${message.sender === currentUser ? "text-white-50" : "text-muted"}`}>
                                  <MdDelete className="me-1" size={16} />
                                  This message was deleted
                                </span>
                              </p>
                            ) : (
                              /* Normal message */
                              <p className="card-text">
                                {message.content}
                                {message.edited && (
                                  <small className="ms-1 fst-italic">(edited)</small>
                                )}
                              </p>
                            )}
                          </div>
                        )}
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <small className={`${message.sender === currentUser ? "text-white-50" : "text-muted"}`}>
                            {timeAgo(message.timeStamp)}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Message input */}
      <footer className="bg-dark p-3 fixed-bottom">
        <div className="container">
          {selectedFile && (
            <div className="alert alert-secondary mb-2 d-flex align-items-center">
              <MdAttachFile className="me-2" />
              <span className="text-truncate flex-grow-1">{selectedFile.name}</span>
              <button 
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={removeSelectedFile}
              >
                <MdClose />
              </button>
            </div>
          )}
          
          <div className="input-group">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isUploading) sendMessage();
              }}
              type="text"
              placeholder="Type your message here..."
              className="form-control rounded-pill"
              disabled={isUploading}
            />
            <div className="input-group-append ms-2">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button 
                className="btn btn-secondary rounded-circle me-2" 
                style={{ width: "40px", height: "40px" }}
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
                title="Attach file"
              >
                <MdAttachFile size={20} />
              </button>
              <button
                onClick={sendMessage}
                className="btn btn-success rounded-circle"
                style={{ width: "40px", height: "40px" }}
                disabled={isUploading}
                title="Send message"
              >
                {isUploading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <MdSend size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;