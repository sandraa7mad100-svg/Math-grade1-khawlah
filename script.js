/* منصة الرياضيات التفاعلية - الصف الأول الابتدائي
   يمكن تعديل الأسئلة والوحدات من هذا الملف بسهولة.
*/

// بيانات المنهج
const units = [
  {
    id: 6,
    title: "الوحدة 6: الجمع",
    icon: "➕",
    topics: [
      "الجمع بالعد التصاعدي",
      "تمثيل الجمع بالصور",
      "حقائق الجمع الأساسية",
      "تكوين العدد 10",
      "حل مسائل الجمع"
    ]
  },
  {
    id: 7,
    title: "الوحدة 7: الطرح",
    icon: "➖",
    topics: [
      "مفهوم الطرح",
      "الطرح باستخدام العد التنازلي",
      "الطرح بالصور",
      "حقائق الطرح الأساسية",
      "حل مسائل الطرح"
    ]
  },
  {
    id: 8,
    title: "الوحدة 8: الأعداد حتى 99",
    icon: "🔢",
    topics: [
      "قراءة الأعداد وكتابتها",
      "مقارنة الأعداد",
      "ترتيب الأعداد",
      "القيمة المكانية: آحاد وعشرات",
      "تكوين الأعداد"
    ]
  },
  {
    id: 9,
    title: "الوحدة 9: القياس",
    icon: "📏",
    topics: [
      "مقارنة الأطوال",
      "القياس باستخدام وحدات غير قياسية",
      "مقارنة الأوزان",
      "مقارنة السعات"
    ]
  },
  {
    id: 10,
    title: "الوحدة 10: الأشكال الهندسية",
    icon: "🔺",
    topics: [
      "التعرف على الأشكال المستوية",
      "الدائرة",
      "المربع",
      "المستطيل",
      "المثلث",
      "تصنيف الأشكال"
    ]
  }
];

const questions = [
  { q: "٣ + ٢ = ؟", answer: "٥", options: ["٣", "٤", "٥", "٦"] },
  { q: "٦ - ٢ = ؟", answer: "٤", options: ["٢", "٣", "٤", "٥"] },
  { q: "أي عدد أكبر؟", answer: "٩٨", options: ["٨٩", "٧٨", "٩٨", "٦٨"] },
  { q: "كم عشرة في العدد ٤٥؟", answer: "٤ عشرات", options: ["٥ عشرات", "٤ عشرات", "٩ عشرات", "١ عشرة"] },
  { q: "الشكل الذي له ٣ أضلاع هو؟", answer: "مثلث", options: ["دائرة", "مربع", "مثلث", "مستطيل"] },
  { q: "٥ + ٥ = ؟", answer: "١٠", options: ["٨", "٩", "١٠", "١١"] },
  { q: "١٠ - ٣ = ؟", answer: "٧", options: ["٦", "٧", "٨", "٩"] },
  { q: "رتب: ١٢، ١٥، ١٣", answer: "١٢، ١٣، ١٥", options: ["١٢، ١٣، ١٥", "١٥، ١٣، ١٢", "١٣، ١٢، ١٥", "١٢، ١٥، ١٣"] }
];

const shapes = [
  { name: "دائرة", symbol: "⚪" },
  { name: "مربع", symbol: "◼️" },
  { name: "مثلث", symbol: "🔺" },
  { name: "مستطيل", symbol: "▭" }
];

// حالة الطالب المحفوظة
let state = JSON.parse(localStorage.getItem("mathGameState")) || {
  stars: 0,
  points: 0,
  completedUnits: []
};

const starsCount = document.getElementById("starsCount");
const pointsCount = document.getElementById("pointsCount");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const unitsList = document.getElementById("unitsList");
const message = document.getElementById("message");

function saveState() {
  localStorage.setItem("mathGameState", JSON.stringify(state));
}

