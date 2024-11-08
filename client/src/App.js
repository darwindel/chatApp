import logo from './logo.svg';
import './App.css';
// client/src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://192.168.4.64:5000');  // Connect to the Node.js backend

function App() {
    const [userName, setUserName] = useState('');
    const [isUserSet, setIsUserSet] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        socket.on('connect', () => {
          console.log('Socket connected to server');
      });


        // Listen for incoming chat messages
        socket.on('chatMessage', (msg) => {
            console.log('Received message:', msg);
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            // Cleanup: disconnect the socket on unmount
            socket.off('chatMessage');
        };
    }, []);


    // Handle setting the username
  const handleSetUserName = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setIsUserSet(true); // Mark the user as set
    }
  };
   // Handle sending messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && userName) {
      // Emit the message along with the user's name
      socket.emit('chatMessage', { userName, message });
      setMessage('');  // Clear message input
    }
  };

    return (
      <div>
        {!isUserSet ? (
          <div>
            <h2>Enter your name:</h2>
            <form onSubmit={handleSetUserName}>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                required
              />
              <button type="submit">Set Name</button>
            </form>
          </div>
        ) : (
          <div>
            <h2>Welcome, {userName}</h2>
            <div id="chat">
              <div id="messages">
                {messages.map((msg, index) => (
                  <div key={index}>
                    <strong>{msg.userName}:</strong> {msg.message}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message"
                  required
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

export default App;
