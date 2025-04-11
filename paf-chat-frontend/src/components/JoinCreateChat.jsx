import React, { useState } from "react";
import chatIcon from "../assets/images.jpg";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import { useChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input !!");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("Joined successfully");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chatHome");
      } catch (error) {
        if (error.status === 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error joining room");
        }
        console.error(error);
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      try {
        const response = await createRoomApi(detail.roomId);
        toast.success("Room created successfully");
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chatHome");
      } catch (error) {
        if (error.status === 400) {
          toast.error("Room already exists");
        } else {
          toast.error("Error creating room");
        }
        console.error(error);
      }
    }
  }

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Card className="p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body className="text-center">
          <div className="mb-4">
            <img src={chatIcon} alt="Chat Icon" className="img-fluid mx-auto" style={{ width: '100px' }} />
          </div>
          
          <Card.Title className="mb-4">Join Room / Create Room</Card.Title>
          
          <Form>
            {/* Name input */}
            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                name="userName"
                value={detail.userName}
                onChange={handleFormInputChange}
                placeholder="Enter your name"
              />
            </Form.Group>

            {/* Room ID input */}
            <Form.Group className="mb-4">
              <Form.Label>Room ID / New Room ID</Form.Label>
              <Form.Control
                type="text"
                name="roomId"
                value={detail.roomId}
                onChange={handleFormInputChange}
                placeholder="Enter room ID"
              />
            </Form.Group>

            {/* Buttons */}
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                size="lg"
                onClick={joinChat}
              >
                Join Room
              </Button>
              <Button
                variant="warning"
                size="lg"
                onClick={createRoom}
              >
                Create Room
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JoinCreateChat;