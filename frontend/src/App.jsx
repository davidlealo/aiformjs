import React, { useState } from "react";

const FormWithChat = () => {
  const [formData, setFormData] = useState({ name: "", email: "", description: "" });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const userMessage = { role: "user", content: chatInput };
    setChatMessages([...chatMessages, userMessage]);

    // Call backend for GPT response
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...chatMessages, userMessage] }),
    });

    const data = await response.json();
    const botMessage = { role: "assistant", content: data.reply };

    setChatMessages([...chatMessages, userMessage, botMessage]);
    setChatInput("");

    // Parse GPT's response into the form fields
    const updatedFields = parseResponseIntoFields(data.reply);
    setFormData({ ...formData, ...updatedFields });
  };

  const parseResponseIntoFields = (reply) => {
    // Implement logic to extract form fields from GPT's reply
    return {}; // Example: { name: "John Doe", email: "john@example.com" }
  };

  return (
    <div>
      <form>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
      </form>
      <div>
        <h3>Chat with Assistant</h3>
        <div>
          {chatMessages.map((msg, index) => (
            <p key={index} className={msg.role}>
              {msg.content}
            </p>
          ))}
        </div>
        <form onSubmit={handleChatSubmit}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask the assistant..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default FormWithChat;
