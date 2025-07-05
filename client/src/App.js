import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await axios.post('https://weather-chatbot-5sjq.onrender.com/api/chat', {
        message: input,
      });

      const botReply = {
        sender: 'bot',
        text: res.data.reply,
      };

      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: '⚠️ Error getting weather data. Please try again.' },
      ]);
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="container">
      <div className="header">🌦️ Weather Chatbot</div>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          className="input"
          type="text"
          placeholder="Ask about the weather in your city..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
