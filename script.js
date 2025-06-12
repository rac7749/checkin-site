let currentUser = "userA";
let checkinData = {};

function loadProgress() {
  const data = localStorage.getItem(`checkin_${currentUser}`);
  return data ? JSON.parse(data) : Array(7).fill(false);
}

function saveProgress() {
  localStorage.setItem(`checkin_${currentUser}`, JSON.stringify(checkinData[currentUser]));
}

function renderUI() {
  document.getElementById("currentUser").textContent = currentUser;
  const grid = document.getElementById("checkinGrid");
  grid.innerHTML = "";
  checkinData[currentUser].forEach((checked, index) => {
    const cell = document.createElement("div");
    cell.classList.add("checkin-cell");
    if (checked) cell.classList.add("stamped");
    cell.textContent = checked ? "✔" : index + 1;
    cell.onclick = () => {
      if (!checked && canCheckinToday()) {
        checkinData[currentUser][index] = true;
        saveProgress();
        renderUI();
        updateRewardCount();
      }
    };
    grid.appendChild(cell);
  });
}

function updateRewardCount() {
  const count = localStorage.getItem(`reward_${currentUser}`) || "0";
  const stamped = checkinData[currentUser].filter(Boolean).length;
  if (stamped >= 7) {
    localStorage.setItem(`reward_${currentUser}`, String(parseInt(count) + 1));
    checkinData[currentUser] = Array(7).fill(false);
    saveProgress();
  }
  document.getElementById("rewardCount").textContent = localStorage.getItem(`reward_${currentUser}`) || "0";
}

function switchUser(userId) {
  currentUser = userId;
  if (!checkinData[currentUser]) {
    checkinData[currentUser] = loadProgress();
  }
  renderUI();
  updateRewardCount();
}

function canCheckinToday() {
  const today = new Date().toDateString();
  const lastCheckinKey = `lastCheckin_${currentUser}`;
  const last = localStorage.getItem(lastCheckinKey);
  if (last === today) return false;
  localStorage.setItem(lastCheckinKey, today);
  return true;
}

window.onload = () => {
  checkinData[currentUser] = loadProgress();
  renderUI();
  updateRewardCount();
};
