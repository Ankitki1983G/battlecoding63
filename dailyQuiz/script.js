// Elements
const playerNameInput = document.getElementById("playerName");
const startQuizBtn = document.getElementById("startQuiz");
const loginSection = document.getElementById("login-section");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");
const questionEl = document.getElementById("question");
const categoryEl = document.getElementById("category");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const leaderboardEl = document.getElementById("leaderboard");
const playAgainBtn = document.getElementById("playAgain");
const timerEl = document.getElementById("timer");
const timerBar = document.getElementById("timerBar");

let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;
let playerName = "";

// Shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Question data
const defaultQuestions = [
  { q: "What is the capital of France?", options: ["London", "Paris", "Rome", "Berlin"], answer: "Paris", category: "Geography" },
  { q: "Which language runs in a web browser?", options: ["Python", "C", "JavaScript", "Java"], answer: "JavaScript", category: "JS" },
  { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Transfer Markup Language", "None"], answer: "Hyper Text Markup Language", category: "HTML" },
  { q: "Which symbol is used for comments in Python?", options: ["//", "#", "/* */", "<!-- -->"], answer: "#", category: "Python" },
  { q: "What is 5 + 3 * 2?", options: ["16", "13", "10", "11"], answer: "11", category: "Math" },
  { q: "Which company developed Java?", options: ["Microsoft", "Apple", "Sun Microsystems", "IBM"], answer: "Sun Microsystems", category: "Java" },
  { q: "Which CSS property changes text color?", options: ["font-color", "text-color", "color", "background-color"], answer: "color", category: "CSS" },
  { q: "Which keyword creates a function in JavaScript?", options: ["def", "function", "fun", "lambda"], answer: "function", category: "JS" },
  { q: "Which HTML tag is used for the largest heading?", options: ["<h1>", "<h6>", "<head>", "<heading>"], answer: "<h1>", category: "HTML" },
  { q: "Which operator is used for equality check in JavaScript?", options: ["=", "==", "===", "!="], answer: "===", category: "JS" },
  { q: "Which Python data type is immutable?", options: ["List", "Tuple", "Dictionary", "Set"], answer: "Tuple", category: "Python" },
  { q: "What is the output of 10 % 3?", options: ["3", "10", "1", "0"], answer: "1", category: "Math" },
  { q: "Which tag is used to link CSS in HTML?", options: ["<script>", "<link>", "<style>", "<css>"], answer: "<link>", category: "HTML" },
  { q: "Which of these is not a JavaScript framework?", options: ["React", "Angular", "Django", "Vue"], answer: "Django", category: "JS" },
  { q: "Which method converts JSON to an object in JS?", options: ["JSON.toObject()", "JSON.parse()", "JSON.stringify()", "JSON.convert()"], answer: "JSON.parse()", category: "JS" },
  { q: "Which language runs in a web browser?", options: ["Python", "C", "JavaScript", "Java"], answer: "JavaScript", category: "JavaScript" },
  { q: "Which keyword declares a variable in JavaScript?", options: ["var", "let", "const", "All of the above"], answer: "All of the above", category: "JavaScript" },
  { q: "Which operator is used for strict equality check?", options: ["==", "===", "=", "!="], answer: "===", category: "JavaScript" },
  { q: "Which method converts JSON string to object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObject()"], answer: "JSON.parse()", category: "JavaScript" },
  { q: "What will `typeof null` return in JavaScript?", options: ["null", "object", "undefined", "string"], answer: "object", category: "JavaScript" },
  { q: "Which symbol is used for single-line comments in JS?", options: ["#", "//", "/* */", "<!-- -->"], answer: "//", category: "JavaScript" },
  { q: "Which symbol is used for comments in Python?", options: ["//", "#", "/* */", "<!-- -->"], answer: "#", category: "Python" },
  { q: "Which of the following is immutable?", options: ["List", "Tuple", "Dictionary", "Set"], answer: "Tuple", category: "Python" },
  { q: "Which keyword is used to create a function in Python?", options: ["function", "def", "fun", "lambda"], answer: "def", category: "Python" },
  { q: "Which method is used to get input from user?", options: ["input()", "scan()", "read()", "gets()"], answer: "input()", category: "Python" },
  { q: "What is the output of 10 % 3?", options: ["1", "3", "0", "10"], answer: "1", category: "Python" },
  { q: "Which function converts string to integer?", options: ["int()", "float()", "str()", "eval()"], answer: "int()", category: "Python" },
    { q: "Which company developed Java?", options: ["Microsoft", "Sun Microsystems", "Apple", "IBM"], answer: "Sun Microsystems", category: "Java" },
  { q: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Array", "Tree"], answer: "Queue", category: "General" },
  { q: "What does IDE stand for?", options: ["Internal Development Engine", "Integrated Development Environment", "Integrated Data Encoder", "None"], answer: "Integrated Development Environment", category: "General" },
  { q: "What is 5 + 3 * 2?", options: ["11", "16", "10", "13"], answer: "11", category: "Math" },
  { q: "Which operator is used to assign a value?", options: ["==", "=", "===", "<-"], answer: "=", category: "General" },
  { q: "What is the full form of SQL?", options: ["Structured Query Language", "Stylish Question Language", "System Query Logic", "Sequential Query Language"], answer: "Structured Query Language", category: "Database" }

];

// Start quiz
startQuizBtn.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) return alert("Enter your name!");

  questions = shuffleArray([...defaultQuestions]).slice(0, 10); // Random 10 questions
  score = 0;
  currentIndex = 0;

  loginSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  scoreEl.textContent = score;

  loadQuestion();
});

