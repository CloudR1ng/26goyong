// Task catalog with required strength vectors
const TASKS = [
  { id: "doc-sort", name: "서류 정리·분류", company: "한빛 사회적기업", needs: { focus: 80, detail: 85, motor: 60, comm: 30, color: 30 }, tags: ["사무지원", "반복작업"], easy: "종이를 정해진 규칙에 따라 순서대로 정리하는 일이에요." },
  { id: "img-tag", name: "이미지 색상 태깅", company: "오색 콘텐츠랩", needs: { color: 90, focus: 70, detail: 75, comm: 25, motor: 40 }, tags: ["콘텐츠", "디지털"], easy: "사진을 보고 어떤 색이 들어 있는지 체크하는 일이에요." },
  { id: "pkg-fold", name: "포장지·종이 접기", company: "도담 표준사업장", needs: { motor: 88, focus: 80, detail: 78, comm: 25, color: 40 }, tags: ["손작업", "표준사업장"], easy: "정해진 모양대로 종이를 접어서 상자에 넣는 일이에요." },
  { id: "data-entry", name: "데이터 입력·검수", company: "맑은데이터", needs: { focus: 85, detail: 90, comm: 40, motor: 55, color: 30 }, tags: ["사무지원", "디지털"], easy: "글자나 숫자를 컴퓨터에 또박또박 입력하는 일이에요." },
  { id: "cafe-prep", name: "카페 재료 정돈", company: "느린걸음 카페", needs: { motor: 70, focus: 65, comm: 60, detail: 70, color: 50 }, tags: ["서비스", "현장"], easy: "카페 재료를 종류별로 정리하고 상태를 확인하는 일이에요." },
  { id: "qc-visual", name: "포장 외관 검수", company: "정밀공정사", needs: { color: 75, detail: 92, focus: 88, comm: 30, motor: 55 }, tags: ["품질관리", "공장"], easy: "물건의 겉모습이 깨끗한지 눈으로 확인하는 일이에요." },
  { id: "voice-anno", name: "음성 자료 검수", company: "보이스랩", needs: { comm: 80, focus: 78, detail: 75, color: 25, motor: 35 }, tags: ["디지털", "재택가능"], easy: "녹음된 목소리가 또렷한지 듣고 표시하는 일이에요." },
  { id: "reception", name: "안내 데스크 보조", company: "공감복지센터", needs: { comm: 88, focus: 60, detail: 55, color: 30, motor: 40 }, tags: ["서비스", "현장"], easy: "방문하는 사람을 맞이하고 길을 알려주는 일이에요." }
];

const TRAININGS = [
  { id: "ncs-office", name: "사무행정 기초 과정", skill: "focus", org: "한국폴리텍대학", weeks: 8, tags: ["NCS", "오프라인"] },
  { id: "ncs-digital", name: "디지털 콘텐츠 태깅 실무", skill: "color", org: "한국고용정보원", weeks: 6, tags: ["NCS", "온라인"] },
  { id: "ncs-craft", name: "수공예·포장 직무훈련", skill: "motor", org: "장애인개발원", weeks: 10, tags: ["NCS", "지원고용"] },
  { id: "ncs-comm", name: "고객 응대 커뮤니케이션", skill: "comm", org: "직업능력개발원", weeks: 4, tags: ["NCS", "오프라인"] },
  { id: "ncs-qc", name: "품질 검수 실무 입문", skill: "detail", org: "산업인력공단", weeks: 5, tags: ["NCS", "온라인"] }
];

const LABELS = { color: "색감·패턴 인지", focus: "반복 집중력", motor: "소근육 조정", comm: "소통 역량", detail: "꼼꼼함·정확도" };

let userStrengths = null;
let selectedSample = null;

const sampleGrid = document.getElementById("sampleGrid");
const toStep2 = document.getElementById("toStep2");
const reason = document.getElementById("reason");

sampleGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".sample-card");
  if (!card) return;
  document.querySelectorAll(".sample-card").forEach((c) => c.classList.remove("selected"));
  card.classList.add("selected");
  selectedSample = card.dataset.sample;
  userStrengths = JSON.parse(card.dataset.strengths);
  toStep2.disabled = false;
});

