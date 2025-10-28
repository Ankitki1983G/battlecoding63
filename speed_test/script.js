// -------------------- Firebase Setup --------------------
const firebaseConfig = {
  apiKey: "AIzaSyCfJs0uLDe69JauoJ9ePuDbykrHExXVLhQ",
  authDomain: "coding-battle-ad95a.firebaseapp.com",
  databaseURL: "https://coding-battle-ad95a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "coding-battle-ad95a",
  storageBucket: "coding-battle-ad95a.appspot.com",
  messagingSenderId: "331153847615",
  appId: "1:331153847615:web:97e0ae76edb9f1e4d08f8a"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// -------------------- HTML Elements --------------------
const joinSection = document.getElementById("join-section");
const gameSection = document.getElementById("game-section");
const resultSection = document.getElementById("result-section");
const createRoomBtn = document.getElementById("createRoom");
const joinRoomBtn = document.getElementById("joinRoom");
const playerNameInput = document.getElementById("playerName");
const roomIdInput = document.getElementById("roomId");
const statusText = document.getElementById("statusText");
const playersEl = document.getElementById("players");
const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answer");
const submitBtn = document.getElementById("submit");
const timerEl = document.getElementById("timer");
const scoreboard = document.getElementById("scoreboard");
const winnerText = document.getElementById("winnerText");
const restartBtn = document.getElementById("restart");
const leaderboardList = document.getElementById("leaderboardList");
const clearLeaderboardBtn = document.getElementById("clearLeaderboard");
const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendMsg = document.getElementById("sendMsg");

// -------------------- Variables --------------------
let playerName, roomId, playerKey;
let timer, timeLeft = 10, currentIndex = 0;
let questions = [
  { q: "HTML full form?", a: "hypertext markup language" },
  { q: "CSS full form?", a: "cascading style sheets" },
  { q: "Python comment symbol?", a: "#" },
  { q: "JS file extension?", a: ".js" },
  { q: "Binary search time complexity?", a: "o(log n)" },
  { q: "OS me process scheduling kis ke liye hoti hai?", a: "cpu allocation" },
  { q: "Python list symbol?", a: "[]" }
];

// -------------------- Create Room --------------------
createRoomBtn.onclick = async () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) return alert("Enter your name!");
  roomId = Math.floor(1000 + Math.random() * 9000).toString();
  const roomRef = db.ref("rooms/" + roomId);
  await roomRef.set({
    player1: { name: playerName, score: 0 },
    player2: { name: "", score: 0 },
    questionIndex: 0,
    fastestAnswer: "",
    started: false,
    messages: []
  });
  playerKey = "player1";
  statusText.innerHTML = `✅ Room Created! Share ID: <b>${roomId}</b>`;
  roomIdInput.value = roomId;

  roomRef.on("value", snapshot => {
    const data = snapshot.val();
    if (data.player2.name && !data.started) {
      roomRef.update({ started: true });
      startGame(data);
    }
  });
};

// -------------------- Join Room --------------------
joinRoomBtn.onclick = async () => {
  playerName = playerNameInput.value.trim();
  roomId = roomIdInput.value.trim();
  if (!playerName || !roomId) return alert("Enter details!");
  const roomRef = db.ref("rooms/" + roomId);
  const snapshot = await roomRef.get();
  if (!snapshot.exists()) return alert("Room not found!");
  const data = snapshot.val();
  if (data.player2.name) return alert("Room full!");
  await roomRef.update({ player2: { name: playerName, score: 0 } });
  playerKey = "player2";
  startGame(data);
};

// -------------------- Start Game --------------------
function startGame(data) {
  joinSection.classList.add("hidden");
  gameSection.classList.remove("hidden");
  playersEl.textContent = `${data.player1.name} 🆚 ${data.player2.name}`;
  listenRoom();
  setupChat();
}