// Load question
function loadQuestion() {
  if (currentIndex >= questions.length) return endQuiz();

  clearInterval(timer);
  timeLeft = 10;

  const q = questions[currentIndex];
  questionEl.textContent = `Q${currentIndex + 1}. ${q.q}`;
  categoryEl.textContent = `Category: ${q.category || "General"}`;
  optionsEl.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = opt;
    btn.addEventListener("click", () => handleAnswer(btn, opt, q.answer));
    optionsEl.appendChild(btn);
  });

  updateTimerDisplay();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      markWrongAndNext(q.answer);
    }
  }, 1000);
}

// Update timer and progress bar
function updateTimerDisplay() {
  timerEl.textContent = `${timeLeft}s`;
  const percent = (timeLeft / 10) * 100;
  timerBar.style.width = percent + "%";

  if (timeLeft > 5) timerBar.className = "progress-bar bg-success";
  else if (timeLeft > 2) timerBar.className = "progress-bar bg-warning";
  else timerBar.className = "progress-bar bg-danger";
}

// Handle answer click
function handleAnswer(btn, selected, correct) {
  clearInterval(timer);
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach(b => (b.disabled = true));

  if (selected === correct) {
    btn.classList.add("correct");
    score += 10;
  } else {
    btn.classList.add("wrong");
    const correctBtn = [...buttons].find(b => b.textContent === correct);
    if (correctBtn) correctBtn.classList.add("correct");
  }

  scoreEl.textContent = score;
  currentIndex++;
  setTimeout(loadQuestion, 1200);
}

// Auto mark wrong if time out
function markWrongAndNext(correct) {
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach(b => (b.disabled = true));
  const correctBtn = [...buttons].find(b => b.textContent === correct);
  if (correctBtn) correctBtn.classList.add("correct");

  currentIndex++;
  setTimeout(loadQuestion, 1200);
}

// End quiz
function endQuiz() {
  clearInterval(timer);
  quizSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
  document.getElementById("finalScore").textContent = `🎯 ${playerName}, Your Score: ${score}`;
  saveLeaderboard();
  showLeaderboard();
}

// Leaderboard functions
function saveLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  const now = new Date();
  const timestamp = now.toLocaleString();
  leaderboard.push({ name: playerName, score, timestamp });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function showLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]")
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  leaderboardEl.innerHTML = leaderboard
    .map((e, i) => `<li>${i + 1}. ${e.name} - ${e.score} pts (${e.timestamp})</li>`)
    .join("");
}

// Play again
playAgainBtn.addEventListener("click", () => {
  resultSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  playerNameInput.value = "";
});
const clearLeaderboardBtn = document.getElementById("clearLeaderboard");

clearLeaderboardBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the leaderboard?")) {
    localStorage.removeItem("leaderboard"); // Clear storage
    showLeaderboard(); // Update UI
  }
});

