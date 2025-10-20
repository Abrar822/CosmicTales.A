// === DOM Elements ===
const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendButton = document.querySelector('.send-icon');
const stopButton = document.getElementById('stop-button');
const sendIcon = sendButton.querySelector('i');

// === Backend API URL ===
// In chatbot.js

// This tells your frontend where to send chat messages
// const API_URL = 'https://cosmic-tales.onrender.com/chat';

// Change this line in chatbot.js
const API_URL = 'http://127.0.0.1:5000/chat';

// === System Prompt for AI ===
const systemPrompt = `
You are Helios, a friendly and knowledgeable AI assistant specializing 
in space weather and astronomy. Your goal is to provide clear, accurate, 
and engaging answers to user queries. You must format your responses 
using Markdown (e.g., ### for headings, * for lists, ** for bold).
`;

// === Conversation State ===
let conversationHistory = [
  { role: 'user', parts: [{ text: systemPrompt }] },
  { role: 'model', parts: [{ text: "Understood! I am Helios, ready to explore the cosmos. 🚀" }] }
];

let isBotResponding = false;
let controller = null;

// === Add Message to Chat Window ===
const addMessage = (sender, message) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `${sender}-message`);

  const p = document.createElement('p');
  p.innerHTML = message;

  messageElement.appendChild(p);
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  return messageElement;
};

// === Chat Form Submit ===
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // 🚫 Prevent sending while bot is "thinking"
  if (isBotResponding) return;

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Add user message
  addMessage('user', userMessage);
  userInput.value = '';

  // Add bot "..." loading animation
  const loadingMessage = addMessage('bot', '');
  loadingMessage.classList.add('loading');

  const tempUserEntry = { role: 'user', parts: [{ text: userMessage }] };

  // === Lock state ===
  isBotResponding = true;
  controller = new AbortController();
  sendButton.disabled = true;
  stopButton.style.display = 'flex';

  // === Stop Button Handler ===
  const stopHandler = () => {
    if (controller) controller.abort();

    loadingMessage.classList.remove('loading');
    loadingMessage.querySelector('p').textContent = "⏹ Stopped response.";

    // Reset state
    isBotResponding = false;
    sendButton.disabled = false;
    stopButton.style.display = 'none';
    stopButton.removeEventListener('click', stopHandler);
  };

  stopButton.addEventListener('click', stopHandler);

  try {
    // === Send Request to Backend ===
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationHistory: [...conversationHistory, tempUserEntry]
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error! Status: ${response.status}`);
    }

    const data = await response.json();
    const botResponse = data.candidates[0].content.parts[0].text;

    // Update history
    conversationHistory.push(tempUserEntry);
    conversationHistory.push({ role: 'model', parts: [{ text: botResponse }] });

    // Replace loading with AI response (Markdown formatted)
    loadingMessage.classList.remove('loading');
    loadingMessage.querySelector('p').innerHTML = marked.parse(botResponse);

  } catch (error) {
    if (error.name !== "AbortError") {
      loadingMessage.classList.remove('loading');
      loadingMessage.querySelector('p').textContent =
        "Re-enter your query, I can't get it.";
      console.error('Error:', error);
    }
  } finally {
    // === Unlock state ===
    isBotResponding = false;
    sendButton.disabled = false;
    stopButton.style.display = 'none';
    stopButton.removeEventListener('click', stopHandler);
  }
});
