// === DOM Elements ===
const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendButton = document.querySelector('.send-icon');
const stopButton = document.getElementById('stop-button');

// Backend endpoint (your Flask server)
const API_URL = 'http://localhost:5000/chat';

// System prompt
const systemPrompt = `
You are Helios, a friendly and knowledgeable AI assistant specializing 
in space weather and astronomy. Provide clear, accurate answers. Format using Markdown.
`;

// Conversation state
let conversationHistory = [
  { role: 'user', parts: [{ text: systemPrompt }] },
  { role: 'model', parts: [{ text: "Understood! I am Helios, ready to explore the cosmos. 🚀" }] }
];

let isBotResponding = false;
let controller = null;

// Add message to chat window
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

// Form submit
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isBotResponding) return;

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  addMessage('user', userMessage);
  userInput.value = '';

  const loadingMessage = addMessage('bot', '');
  loadingMessage.classList.add('loading');

  const tempUserEntry = { role: 'user', parts: [{ text: userMessage }] };

  isBotResponding = true;
  controller = new AbortController();
  sendButton.disabled = true;
  stopButton.style.display = 'flex';

  const stopHandler = () => {
    if (controller) controller.abort();
    loadingMessage.classList.remove('loading');
    loadingMessage.querySelector('p').textContent = "⏹ Stopped response.";
    isBotResponding = false;
    sendButton.disabled = false;
    stopButton.style.display = 'none';
    stopButton.removeEventListener('click', stopHandler);
  };
  stopButton.addEventListener('click', stopHandler);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationHistory: [...conversationHistory, tempUserEntry] }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error! Status: ${response.status}`);
    }

    const data = await response.json();
    const botResponse = data.candidates[0].content.parts[0].text;

    conversationHistory.push(tempUserEntry);
    conversationHistory.push({ role: 'model', parts: [{ text: botResponse }] });

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
    isBotResponding = false;
    sendButton.disabled = false;
    stopButton.style.display = 'none';
    stopButton.removeEventListener('click', stopHandler);
  }
});
