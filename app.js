let questions = [];
let currentIndex = 0;
let learnedLearnMode = [];
let learnedTestMode = [];
let testType = "single";
let wrongQuestions = [];
let isTestMode = false;

const sweetMessagesAll = {
  success: [
    "🌸 Brawo księżniczko, dobra robota!",
    "🌸 Great job princess, well done!",

    "💖 Jesteś niesamowita, super odpowiedź!",
    "💖 You’re amazing, great answer!",

    "✨ Twoja wiedza jest magiczna, kochana!",
    "✨ Your knowledge is magical, sweetie!",

    "🧁 Słodka i mądra – idealne połączenie!",
    "🧁 Sweet and smart – perfect combo!",
    "⭐ Rozświetlasz ten quiz swoją mądrością!",
    "⭐ You light up this quiz with your wisdom!",

    "💗 Odpowiedź perfekcyjna, królowo!",
    "💗 Perfect answer, queen!",

    "🌷 Jesteś genialna i to widać!",
    "🌷 You’re brilliant and it shows!",
  ],
  fail: [
    "🌸 Nie martw się, księżniczko, następnym razem pójdzie Ci lepiej!",
    "🌸 Don’t worry princess, you’ll ace it next time!",

    "💖 Każdy błąd to krok do przodu, jesteś wspaniała!",
    "💖 Every mistake is a step forward, you’re amazing!",

    "✨ Twoja wiedza rośnie, nawet jeśli tego nie czujesz – dasz radę!",
    "✨ Your knowledge is growing even if you can’t see it yet!",

    "🧁 Jesteś słodka i mądra, nie poddawaj się!",
    "🧁 You’re sweet and smart, don’t give up!",
    "⭐ Każdy wielki umysł kiedyś się mylił. Ty jesteś wielka!",
    "⭐ Every great mind made mistakes. You are great too!",
    "💝 Błąd to nie porażka, to Twoja droga do sukcesu, skarbie!",
    "💝 A mistake is not a failure, it’s your way to success, darling!",

    "💗 Twój mózg pracuje na pełnych obrotach, kochana!",
    "💗 Your brain is working so hard, proud of you sweetie!",

    "✨ Nie rezygnuj, jesteś tak blisko swojej magii!",
    "✨ Don’t quit, you’re so close to your magic!",

    "⭐ Błędy tworzą mistrzów, a Ty nim będziesz!",
    "⭐ Mistakes make masters, and you will be one!",

    "💖 Twoja cierpliwość i wytrwałość czynią Cię wyjątkową!",
    "💖 Your patience and persistence make you extraordinary!",
  ],
};
function getRandomSweetMessage(type = "success") {
  const arr = sweetMessagesAll[type];
  const msg = arr[Math.floor(Math.random() * arr.length)];
  return msg;
}

document.getElementById("fileInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    questions = parseFile(e.target.result);
    loadProgress();
    renderHome();
  };
  reader.readAsText(file, "UTF-8");
});

function parseFile(text) {
  const questions = [];
  const rawQuestions = text.split(/\n\s*\n/);

  rawQuestions.forEach((q) => {
    const lines = q
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l !== "");
    if (lines.length === 0) return;

    const questionText = lines[0];
    const answers = [];
    let explanation = "";

    lines.slice(1).forEach((line) => {
      if (line.startsWith(">>>")) {
        answers.push({ text: line.substring(3).trim(), correct: true });
      } else if (line.startsWith("---")) {
        explanation = line.substring(3).trim();
      } else {
        answers.push({ text: line, correct: false });
      }
    });

    questions.push({
      question: questionText,
      answers: answers,
      explanation: explanation,
    });
  });

  return questions;
}