document.querySelectorAll("[data-goto]").forEach((btn) => {
  btn.addEventListener("click", () => goToStep(Number(btn.dataset.goto)));
});
toStep2.addEventListener("click", () => goToStep(2));

function goToStep(n) {
  document.querySelectorAll(".step").forEach((s) => {
    const num = Number(s.dataset.step);
    s.classList.toggle("active", num === n);
    s.classList.toggle("done", num < n);
  });
  for (let i = 1; i <= 4; i++) {
    document.getElementById("panel-" + i).style.display = i === n ? "block" : "none";
  }
  if (n === 2) renderStrengths();
  if (n === 3) renderTasks();
  if (n === 4) renderTrainings();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderStrengths() {
  if (!userStrengths) return;
  const bars = document.querySelectorAll("#strengths .strength-bar span");
  const values = document.querySelectorAll("#strengths .value");

  bars.forEach((b) => (b.style.width = "0%"));
  values.forEach((v) => (v.textContent = "0%"));

  setTimeout(() => {
    bars.forEach((b, i) => {
      const key = b.dataset.key;
      b.style.transitionDelay = i * 80 + "ms";
      b.style.width = userStrengths[key] + "%";
    });
    values.forEach((v) => {
      const key = v.dataset.key;
      animateNumber(v, userStrengths[key], "%", 900);
    });
  }, 50);

  const top = Object.entries(userStrengths).sort((a, b) => b[1] - a[1]).slice(0, 2);
  reason.innerHTML = `<strong>분석 근거</strong> — 선택한 자료에서 <strong>${LABELS[top[0][0]]}</strong>(${top[0][1]}%)과 <strong>${LABELS[top[1][0]]}</strong>(${top[1][1]}%)이 가장 두드러진 강점으로 추출되었습니다. (CNN 시각 분석 + 텍스트 임베딩 기반)`;
}

function animateNumber(el, target, suffix, dur) {
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function cosine(a, b) {
  const keys = Object.keys(a);
  let dot = 0, na = 0, nb = 0;
  keys.forEach((k) => {
    dot += a[k] * b[k];
    na += a[k] * a[k];
    nb += b[k] * b[k];
  });
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function renderTasks() {
  if (!userStrengths) return;
  const scored = TASKS.map((t) => ({ ...t, score: cosine(userStrengths, t.needs) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const grid = document.getElementById("taskGrid");
  grid.innerHTML = "";
  scored.forEach((t, i) => {
    const pct = Math.round(t.score * 100);
    const card = document.createElement("article");
    card.className = "result-card";
    card.style.animationDelay = i * 90 + "ms";
    card.innerHTML = `
      <span class="match">매칭률 ${pct}%</span>
      <h3>${t.name}</h3>
      <p class="meta">${t.company}</p>
      <p style="margin-bottom:12px; font-size:0.92rem; color:#475569;">${t.easy}</p>
      <div class="tag-row">${t.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    `;
    grid.appendChild(card);
  });
}

function renderTrainings() {
  if (!userStrengths) return;
  const weak = Object.entries(userStrengths).sort((a, b) => a[1] - b[1]).slice(0, 3).map((x) => x[0]);
  const recs = TRAININGS.filter((t) => weak.includes(t.skill));

  const grid = document.getElementById("trainingGrid");
  grid.innerHTML = "";
  if (recs.length === 0) {
    grid.innerHTML = '<div class="empty"><div class="big">✨</div><p>현재 강점이 균형 있게 분포되어 별도 훈련 추천이 없습니다.</p></div>';
    return;
  }
  recs.forEach((r, i) => {
    const card = document.createElement("article");
    card.className = "result-card";
    card.style.animationDelay = i * 100 + "ms";
    card.innerHTML = `
      <span class="match" style="background:rgba(245,158,11,0.12); color:#b45309;">보완 추천</span>
      <h3>${r.name}</h3>
      <p class="meta">${r.org} · ${r.weeks}주 과정</p>
      <p style="margin-bottom:12px; font-size:0.92rem; color:#475569;">부족한 <strong>${LABELS[r.skill]}</strong> 역량을 보완할 수 있는 NCS 기반 훈련 과정입니다.</p>
      <div class="tag-row">${r.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    `;
    grid.appendChild(card);
  });
}
