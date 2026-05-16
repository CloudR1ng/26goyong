const STORAGE_KEY = "eatta_curator_matches";

const SEED = [
  {
    id: "m-001",
    company: "한빛 사회적기업",
    tasks: ["서류 정리·분류", "데이터 입력"],
    candidate: "김OO (28세)",
    candidateStrength: "반복집중력 92%, 꼼꼼함 90%",
    similarity: 91,
    status: "pending",
    reason: "반복집중력 강점이 서류 정리 과제 요구역량과 코사인 유사도 0.91로 매칭됨.",
    history: ["2026-04-10 한빛 사회적기업 단기 과제 완료", "2026-02-22 NCS 사무행정 기초 수료"]
  },
  {
    id: "m-002",
    company: "오색 콘텐츠랩",
    tasks: ["이미지 색상 태깅"],
    candidate: "이OO (24세)",
    candidateStrength: "색감인지 88%, 꼼꼼함 78%",
    similarity: 86,
    status: "pending",
    reason: "포트폴리오의 색채 분석에서 우수한 색감 인지력이 확인됨. 직무 요구역량과 잘 일치.",
    history: ["2026-03-15 오색 콘텐츠랩 체험 과제 완료"]
  },
  {
    id: "m-003",
    company: "도담 표준사업장",
    tasks: ["포장지·종이 접기"],
    candidate: "최OO (41세)",
    candidateStrength: "소근육 90%, 반복집중력 84%",
    similarity: 74,
    status: "pending",
    reason: "소근육 조정 능력이 표준사업장 작업 요구사항과 적합하나, 일부 항목은 추가 훈련 권장.",
    history: ["2026-01-08 지원고용 훈련 6주차 수료"]
  }
];

let store = load();
const ALL_TABS = ["pending", "hold", "approved", "rejected"];
let currentTab = "pending";

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  // pull from company.js handoff queue too
  const pending = JSON.parse(localStorage.getItem("eatta_curator_pending") || "[]");
  const initial = [...SEED, ...pending.map((p) => ({
    id: p.id,
    company: p.company,
    tasks: p.tasks,
    candidate: p.candidate,
    candidateStrength: p.candidateStrength,
    similarity: p.similarity,
    status: "pending",
    reason: "기업 화면에서 큐레이터 검토를 요청한 매칭입니다.",
    history: [p.requestedAt + " 검토 요청 접수"]
  }))];
  return initial;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  localStorage.setItem("eatta_curator_pending", "[]");
}

// Pull new handoffs each render
function syncHandoffs() {
  const pending = JSON.parse(localStorage.getItem("eatta_curator_pending") || "[]");
  if (pending.length) {
    pending.forEach((p) => {
      if (!store.find((m) => m.id === p.id)) {
        store.push({
          id: p.id,
          company: p.company,
          tasks: p.tasks,
          candidate: p.candidate,
          candidateStrength: p.candidateStrength,
          similarity: p.similarity,
          status: "pending",
          reason: "기업 화면에서 큐레이터 검토를 요청한 매칭입니다.",
          history: [p.requestedAt + " 검토 요청 접수"]
        });
      }
    });
    localStorage.setItem("eatta_curator_pending", "[]");
    save();
  }
}

document.querySelectorAll(".side-tab[data-tab]").forEach((b) =>
  b.addEventListener("click", () => {
    currentTab = b.dataset.tab;
    document.querySelectorAll(".side-tab[data-tab]").forEach((x) => x.classList.toggle("active", x === b));
    render();
  })
);

document.getElementById("seedBtn").addEventListener("click", () => {
  store = SEED.slice();
  save();
  showToast("샘플 데이터를 채웠습니다.");
  render();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  store = [];
  save();
  showToast("모든 매칭을 초기화했습니다.");
  render();
});

function render() {
  syncHandoffs();
  ALL_TABS.forEach((t) => {
    document.getElementById("cnt-" + t).textContent = store.filter((m) => m.status === t).length;
  });

  const list = document.getElementById("matchList");
  list.innerHTML = "";
  const items = store.filter((m) => m.status === currentTab);

  if (items.length === 0) {
    list.innerHTML = `<div class="empty"><div class="big">📭</div><p>해당 상태의 매칭이 없습니다. 좌측 "샘플 데이터 채우기"로 시작하거나 기업 화면에서 검토를 요청해보세요.</p></div>`;
    return;
  }

  items.forEach((m, i) => {
    const card = document.createElement("article");
    card.className = "match-card";
    card.style.opacity = "0";
    card.style.animationDelay = i * 70 + "ms";
    card.innerHTML = `
      <div>
        <div class="who">🏢 ${m.company}</div>
        <div class="what">과제: ${m.tasks.join(", ")}</div>
        <div class="what" style="margin-top:6px;">근거: ${m.reason}</div>
        <details style="margin-top:8px;">
          <summary style="cursor:pointer; font-size:0.86rem; color:#2563eb; font-weight:700;">수행 이력 보기 (블록체인 기록)</summary>
          <ul style="margin-top:8px; padding-left:18px; color:#475569; font-size:0.86rem;">
            ${m.history.map((h) => `<li>${h}</li>`).join("")}
          </ul>
        </details>
      </div>
      <div>
        <div class="who">👤 ${m.candidate}</div>
        <div class="what">강점: ${m.candidateStrength}</div>
        <div class="similarity" style="margin-top:10px;">AI 유사도 ${m.similarity}%</div>
      </div>
      <div class="match-actions">
        ${currentTab === "pending" ? `
          <button class="act-btn approve" data-action="approved" data-id="${m.id}">승인</button>
          <button class="act-btn hold" data-action="hold" data-id="${m.id}">보류</button>
          <button class="act-btn reject" data-action="rejected" data-id="${m.id}">반려</button>
        ` : `
          <button class="act-btn" data-action="pending" data-id="${m.id}">대기로 되돌리기</button>
        `}
      </div>
    `;
    list.appendChild(card);
    requestAnimationFrame(() => {
      card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
      card.style.opacity = "1";
    });
  });

  list.querySelectorAll("[data-action]").forEach((b) =>
    b.addEventListener("click", () => act(b.dataset.id, b.dataset.action))
  );
}

function act(id, action) {
  const card = document.querySelector(`.act-btn[data-id="${id}"]`).closest(".match-card");
  card.classList.add("removing");
  setTimeout(() => {
    const m = store.find((x) => x.id === id);
    if (m) m.status = action;
    save();
    const msgs = { approved: "승인되었습니다.", hold: "보류 처리되었습니다.", rejected: "반려되었습니다.", pending: "검토 대기로 되돌렸습니다." };
    showToast(msgs[action] || "처리되었습니다.");
    render();
  }, 320);
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

render();
