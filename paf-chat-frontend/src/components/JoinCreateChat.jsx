import React, { useState } from "react";
import chatIcon from "../assets/images.jpg";
import toast from "react-hot-toast";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

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

  function joinChat() {
    if (validateForm()) {
    }
  }

  async function createRoom() {
    if (validateForm()) {
      //create room
      console.log(detail);

    
    }
  }
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div
        className="card p-4 shadow-sm"
        style={{ width: "400px", maxWidth: "100%" }}
      >
        <div className="card-body">
          <div className="text-center">
            <img
              src={chatIcon}
              className="mx-auto d-block"
              style={{ width: "85px" }}
              alt="Chat icon"
            />
          </div>
          <h2 className="card-title mb-4 text-center">Join / Create Room...</h2>

          <form>
            {/*name div*/}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Your Name
              </label>
              <input
                onChange={handleFormInputChange}
                value={detail.userName}
                type="text"
                className="form-control"
                id="name"
                name="userName"
                placeholder="Enter your name"
              />
            </div>

            {/*room id div*/}
            <div className="mb-4">
              <label htmlFor="roomId" className="form-label">
                Room ID
              </label>
              <input
                name="roomId"
                onChange={handleFormInputChange}
                value={detail.roomId}
                type="text"
                className="form-control"
                id="roomId"
                placeholder="Enter room ID"
              />
            </div>

            <div className="d-grid gap-3">
              <button onClick={joinChat} className="btn btn-primary btn-lg">
                Join Room
              </button>
              <button
                onClick={createRoom}
                className="btn btn-outline-secondary btn-lg"
              >
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
