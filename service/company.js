const PRESETS = {
  office: "사무실 내 서류를 정리하고 자료를 폴더별로 분류합니다. 간단한 데이터를 컴퓨터에 입력하고, 방문객 응대와 전화 응대를 보조합니다.",
  cafe: "카페에서 매장 정돈, 컵·식기 정리, 재료 보충, 손님 안내를 수행합니다. 메뉴판을 정리하고 깨끗하게 닦는 일도 포함합니다.",
  data: "엑셀과 사내 시스템에 텍스트 자료를 입력하고, 데이터 오타와 누락을 확인합니다. 동일한 형식으로 자료를 가공하는 반복 업무입니다.",
  logistics: "택배 박스에 종이를 접어 넣고, 포장지를 정해진 모양으로 접습니다. 완성된 박스의 외관을 확인하고 라벨을 부착합니다."
};

const KEYWORDS = [
  { match: /(서류|문서|자료|폴더).*(정리|분류|정돈)/, task: "서류 정리·분류", skills: ["꼼꼼함", "반복집중력"], time: "30분~1시간", level: "하" },
  { match: /(데이터|엑셀|시스템).*(입력|기록|타이핑)/, task: "데이터 입력", skills: ["꼼꼼함", "PC활용"], time: "1~2시간", level: "중" },
  { match: /(전화|방문객|손님).*(응대|안내)/, task: "방문·전화 응대 보조", skills: ["소통", "친절"], time: "수시", level: "중" },
  { match: /(컵|식기|재료|메뉴).*(정리|보충|닦)/, task: "매장 재료·집기 정돈", skills: ["소근육", "꼼꼼함"], time: "30분~1시간", level: "하" },
  { match: /(오타|누락|검수|확인)/, task: "데이터 검수", skills: ["집중력", "꼼꼼함"], time: "1시간", level: "중" },
  { match: /(가공|동일.*형식)/, task: "데이터 형식 통일", skills: ["반복집중력", "PC활용"], time: "1~2시간", level: "중" },
  { match: /(박스|종이).*(접|넣)/, task: "포장지·박스 접기", skills: ["소근육", "반복집중력"], time: "1~2시간", level: "하" },
  { match: /(외관|라벨|부착)/, task: "포장 외관 검수 및 라벨 부착", skills: ["꼼꼼함", "시각인지"], time: "30분", level: "중" },
  { match: /(닦|청소)/, task: "청결 유지", skills: ["꼼꼼함", "체력"], time: "수시", level: "하" }
];

const CANDIDATES = [
  { name: "김OO (28세)", strength: "반복집중력 92%, 꼼꼼함 90%", note: "발달장애, 도담 표준사업장 추천", match: 91 },
  { name: "박OO (35세)", strength: "꼼꼼함 88%, PC활용 82%", note: "경력단절 5년, 워크넷 등록", match: 86 },
  { name: "이OO (24세)", strength: "소통 85%, 친절 80%", note: "청년 구직자, 한국장애인고용공단 연계", match: 78 },
  { name: "최OO (41세)", strength: "소근육 90%, 반복집중력 84%", note: "지체장애, 지원고용 훈련 수료", match: 74 }
];

let extractedTasks = [];

document.querySelectorAll(".preset-btn").forEach((b) =>
  b.addEventListener("click", () => {
    document.getElementById("jobInput").value = PRESETS[b.dataset.preset];
  })
);

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const text = document.getElementById("jobInput").value.trim();
  if (!text) {
    showToast("업무 설명을 입력해주세요.");
    return;
  }
  extractedTasks = KEYWORDS.filter((k) => k.match.test(text));
  if (extractedTasks.length === 0) {
    extractedTasks = [{ task: "일반 보조 업무", skills: ["기본 소통", "기본 집중력"], time: "수시", level: "하" }];
  }
  goToStep(2);
});

document.querySelectorAll("[data-goto]").forEach((b) =>
  b.addEventListener("click", () => goToStep(Number(b.dataset.goto)))
);

document.getElementById("requestReview").addEventListener("click", () => {
  const pending = JSON.parse(localStorage.getItem("eatta_curator_pending") || "[]");
  pending.push({
    id: "match-" + Date.now(),
    company: "(주)일잇다데모기업",
    tasks: extractedTasks.map((t) => t.task),
    candidate: CANDIDATES[0].name,
    candidateStrength: CANDIDATES[0].strength,
    similarity: CANDIDATES[0].match,
    requestedAt: new Date().toLocaleString("ko-KR")
  });
  localStorage.setItem("eatta_curator_pending", JSON.stringify(pending));
  showToast("큐레이터 검토가 요청되었습니다. 큐레이터 화면에서 확인하세요.");
  setTimeout(() => (window.location.href = "curator.html"), 1400);
});

function goToStep(n) {
  document.querySelectorAll(".step").forEach((s) => {
    const num = Number(s.dataset.step);
    s.classList.toggle("active", num === n);
    s.classList.toggle("done", num < n);
  });
  for (let i = 1; i <= 3; i++) {
    document.getElementById("panel-" + i).style.display = i === n ? "block" : "none";
  }
  if (n === 2) renderTasks();
  if (n === 3) renderCandidates();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderTasks() {
  const grid = document.getElementById("taskGrid");
  grid.innerHTML = "";
  extractedTasks.forEach((t, i) => {
    const card = document.createElement("article");
    card.className = "result-card";
    card.style.animationDelay = i * 140 + "ms";
    const levelColor = t.level === "하" ? "#16a34a" : t.level === "중" ? "#2563eb" : "#dc2626";
    card.innerHTML = `
      <span class="match" style="background:rgba(37,99,235,0.1); color:#2563eb;">과제 #${i + 1}</span>
      <h3 class="task-title"></h3>
      <p class="meta">예상 시간 ${t.time} · 난이도 <strong style="color:${levelColor}">${t.level}</strong></p>
      <div class="tag-row" style="margin-top:10px;">${t.skills.map((s) => `<span class="tag">${s}</span>`).join("")}</div>
    `;
    grid.appendChild(card);
    typeText(card.querySelector(".task-title"), t.task, i * 140 + 200);
  });
}

function typeText(el, text, delay) {
  el.classList.add("typing-cursor");
  el.textContent = "";
  setTimeout(() => {
    let i = 0;
    const iv = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) {
        clearInterval(iv);
        el.classList.remove("typing-cursor");
      }
    }, 35);
  }, delay);
}

function renderCandidates() {
  const grid = document.getElementById("candidateGrid");
  grid.innerHTML = "";
  CANDIDATES.forEach((c, i) => {
    const card = document.createElement("article");
    card.className = "result-card";
    card.style.animationDelay = i * 90 + "ms";
    card.innerHTML = `
      <span class="match">매칭률 ${c.match}%</span>
      <h3>${c.name}</h3>
      <p class="meta">${c.note}</p>
      <p style="margin-bottom:10px; font-size:0.92rem; color:#475569;">강점: ${c.strength}</p>
      <div class="tag-row"><span class="tag">큐레이터 검토 필요</span></div>
    `;
    grid.appendChild(card);
  });
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}