function renderHome() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div>
      <h2 class="text-2xl font-bold text-pink-500">Wybierz tryb</h2>
      <div class="mt-4">
        <button onclick="startLearnMode()" class="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-full shadow">Tryb nauki</button>
        <button onclick="renderTestOptions()" class="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-full shadow">Tryb testu</button>
      </div>
      ${renderProgressBar("learn")}
      ${renderProgressBar("test")}
    </div>
  `;
}

function startLearnMode() {
  currentIndex = 0;
  isTestMode = false;
  renderLearnMode();
}

function renderLearnMode() {
  const app = document.getElementById("app");
  const q = questions[currentIndex];

  app.innerHTML = `
    <div class="bg-white p-4 rounded-lg border-2 border-pink-300 shadow">
      <p class="font-bold text-lg">${q.question}</p>
      <div class="mt-2">
        ${q.answers
          .filter((a) => a.correct)
          .map(
            (a) => `
          <div class="bg-pink-200 p-2 rounded my-1">${a.text}</div>
        `
          )
          .join("")}
      </div>
      ${
        q.explanation
          ? `<div class="explanation bg-pink-100 p-2 rounded mt-2">${q.explanation}</div>`
          : ""
      }
      <div class="mt-4 space-x-2">
        <button onclick="prevQuestion()" class="bg-pink-300 hover:bg-pink-400 text-white py-2 px-4 rounded">Poprzednie</button>
        <button onclick="markAsLearned()" class="bg-green-400 hover:bg-green-500 text-white py-2 px-4 rounded">Już umiem</button>
        <button onclick="nextQuestion()" class="bg-pink-300 hover:bg-pink-400 text-white py-2 px-4 rounded">Następne</button>
        <button onclick="renderHome()" class="bg-gray-300 hover:bg-gray-400 text-pink-800 py-2 px-4 rounded">Powrót</button>
      </div>
      <div class="sweet-message mt-4 text-pink-500 font-semibold text-center">${getRandomSweetMessage()}</div>
    </div>
    ${renderProgressBar("learn")}
  `;
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderLearnMode();
  }
}

function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderLearnMode();
  }
}

function markAsLearned() {
  if (!learnedLearnMode.includes(currentIndex)) {
    learnedLearnMode.push(currentIndex);
    saveProgress();
  }
  nextQuestion();
}

function renderProgressBar(mode = "learn") {
  let learnedList = mode === "learn" ? learnedLearnMode : learnedTestMode;
  const percent = Math.round((learnedList.length / questions.length) * 100);
  return `
    <div class="mt-4">
      <div class="w-full bg-pink-200 rounded-full h-6">
        <div class="bg-pink-500 h-6 rounded-full text-white text-center" style="width: ${percent}%;">
          ${percent}%
        </div>
      </div>
      <div class="text-sm mt-1">${learnedList.length} / ${
    questions.length
  } pytań opanowanych (${mode === "learn" ? "nauka" : "test"})</div>
    </div>
  `;
}

function renderTestOptions() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div>
      <h2 class="text-2xl font-bold text-pink-500">Opcje testu</h2>
      <div class="mt-4 space-x-4">
        <label class="inline-flex items-center">
          <input type="radio" name="testType" value="single" checked class="mr-2"> Jednokrotny wybór
        </label>
        <label class="inline-flex items-center">
          <input type="radio" name="testType" value="multi" class="mr-2"> Wielokrotny wybór
        </label>
      </div>
      <div class="mt-4">
        <button onclick="startTest()" class="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-full shadow">Start testu</button>
        <button onclick="renderHome()" class="bg-gray-300 hover:bg-gray-400 text-pink-800 py-2 px-4 rounded">Powrót</button>
      </div>
    </div>
  `;

  document.getElementsByName("testType").forEach((radio) => {
    radio.addEventListener("change", (e) => {
      testType = e.target.value;
    });
  });
}

function startTest() {
  isTestMode = true;
  currentIndex = 0;
  wrongQuestions = [];
  renderTestQuestion();
}

