// DOM references
const loginModal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const loginName = document.getElementById("loginName");
const app = document.getElementById("app");
const currentUserLabel = document.getElementById("currentUserLabel");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const delBtn = document.getElementById("delBtn");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;
let messages = [];

// === LOGIN ===
function showLoginIfNeeded() {
  const stored = localStorage.getItem("chat_user");
  if (stored) {
    currentUser = stored;
    loginModal.style.display = "none";
    app.classList.remove("d-none");
    currentUserLabel.textContent = "You: " + currentUser;
    loadMessages();
    renderMessages();
  } else {
    loginModal.style.display = "block";
  }
}

loginBtn.addEventListener("click", () => {
  const name = loginName.value.trim();
  if (!name) return alert("Enter a name");
  currentUser = name;
  localStorage.setItem("chat_user", name);
  loginModal.style.display = "none";
  app.classList.remove("d-none");
  currentUserLabel.textContent = "You: " + currentUser;
  loadMessages();
  renderMessages();
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("chat_user");
  location.reload();
});

// === MESSAGES ===
function loadMessages() {
  messages = JSON.parse(localStorage.getItem("public_chat")) || [];
}

function saveMessages() {
  localStorage.setItem("public_chat", JSON.stringify(messages));
}

function renderMessages() {
  chatBox.innerHTML = "";
  messages.forEach(m => {
    const d = document.createElement("div");
    d.className = "msg " + (m.user === currentUser ? "sent" : "received");
    d.textContent = `${m.user}: ${m.text}`;
    chatBox.appendChild(d);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

// === SEND MESSAGE ===
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  messages.push({ user: currentUser, text, ts: Date.now() });
  saveMessages();
  renderMessages();
  messageInput.value = "";

  triggerAIReply(text);
}

// === SMART AI REPLY ===
function triggerAIReply(userText) {
  const lower = userText.toLowerCase();
  let replies = ["Interesting! Tell me more.", "Cool!", "Hmm, I see.", "That's nice!", "Tell me more about it."];

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    replies = ["Hey there! 👋", "Hello! How's it going?", "Hi! Nice to see you."];
  } else if (lower.includes("how are you")) {
    replies = ["I'm good! How about you?", "Feeling great today 😎", "Doing well, thanks!"];
  } else if (lower.includes("bye") || lower.includes("see you")) {
    replies = ["See you soon 👋", "Goodbye! Take care!", "Catch you later!"];
  } else if (lower.includes("love")) {
    replies = ["Love makes life beautiful ❤️", "Love is the essence of life 😍", "Spread love!"];
  } else if (lower.includes("badhiya")) {
    replies = ["Thanks bhai!", "Awesome! 😊", "Great!"];
  } else if (lower.includes("superb") || lower.includes("great")) {
    replies = ["Thanks! 🙌", "Glad you think so!", "You are amazing!"];
  } else if (lower.includes("joke") || lower.includes("funny")) {
    replies = [
      "Why don’t scientists trust atoms? Because they make up everything 😄",
      "I would tell you a joke about UDP… but you might not get it!",
      "Why did the computer go to the doctor? It caught a virus!"
    ];
  } else if (lower.includes("help") || lower.includes("support")) {
    replies = ["How can I assist you?", "What do you need help with?", "I am here to support you!"];
  }

  const aiReply = replies[Math.floor(Math.random() * replies.length)];

  setTimeout(() => {
    messages.push({ user: "AI Bot", text: aiReply, ts: Date.now() });
    saveMessages();
    renderMessages();
  }, 1000);
}

// === DELETE CHAT ===
delBtn.addEventListener("click", () => {
  if (!confirm("Delete all messages?")) return;
  localStorage.removeItem("public_chat");
  messages = [];
  renderMessages();
});

showLoginIfNeeded();
