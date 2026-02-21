import React, { useState } from 'react';

const AdmissionAssistant = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSend = () => {
        setMessages([...messages, { text: input, sender: 'user' }]);
        // Add logic to send input to AI and get response
        setInput('');
    };

    return (
        <div className="admission-assistant">
            <h2>Admission Assistant</h2>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender}> {msg.text} </div>
                ))}
            </div>
            <input 
                type="text" 
                value={input} 
                onChange={handleInputChange} 
                placeholder="Type your message..." 
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default AdmissionAssistant;