// -------------------- Listen Room --------------------
function listenRoom() {
  const roomRef = db.ref("rooms/" + roomId);
  roomRef.on("value", snapshot => {
    const data = snapshot.val();
    if (!data) return;

    currentIndex = data.questionIndex;
    if (currentIndex < questions.length) {
      questionEl.textContent = questions[currentIndex].q;
      startTimer(roomRef);
    } else {
      endGame(data);
    }

    scoreboard.innerHTML = `${data.player1.name}: ${data.player1.score}<br>${data.player2.name}: ${data.player2.score}`;

    chatBox.innerHTML = "";
    if (data.messages) {
      Object.values(data.messages).forEach(msg => {
        const div = document.createElement("div");
        div.className = "chat-msg";
        div.innerHTML = `<span class="chat-name">${msg.sender}: </span>${msg.text}`;
        chatBox.appendChild(div);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });
}

// -------------------- Timer --------------------
function startTimer(roomRef) {
  clearInterval(timer);
  timeLeft = 10;
  timerEl.textContent = `⏱ ${timeLeft}s`;

  timer = setInterval(async () => {
    timeLeft--;
    timerEl.textContent = `⏱ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      const snapshot = await roomRef.get();
      const data = snapshot.val();
      await roomRef.update({ questionIndex: data.questionIndex + 1, fastestAnswer: "" });
    }
  }, 1000);
}

// -------------------- Submit Answer --------------------
submitBtn.onclick = async () => {
  const ans = answerInput.value.trim().toLowerCase();
  const roomRef = db.ref("rooms/" + roomId);
  const snapshot = await roomRef.get();
  const data = snapshot.val();
  const correct = questions[data.questionIndex].a.toLowerCase();

  if (ans === correct) {
    let playerData = data[playerKey];
    if (!data.fastestAnswer) {
      playerData.score += timeLeft * 5 + 10; // bonus fastest
      await roomRef.update({ fastestAnswer: playerKey });
    } else {
      playerData.score += timeLeft * 5;
    }
    await roomRef.update({ [playerKey]: playerData });
  }

  await roomRef.update({ questionIndex: data.questionIndex + 1, fastestAnswer: "" });
  answerInput.value = "";
};

// -------------------- End Game --------------------
function endGame(data) {
  clearInterval(timer);
  gameSection.classList.add("hidden");
  resultSection.classList.remove("hidden");

  const player1Score = data.player1.score;
  const player2Score = data.player2.score;

  let winnerTextStr = "";
  if (player1Score > player2Score) winnerTextStr = `🏆 ${data.player1.name} Wins! Score: ${player1Score}`;
  else if (player2Score > player1Score) winnerTextStr = `🏆 ${data.player2.name} Wins! Score: ${player2Score}`;
  else winnerTextStr = `🤝 It's a Tie! ${player1Score} - ${player2Score}`;

  winnerText.textContent = winnerTextStr;

  saveLeaderboard(data.player1.name, player1Score);
  saveLeaderboard(data.player2.name, player2Score);
  showLeaderboard();
}

// -------------------- Leaderboard --------------------
function saveLeaderboard(name, score) {
  let lb = JSON.parse(localStorage.getItem("leaderboard")) || [];
  lb.push({ name, score });
  lb.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(lb.slice(0, 10)));
}

function showLeaderboard() {
  leaderboardList.innerHTML = "";
  const lb = JSON.parse(localStorage.getItem("leaderboard")) || [];
  lb.forEach((e, i) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.innerHTML = `<b>${i + 1}. ${e.name}</b><span>${e.score}</span>`;
    leaderboardList.appendChild(li);
  });
}

showLeaderboard();
clearLeaderboardBtn.onclick = () => {
  localStorage.removeItem("leaderboard");
  showLeaderboard();
};

// -------------------- Restart --------------------
restartBtn.onclick = () => {
  resultSection.classList.add("hidden");
  joinSection.classList.remove("hidden");
};

// -------------------- Chat --------------------
function setupChat() {
  const chatRef = db.ref(`rooms/${roomId}/messages`);
  sendMsg.onclick = async () => {
    const msg = chatInput.value.trim();
    if (!msg) return;
    await chatRef.push({ sender: playerName, text: msg });
    chatInput.value = "";
  };
  chatRef.on("child_added", snap => {
    const msg = snap.val();
    const div = document.createElement("div");
    div.classList.add("chat-msg");
    div.innerHTML = `<span class="chat-name">${msg.sender}:</span> ${msg.text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
