import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' },
  ]);
  const [userInput, setUserInput] = useState('');

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');

    const options = {
      method: 'POST',
      url: 'https://api.edenai.run/v2/text/chat',
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNGMyNDNkNzEtYTY3Yy00NDM4LTgxNzItMjUxMTM5NzBkMThkIiwidHlwZSI6ImFwaV90b2tlbiJ9.uasnXWnUTXKZjUknfkGdyi_VnDfuO5QpOZzjRO_tUKc',
      },
      data: {
        providers: 'openai',
        text: userInput,
        chatbot_global_action: 'Act as an assistant',
        previous_history: newMessages.map(msg => ({ sender: msg.sender, text: msg.text })),
        temperature: 0.0,
        max_tokens: 150,
      },
    };

    try {
      const response = await axios.request(options);
      const botReply = response.data.choices[0].message;
      setMessages([...newMessages, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' }]);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col space-y-4 mb-4 h-96 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`p-2 rounded-lg ${message.sender === 'bot' ? 'bg-gray-200 self-start' : 'bg-blue-500 text-white self-end'}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message here..."
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
