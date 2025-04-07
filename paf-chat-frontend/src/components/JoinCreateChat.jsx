import React from 'react';

const JoinCreateChat = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="card p-4 shadow-sm" style={{ width: '400px', maxWidth: '100%' }}>
        <div className="card-body">
          <h2 className="card-title mb-4 text-center">Join Room...</h2>
          
          <form>
            {/*name div*/}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Your Name</label>
              <input 
                type="text" 
                className="form-control" 
                id="name" 
                placeholder="Enter your name"
              />
            </div>
            

            {/*room id div*/}
            <div className="mb-4">
              <label htmlFor="roomId" className="form-label">Room ID</label>
              <input 
                type="text" 
                className="form-control" 
                id="roomId" 
                placeholder="Enter room ID"
              />
            </div>
            
            <div className="d-grid gap-3">
              <button className="btn btn-primary btn-lg">
                Join Room
              </button>
              <button className="btn btn-outline-secondary btn-lg">
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JoinCreateChat;