function updateHeader() {
  starsCount.textContent = state.stars;
  pointsCount.textContent = state.points;
  const percent = Math.round((state.completedUnits.length / units.length) * 100);
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${percent}% مكتمل`;
  renderUnits();
  renderAchievements();
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function reward(extra = 1) {
  state.stars += extra;
  state.points += extra * 10;
  saveState();
  updateHeader();
  playSound(true);
  confetti();
}

function encouragement() {
  const messages = [
    "رائع! أنت نجم الرياضيات ⭐",
    "أحسنت! استمر يا بطل 🌟",
    "إجابة جميلة جدًا 🎉",
    "تفكير ممتاز 👏",
    "واو! تقدمك مذهل 🚀"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// مؤثر صوتي بسيط بدون ملفات خارجية
function playSound(correct) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = correct ? 780 : 180;
  gain.gain.value = 0.08;
  osc.start();
  setTimeout(() => {
    osc.stop();
    ctx.close();
  }, correct ? 160 : 260);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function renderUnits() {
  unitsList.innerHTML = "";
  units.forEach(unit => {
    const done = state.completedUnits.includes(unit.id);
    const btn = document.createElement("button");
    btn.className = `unit-card ${done ? "done" : ""}`;
    btn.innerHTML = `<h3>${unit.icon} ${unit.title}</h3><p>${unit.topics.join(" • ")}</p><b>${done ? "✅ مكتملة" : "ابدأ الوحدة"}</b>`;
    btn.onclick = () => openLesson(unit);
    unitsList.appendChild(btn);
  });
}

function openLesson(unit) {
  showScreen("lesson");
  document.getElementById("lessonTitle").textContent = `${unit.icon} ${unit.title}`;
  document.getElementById("lessonDesc").textContent = "تعلم المهارات التالية ثم جرّب الألعاب التعليمية.";
  document.getElementById("topicsList").innerHTML = unit.topics.map(t => `<div class="topic">📌 ${t}</div>`).join("");
  document.getElementById("completeUnitBtn").onclick = () => {
    if (!state.completedUnits.includes(unit.id)) {
      state.completedUnits.push(unit.id);
      reward(3);
    }
    saveState();
    updateHeader();
    message.textContent = encouragement();
    showScreen("home");
  };
}

function startQuiz() {
  showScreen("game");
  document.getElementById("gameTitle").textContent = "🎯 لعبة اختيار الإجابة الصحيحة";
  const q = questions[Math.floor(Math.random() * questions.length)];
  document.getElementById("gameArea").innerHTML = `
    <div class="question">${q.q}</div>
    <div class="options-grid">
      ${shuffle(q.options).map(o => `<button class="option-btn">${o}</button>`).join("")}
    </div>
  `;
  document.querySelectorAll(".option-btn").forEach(btn => {
    btn.onclick = () => {
      if (btn.textContent === q.answer) {
        btn.classList.add("correct");
        message.textContent = encouragement();
        reward(1);
      } else {
        btn.classList.add("wrong");
        message.textContent = "حاول مرة أخرى، أنت تستطيع 💪";
        playSound(false);
      }
      setTimeout(startQuiz, 900);
    };
  });
}

function startDrag() {
  showScreen("game");
  document.getElementById("gameTitle").textContent = "🧩 لعبة السحب والإفلات";
  const pairs = [
    { left: "🍎🍎🍎", right: "٣" },
    { left: "◼️", right: "مربع" },
    { left: "٤ + ٢", right: "٦" }
  ];

  document.getElementById("gameArea").innerHTML = `
    <p class="question">اسحب البطاقة إلى الإجابة المناسبة</p>
    <div class="drag-area">
      <div>${shuffle(pairs).map((p, i) => `<div class="draggable" draggable="true" data-answer="${p.right}">${p.left}</div>`).join("")}</div>
      <div>${shuffle(pairs).map(p => `<div class="drop-zone" data-target="${p.right}">${p.right}</div>`).join("")}</div>
    </div>
  `;

  document.querySelectorAll(".draggable").forEach(el => {
    el.addEventListener("dragstart", e => {
      e.dataTransfer.setData("answer", el.dataset.answer);
      e.dataTransfer.setData("text", el.textContent);
    });
  });

  document.querySelectorAll(".drop-zone").forEach(zone => {
    zone.addEventListener("dragover", e => e.preventDefault());
    zone.addEventListener("drop", e => {
      e.preventDefault();
      const answer = e.dataTransfer.getData("answer");
      const text = e.dataTransfer.getData("text");
      if (answer === zone.dataset.target) {
        zone.textContent = `${text} ✅ ${zone.dataset.target}`;
        zone.style.background = "#bbf7d0";
        message.textContent = encouragement();
        reward(1);
      } else {
        message.textContent = "قريب جدًا! جرّب مرة أخرى 🌷";
        playSound(false);
      }
    });
  });
}

function startWheel() {
  showScreen("game");
  document.getElementById("gameTitle").textContent = "🎡 عجلة الحظ التعليمية";
  document.getElementById("gameArea").innerHTML = `
    <div id="wheel" class="wheel">لفّني!</div>
    <button id="spinBtn" class="primary-btn">ابدأ الدوران 🎡</button>
    <div id="wheelQuestion"></div>
  `;
  document.getElementById("spinBtn").onclick = () => {
    const wheel = document.getElementById("wheel");
    wheel.style.transform = `rotate(${720 + Math.random() * 900}deg)`;
    setTimeout(() => {
      const q = questions[Math.floor(Math.random() * questions.length)];
      document.getElementById("wheelQuestion").innerHTML = `
        <div class="question">${q.q}</div>
        <div class="options-grid">
          ${shuffle(q.options).map(o => `<button class="option-btn">${o}</button>`).join("")}
        </div>
      `;
      document.querySelectorAll(".option-btn").forEach(btn => {
        btn.onclick = () => {
          if (btn.textContent === q.answer) {
            message.textContent = "مكافأة العجلة! حصلت على نجمتين ⭐⭐";
            reward(2);
          } else {
            message.textContent = "حاول مرة أخرى 🌈";
            playSound(false);
          }
        };
      });
    }, 1200);
  };
}

function startTimeChallenge() {
  showScreen("game");
  document.getElementById("gameTitle").textContent = "⏱️ تحدي الوقت";
  let time = 60;
  let solved = 0;

  document.getElementById("gameArea").innerHTML = `
    <div class="timer">الوقت: <b id="timeLeft">60</b> ثانية | الحلول الصحيحة: <b id="solved">0</b></div>
    <div id="timeQuestion"></div>
  `;

  const timer = setInterval(() => {
    time--;
    document.getElementById("timeLeft").textContent = time;
    if (time <= 0) {
      clearInterval(timer);
      message.textContent = `انتهى التحدي! حللت ${solved} مسائل صحيحة 🎉`;
      reward(Math.max(1, solved));
    }
  }, 1000);

  function next() {
    const a = Math.ceil(Math.random() * 9);
    const b = Math.ceil(Math.random() * 9);
    const ans = a + b;
    const opts = shuffle([ans, ans + 1, Math.max(0, ans - 1), ans + 2]);
    document.getElementById("timeQuestion").innerHTML = `
      <div class="question">${a} + ${b} = ؟</div>
      <div class="options-grid">${opts.map(o => `<button class="option-btn">${o}</button>`).join("")}</div>
    `;
    document.querySelectorAll(".option-btn").forEach(btn => {
      btn.onclick = () => {
        if (Number(btn.textContent) === ans && time > 0) {
          solved++;
          document.getElementById("solved").textContent = solved;
          reward(1);
          next();
        } else {
          playSound(false);
          message.textContent = "جرّب بسرعة مرة أخرى ⏱️";
        }
      };
    });
  }

  next();
}

function startBuildNumber() {
  showScreen("game");
  document.getElementById("gameTitle").textContent = "🏗️ لعبة بناء العدد";
  const target = Math.floor(Math.random() * 90) + 10;
  let tens = 0, ones = 0;

  function render() {
    const built = tens * 10 + ones;
    document.getElementById("gameArea").innerHTML = `
      <div class="question">كوّن العدد: ${target}</div>
      <div class="build-number">
        <div class="counter-box">
          <h3>العشرات</h3>
          <button id="tMinus">-</button>
          <b>${tens}</b>
          <button id="tPlus">+</button>
        </div>
        <div class="counter-box">
          <h3>الآحاد</h3>
          <button id="oMinus">-</button>
          <b>${ones}</b>
          <button id="oPlus">+</button>
        </div>
      </div>
      <p class="question">العدد الحالي: ${built}</p>
      <button id="checkBuild" class="primary-btn">تحقق ✅</button>
    `;

    document.getElementById("tPlus").onclick = () => { if (tens < 9) tens++; render(); };
    document.getElementById("tMinus").onclick = () => { if (tens > 0) tens--; render(); };
    document.getElementById("oPlus").onclick = () => { if (ones < 9) ones++; render(); };
    document.getElementById("oMinus").onclick = () => { if (ones > 0) ones--; render(); };
    document.getElementById("checkBuild").onclick = () => {
      if (built === target) {
        message.textContent = encouragement();
        reward(2);
        setTimeout(startBuildNumber, 900);
      } else {
        message.textContent = "راجع العشرات والآحاد وحاول مرة أخرى 🌷";
        playSound(false);
      }
    };
  }

  render();
}

function startShapesGame() {
  showScreen("game");
  document.getElementById("gameTitle").textContent = "🔺 لعبة الأشكال الهندسية";
  const target = shapes[Math.floor(Math.random() * shapes.length)];
  document.getElementById("gameArea").innerHTML = `
    <div class="question">اختر شكل: ${target.name}</div>
    <div class="shape-row">
      ${shuffle(shapes).map(s => `<button class="shape-choice" data-name="${s.name}">${s.symbol}</button>`).join("")}
    </div>
  `;
  document.querySelectorAll(".shape-choice").forEach(btn => {
    btn.onclick = () => {
      if (btn.dataset.name === target.name) {
        message.textContent = encouragement();
        reward(1);
        setTimeout(startShapesGame, 900);
      } else {
        message.textContent = "ليس هذا الشكل، حاول مرة أخرى 💡";
        playSound(false);
      }
    };
  });
}

function renderAchievements() {
  const badges = document.getElementById("badges");
  if (!badges) return;
  badges.innerHTML = units.map(unit => {
    const done = state.completedUnits.includes(unit.id);
    return `<div class="unit-card ${done ? "done" : ""}">
      <h3>${done ? "🏅" : "🔒"} ${unit.title}</h3>
      <p>${done ? "تم إنجاز الوحدة" : "لم تكتمل بعد"}</p>
    </div>`;
  }).join("");

  const certificate = document.getElementById("certificate");
  if (state.completedUnits.length === units.length) {
    certificate.classList.remove("hidden");
  } else {
    certificate.classList.add("hidden");
  }
}

function confetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    size: Math.random() * 8 + 4,
    speed: Math.random() * 4 + 2,
    color: `hsl(${Math.random() * 360}, 90%, 60%)`
  }));

  let frames = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.speed;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    frames++;
    if (frames < 80) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ربط الأزرار
document.getElementById("startBtn").onclick = () => {
  document.querySelector(".section-title").scrollIntoView({ behavior: "smooth" });
};

document.getElementById("resetBtn").onclick = () => {
  if (confirm("هل تريد إعادة التقدم من البداية؟")) {
    state = { stars: 0, points: 0, completedUnits: [] };
    saveState();
    updateHeader();
  }
};

document.querySelectorAll(".back-btn").forEach(btn => {
  btn.onclick = () => {
    message.textContent = "";
    showScreen("home");
  };
});

document.querySelectorAll("[data-screen]").forEach(btn => {
  btn.onclick = () => showScreen(btn.dataset.screen);
});

document.querySelectorAll("[data-game]").forEach(btn => {
  btn.onclick = () => {
    message.textContent = "";
    const game = btn.dataset.game;
    if (game === "quiz") startQuiz();
    if (game === "drag") startDrag();
    if (game === "wheel") startWheel();
    if (game === "time") startTimeChallenge();
    if (game === "build") startBuildNumber();
    if (game === "shapes") startShapesGame();
  };
});

updateHeader();
