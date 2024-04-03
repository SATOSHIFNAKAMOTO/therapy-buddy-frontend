const OPENAI_API_KEY_PART_1 = 'sk-uRhIYgh'; // Replace with your actual key part 1
const OPENAI_API_KEY_PART_2 = '51Z6a38KtA5MOT3BlbkFJyqzbz3F3TO8U6f8ffant'; // Replace with your actual key part 2

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.querySelector('.chat-messages');
const typingIndicator = document.querySelector('.typing-indicator');
const therapyTabs = document.querySelectorAll('.therapy-tabs a');
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;
const newChatButton = document.getElementById('newChatButton');

let isFirstMessage = true;
let conversationHistory = [];

sendButton.addEventListener('click', () => sendMessage());
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

therapyTabs.forEach((tab) => {
  tab.addEventListener('click', (event) => {
    event.preventDefault();
    const topic = tab.getAttribute('data-topic');
    insertMessageIntoTextbox(topic);
    startNewChat();
  });
});

themeSwitch.addEventListener('change', function() {
  body.classList.toggle('dark-mode');
});

newChatButton.addEventListener('click', () => {
  startNewChat();
});

async function sendMessage(message = null) {
  if (!message) {
    message = messageInput.value.trim();
    if (message === '') return;
    messageInput.value = '';
  }

  displayMessage(message, 'user-message');
  conversationHistory.push({ role: 'user', content: message });

  if (isFirstMessage) {
    const starterMessage = document.querySelector('.starter-message');
    starterMessage.style.display = 'none';
    isFirstMessage = false;
  }

  // Show typing indicator
  typingIndicator.style.display = 'block';

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
    const assistantMessage = data.choices[0].message.content.trim();
    conversationHistory.push({ role: 'assistant', content: assistantMessage });

    // Hide typing indicator
    typingIndicator.style.display = 'none';
    displayMessage(assistantMessage, 'bot-message');

    // Limit conversation history to approximately 500 words
    while (getConversationHistoryWordCount() > 500) {
      conversationHistory.shift();
    }
  } catch (error) {
    console.error('Error:', error);
    // Hide typing indicator
    typingIndicator.style.display = 'none';
    displayMessage('Oops! Something went wrong. Please try again later.', 'bot-message');
  }
}

function displayMessage(message, messageClass) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', messageClass);
  messageDiv.innerText = message;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function startNewChat() {
  chatMessages.innerHTML = '';
  conversationHistory = [];
  const starterMessage = document.createElement('div');
  starterMessage.classList.add('starter-message');
  starterMessage.innerHTML = '<p>Hi there! I\'m your Therapy Buddy. Feel free to chat with me about anything that\'s on your mind. I\'m here to listen and support you!</p>';
  chatMessages.appendChild(starterMessage);
  isFirstMessage = true;
}

function insertMessageIntoTextbox(topic) {
  const message = `I'd like help with ${topic}. Can you help me with this?`;
  messageInput.value = message;
}

function getConversationHistoryWordCount() {
  return conversationHistory.reduce((count, message) => count + message.content.split(' ').length, 0);
}