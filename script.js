const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const progressBar = document.getElementById("progressBar");
const topButton = document.getElementById("topButton");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;

  if (scrollTop > 500) {
    topButton.classList.add("visible");
  } else {
    topButton.classList.remove("visible");
  }
});

topButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

const featureData = {
  portfolio: {
    label: "핵심 기능 01",
    title: "디지털 포트폴리오 등록",
    text: "구직자는 그림, 사진, 영상, 음성, 자유서술형 자기소개 등 비정형 자료를 등록할 수 있습니다. 이를 통해 기존 이력서로 표현하기 어려운 강점을 데이터화할 수 있습니다."
  },
  analysis: {
    label: "핵심 기능 02",
    title: "AI 기반 개인 강점 분석",
    text: "포트폴리오의 텍스트, 이미지, 음성 데이터를 분석하여 색감 인지 능력, 반복 집중력, 꼼꼼함, 소근육 조정 능력과 같은 강점 지표를 생성합니다."
  },
  task: {
    label: "핵심 기능 03",
    title: "기업 업무 세부 과제 분해",
    text: "기업이 입력한 채용공고나 직무기술서를 자연어 처리로 분석하여 문서 정리, 맞춤법 검토, 이미지 분류처럼 수행 가능한 세부 과제로 나눕니다."
  },
  curator: {
    label: "핵심 기능 04",
    title: "큐레이터 및 기관 담당자 검토",
    text: "AI 추천 결과는 최종 판단이 아니라 보조 의견으로 사용됩니다. 큐레이터와 고용지원 기관 담당자가 매칭 결과를 검토해 편향과 오류를 줄입니다."
  },
  growth: {
    label: "핵심 기능 05",
    title: "직무훈련·성장 경로 추천",
    text: "바로 취업이 어려운 경우 NCS 기반 직업훈련 데이터를 활용하여 부족 역량을 보완할 수 있는 훈련 과정과 성장 경로를 제안합니다."
  }
};

const featureButtons = document.querySelectorAll(".feature-item");
const featurePanel = document.getElementById("featurePanel");

featureButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.feature;
    const selected = featureData[key];

    featureButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    featurePanel.innerHTML = `
      <p class="panel-label">${selected.label}</p>
      <h3>${selected.title}</h3>
      <p>${selected.text}</p>
    `;
  });
});

const focusRange = document.getElementById("focusRange");
const visualRange = document.getElementById("visualRange");
const communicationRange = document.getElementById("communicationRange");
const matchScore = document.getElementById("matchScore");
const recommendedTask = document.getElementById("recommendedTask");
const heroScore = document.getElementById("heroScore");

function updateMatchingDemo() {
  const focus = Number(focusRange.value);
  const visual = Number(visualRange.value);
  const communication = Number(communicationRange.value);

  const score = Math.round(focus * 0.42 + visual * 0.38 + communication * 0.2);

  matchScore.textContent = `${score}%`;
  heroScore.textContent = `${Math.max(score, 70)}%`;

  if (focus >= 75 && visual >= 65) {
    recommendedTask.textContent = "자료 정리 및 이미지 분류";
  } else if (focus >= 70 && communication >= 70) {
    recommendedTask.textContent = "문서 검토 및 사무보조";
  } else if (visual >= 75) {
    recommendedTask.textContent = "색상 태깅 및 콘텐츠 분류";
  } else if (communication < 45) {
    recommendedTask.textContent = "저소통 반복형 백오피스 과제";
  } else {
    recommendedTask.textContent = "기초 직무훈련 후 과제 매칭";
  }
}

[focusRange, visualRange, communicationRange].forEach((range) => {
  range.addEventListener("input", updateMatchingDemo);
});

updateMatchingDemo();

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const type = document.getElementById("type").value;
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !type || !message) {
    formMessage.textContent = "모든 항목을 입력해주세요.";
    formMessage.style.color = "#dc2626";
    return;
  }

  formMessage.textContent = "문의가 접수되었습니다. 데모 사이트에서는 실제 전송되지 않습니다.";
  formMessage.style.color = "#16a34a";
  contactForm.reset();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate(
          [
            { opacity: 0, transform: "translateY(24px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          {
            duration: 600,
            easing: "ease-out",
            fill: "forwards"
          }
        );

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

document.querySelectorAll(".section, .info-card, .step-card, .timeline-item").forEach((element) => {
  element.style.opacity = 0;
  observer.observe(element);
});