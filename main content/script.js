window.addEventListener("DOMContentLoaded", () => {
  // --------------------
  // USER INFO
  // --------------------
  const nameEl = document.querySelector("#profileName");
  const avatar = document.querySelector("#avatar");
  let storedUser = localStorage.getItem("loggedInUser") || "Ankit Singh";
  nameEl.textContent = storedUser;

  let coins = parseInt(localStorage.getItem("userCoins") || "120");
  document.getElementById("coinCount").textContent = coins;

  function updateCoins(val) {
    coins += val;
    localStorage.setItem("userCoins", coins);
    document.getElementById("coinCount").textContent = coins;
  }

  // --------------------
  // PROGRESS BAR
  // --------------------
  const plusBtn = document.getElementById("plusBtn");
  const bar = document.getElementById("progressBar");
  let progress = parseInt(localStorage.getItem("progress") || "0");
  bar.style.width = progress + "%";

  plusBtn.addEventListener("click", () => {
    progress = Math.min(100, progress + 10);
    bar.style.width = progress + "%";
    localStorage.setItem("progress", progress);
    showQuickPanel("Progress updated! Current: " + progress + "%");
  });

  // --------------------
  // QUIZ CARD CLICKS
  // --------------------
  const quizCards = {
    "daily-test-card": "/dailyQuiz/index.html",
    "language-quiz": "/Quiz/index.html",
    "speed-test": "/speed test/index.html"
  };

  Object.keys(quizCards).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => {
      window.location.href = quizCards[id];
    });
  });

  // --------------------
  // QUICK PANEL
  // --------------------
  const quickPanel = document.getElementById("quickPanel");
  const quickPanelContent = document.getElementById("quickPanelContent");
  const closeQuickPanel = document.getElementById("closeQuickPanel");

  function showQuickPanel(msg) {
    quickPanelContent.innerHTML = msg;
    quickPanel.classList.add("show");
    setTimeout(() => quickPanel.classList.remove("show"), 3000);
  }

  closeQuickPanel.addEventListener("click", () => quickPanel.classList.remove("show"));

  // Progress quick action
  document.getElementById("progressBtn").addEventListener("click", () => {
    const storedProgress = localStorage.getItem("progress") || 0;
    showQuickPanel("Your Progress: " + storedProgress + "%");
  });

  // Friends quick action
  document.getElementById("friendsBtn").addEventListener("click", () => {
    const friends = JSON.parse(localStorage.getItem("friends") || '["Ankush","Sachin","Sonu"]');
    showQuickPanel("Friends:<br>" + friends.join("<br>"));
  });

  // Language toggle
  let lang = localStorage.getItem("lang") || "en";
  function setLanguage(l) {
    lang = l;
    localStorage.setItem("lang", lang);
    if (lang === "en") {
      document.getElementById("dailyTestLabel").textContent = "Daily Test";
      document.getElementById("dailyTestDesc").textContent = "Keep learning every day";
      document.getElementById("langQuizTitle").textContent = "Language Quiz";
      document.getElementById("speedTestTitle").textContent = "Speed Test";
      document.getElementById("quizzesTitle").textContent = "Quizzes & Missions";
    } else {
      document.getElementById("dailyTestLabel").textContent = "दैनिक परीक्षा";
      document.getElementById("dailyTestDesc").textContent = "हर दिन सीखते रहें";
      document.getElementById("langQuizTitle").textContent = "भाषा क्विज़";
      document.getElementById("speedTestTitle").textContent = "स्पीड टेस्ट";
      document.getElementById("quizzesTitle").textContent = "क्विज़ और मिशन";
    }
  }
  setLanguage(lang);

  document.getElementById("languageBtn").addEventListener("click", () => {
    setLanguage(lang === "en" ? "hi" : "en");
    showQuickPanel("Language changed to " + (lang === "en" ? "English" : "Hindi"));
  });

  // --------------------
  // PROFILE MODAL
  // --------------------
  const profileBtn = document.getElementById("profileBtn");
  const profileModal = new bootstrap.Modal(document.getElementById("profileModal"));
  const profileModalName = document.getElementById("profileModalName");
  const profileModalAvatar = document.getElementById("avatarPreviewModal");
  const profileModalChangeName = document.getElementById("profileModalChangeName");
  const profileModalAvatarSelect = document.getElementById("profileModalAvatarSelect");
  const profileModalSaveBtn = document.getElementById("profileModalSaveBtn");

  profileBtn.addEventListener("click", () => {
    profileModalName.textContent = storedUser;
    profileModalAvatar.textContent = avatar.textContent;
    profileModalChangeName.value = storedUser;
    profileModalAvatarSelect.value = avatar.textContent;
    profileModal.show();
  });

  profileModalSaveBtn.addEventListener("click", () => {
    storedUser = profileModalChangeName.value;
    nameEl.textContent = storedUser;
    avatar.textContent = profileModalAvatarSelect.value;
    localStorage.setItem("loggedInUser", storedUser);
    profileModal.hide();
    showQuickPanel("Profile updated!");
  });

  // Footer profile
  document.getElementById("footerProfileBtn").addEventListener("click", () => profileBtn.click());

  // Footer navigation
  document.getElementById("footer_test_btn").addEventListener("click", () => {
    window.location.href = "/dailyQuiz/index.html";
  });
  document.getElementById("community_btn").addEventListener("click", () => {
    window.location.href = "/community/community.html";
  });

  // --------------------
  // SETTINGS MODAL
  // --------------------
  const settingsModalEl = new bootstrap.Modal(document.getElementById("settingsModal"));
  const settingsBtn = document.getElementById("settingsBtn");
  const soundToggle = document.getElementById("soundToggle");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const resetBtn = document.getElementById("resetProgress");
  const changeNameInput = document.getElementById("changeName");
  const avatarSelect = document.getElementById("avatarSelect");

  settingsBtn.addEventListener("click", () => {
    changeNameInput.value = storedUser;
    avatarSelect.value = avatar.textContent;
    soundToggle.checked = localStorage.getItem("soundEnabled") !== "false";
    darkModeToggle.checked = localStorage.getItem("darkMode") === "true";
    settingsModalEl.show();
  });

  // Sound toggle
  soundToggle.addEventListener("change", () => {
    localStorage.setItem("soundEnabled", soundToggle.checked);
    showQuickPanel(soundToggle.checked ? "🔊 Sound Enabled" : "🔇 Sound Disabled");
  });

  // Dark mode toggle
  darkModeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", darkModeToggle.checked);
    localStorage.setItem("darkMode", darkModeToggle.checked);
  });

  // Name & Avatar change
  changeNameInput.addEventListener("change", () => {
    storedUser = changeNameInput.value;
    nameEl.textContent = storedUser;
    localStorage.setItem("loggedInUser", storedUser);
    showQuickPanel("Name updated!");
  });
  avatarSelect.addEventListener("change", () => {
    avatar.textContent = avatarSelect.value;
    showQuickPanel("Avatar updated!");
  });

  // Reset progress
  resetBtn.addEventListener("click", () => {
    if (confirm("Reset all progress, coins, achievements?")) {
      localStorage.clear();
      location.reload();
    }
  });

  // Load saved settings
  document.body.classList.toggle("dark-mode", localStorage.getItem("darkMode") === "true");

});
