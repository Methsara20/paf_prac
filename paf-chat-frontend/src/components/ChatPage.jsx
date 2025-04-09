import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { MdSend, MdAttachFile } from "react-icons/md";

const ChatPage = () => {
  return (
    <div className="vh-100 d-flex flex-column">
      {/* Navbar */}
      <header className="border-dark bg-secondary shadow-sm border py-3 d-flex justify-content-around align-items-center">
        <div>
          <h1 className="h4 font-weight-bold text-white">
            Room : <span className="font-weight-normal text-light">Family Room</span>
          </h1>
        </div>
        <div>
          <h1 className="h4 font-weight-bold text-white">
            User : <span className="font-weight-normal text-light">Methsara</span>
          </h1>
        </div>
        <div>
          <button className="btn btn-danger px-3 py-2 rounded-pill">
            Leave Room
          </button>
        </div>
      </header>

      {/* Message display area */}
      <div className="flex-grow-1 overflow-auto p-3">
        <main  className="py-20 px-10   w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto ">
            hooo
            hooo
        </main>
      </div>

      {/* Message input container */}
      <div className="p-3 bg-light border-top">
        <div className="input-group w-75 mx-auto">
          {/* Attachment button */}
          <button 
            className="btn btn-outline-secondary rounded-start-pill border-end-0"
            type="button"
            onClick={() => document.getElementById('fileInput').click()}
          >
            <MdAttachFile className="fs-5" />
            <input 
              type="file" 
              id="fileInput" 
              className="d-none" 
              onChange={(e) => console.log(e.target.files)}
            />
          </button>
          
          {/* Message input */}
          <input
            type="text"
            className="form-control border-end-0 border-start-0"
            placeholder="Type Your Message Here....."
          />
          
          {/* Send button */}
          <button className="btn btn-success rounded-end-pill border-start-0 px-3">
            <MdSend className="fs-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;