function renderTestQuestion() {
  const app = document.getElementById("app");
  if (currentIndex >= questions.length) {
    app.innerHTML = `
      <h2 class="text-2xl font-bold text-pink-500">Test zakończony!</h2>
      <p class="mt-4">Poprawnie opanowane pytania: ${
        questions.length - wrongQuestions.length
      } / ${questions.length}</p>
      <button onclick="renderHome()" class="mt-4 bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-full shadow">Powrót do menu</button>
    `;
    saveProgress();
    return;
  }

  const q = questions[currentIndex];

  app.innerHTML = `
    <div class="bg-white p-4 rounded-lg border-2 border-pink-300 shadow">
      <p class="font-bold text-lg">${q.question}</p>
      <div class="mt-2">
        ${q.answers
          .map(
            (a, i) => `
          <label class="block bg-pink-200 p-2 rounded my-1 cursor-pointer hover:bg-pink-300">
            <input type="${
              testType === "single" ? "radio" : "checkbox"
            }" name="answer" value="${i}" class="mr-2"> ${a.text}
          </label>
        `
          )
          .join("")}
      </div>
      <div class="mt-4 space-x-2">
        <button onclick="checkAnswer()" class="bg-green-400 hover:bg-green-500 text-white py-2 px-4 rounded">Sprawdzam</button>
        <button onclick="renderHome()" class="bg-gray-300 hover:bg-gray-400 text-pink-800 py-2 px-4 rounded">Powrót</button>
      </div>
      <div class="sweet-message mt-4 text-pink-500 font-semibold text-center">${getRandomSweetMessage()}</div>
    </div>
    ${renderProgressBar("test")}
  `;
}

function checkAnswer() {
  const q = questions[currentIndex];
  const selected = Array.from(
    document.querySelectorAll('input[name="answer"]:checked')
  ).map((i) => parseInt(i.value));

  const app = document.getElementById("app");
  const isCorrect = q.answers.every(
    (a, i) =>
      (a.correct && selected.includes(i)) ||
      (!a.correct && !selected.includes(i))
  );

  let resultHTML = q.answers
    .map((a, i) => {
      let cls = "";
      if (a.correct) cls = "bg-green-200";
      else if (selected.includes(i) && !a.correct) cls = "bg-red-200";
      else cls = "bg-pink-200";
      return `<div class="p-2 rounded my-1 ${cls}">${a.text}</div>`;
    })
    .join("");

  if (isCorrect) {
    if (!learnedTestMode.includes(currentIndex))
      learnedTestMode.push(currentIndex);
  } else {
    wrongQuestions.push(currentIndex);
  }

  saveProgress();

  app.innerHTML = `
    <div class="bg-white p-4 rounded-lg border-2 border-pink-300 shadow">
      <p class="font-bold text-lg">${q.question}</p>
      <div class="mt-2">${resultHTML}</div>
      ${
        q.explanation
          ? `<div class="explanation bg-pink-100 p-2 rounded mt-2">${q.explanation}</div>`
          : ""
      }
      <div class="mt-4 space-x-2">
        <button onclick="nextTestQuestion()" class="bg-pink-400 hover:bg-pink-500 text-white py-2 px-4 rounded">Następne</button>
        <button onclick="renderHome()" class="bg-gray-300 hover:bg-gray-400 text-pink-800 py-2 px-4 rounded">Powrót</button>
      </div>
      <div class="sweet-message mt-4 text-pink-500 font-semibold text-center">
  ${getRandomSweetMessage(isCorrect ? "success" : "fail")}
</div>

    ${renderProgressBar("test")}
  `;
}

function nextTestQuestion() {
  currentIndex++;
  renderTestQuestion();
}

function saveProgress() {
  const progress = {
    learnedLearnMode: learnedLearnMode,
    learnedTestMode: learnedTestMode,
    wrongQuestions: wrongQuestions,
  };
  localStorage.setItem("quizProgress", JSON.stringify(progress));
}

function loadProgress() {
  const progress = JSON.parse(localStorage.getItem("quizProgress"));
  if (progress) {
    learnedLearnMode = progress.learnedLearnMode || [];
    learnedTestMode = progress.learnedTestMode || [];
    wrongQuestions = progress.wrongQuestions || [];
  }
}
