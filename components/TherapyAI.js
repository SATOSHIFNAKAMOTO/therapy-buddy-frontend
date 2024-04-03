import React, { useState } from 'react';
import './TherapyAI.css';

const OPENAI_API_KEY_PART_1 = 'sk-uRhIYgh'; // Replace with your actual key part 1
const OPENAI_API_KEY_PART_2 = '51Z6a38KtA5MOT3BlbkFJyqzbz3F3TO8U6f8ffant'; // Replace with your actual key part 2

let isFirstMessage = true;
let conversationHistory = [];

export default function TherapyAI() {
  const [messageInputValue, setMessageInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  async function sendMessage(message = null) {
    if (!message) {
      message = messageInputValue.trim();
      if (message === '') return;
      setMessageInputValue('');
    }

    const userMessage = { id: Date.now(), type: 'user-message', content: message };
    setChatMessages(prevMessages => [...prevMessages, userMessage]);

    conversationHistory.push({ role: 'user', content: message });

    if (isFirstMessage) {
      isFirstMessage = false;
    }

    setIsTyping(true);

    const systemMessage = "You are a wise and experienced therapy AI assistant providing support on a mental health website. Your name is Therapy Buddy AI. Use cognitive behavioral health techniques. Respond to users with warmth and understanding. Aim for a balance between offering insightful questions and providing brief guidance or supportive statements. Keep responses to 2-3 sentences.";

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY_PART_1 + OPENAI_API_KEY_PART_2}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemMessage },
            ...conversationHistory
          ],
          max_tokens: 100,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const assistantMessageContent = data.choices[0].message.content.trim();
      const assistantMessage = { id: Date.now(), type: 'bot-message', content: assistantMessageContent };
      setChatMessages(prevMessages => [...prevMessages, assistantMessage]);

      conversationHistory.push({ role: 'assistant', content: assistantMessageContent });

      // Limit conversation history to approximately 500 words
      while (getConversationHistoryWordCount() > 500) {
        conversationHistory.shift();
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { id: Date.now(), type: 'bot-message', content: 'Oops! Something went wrong. Please try again later.' };
      setChatMessages(prevMessages => [...prevMessages, errorMessage]);
    }

    setIsTyping(false);
  }

  function handleSendMessage() {
    if (messageInputValue.trim() !== '') {
      sendMessage(messageInputValue);
      setMessageInputValue('');
    }
  }

  function getConversationHistoryWordCount() {
    return conversationHistory.reduce((count, message) => count + message.content.split(' ').length, 0);
  }

  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        {chatMessages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            {message.content}
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          id="messageInput"
          value={messageInputValue}
          onChange={(event) => setMessageInputValue(event.target.value)}
          placeholder="Type your message..."
        />
        <button id="sendButton" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}