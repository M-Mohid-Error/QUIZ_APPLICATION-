const infoScreen = document.getElementById("info-screen");
const quizContainer = document.getElementById("quiz-container");
const resultScreen = document.getElementById("result-screen");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const rollInput = document.getElementById("roll");
const instituteInput = document.getElementById("institute");
const userForm = document.getElementById("user-form");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timeEl = document.getElementById("time");
const timeBar = document.getElementById("time-bar");
const progressEl = document.getElementById("progress");
const userDisplay = document.getElementById("user-display");
const resultMessage = document.getElementById("result-message");
const reviewContainer = document.getElementById("review");
const restartBtn = document.getElementById("restart-btn");

const questions = [
  { q: "Which keyword is used to declare a variable in JavaScript?", options: ["let", "var", "const", "All of these"], answer: "All of these" },
  { q: "Which company developed JavaScript?", options: ["Microsoft", "Sun Microsystems", "Netscape", "Google"], answer: "Netscape" },
  { q: "Which method is used to write HTML content in JavaScript?", options: ["document.write()", "console.log()", "window.alert()", "innerHTML"], answer: "document.write()" },
  { q: "What type of language is JavaScript?", options: ["Object-Oriented", "Object-Based", "Procedural", "None"], answer: "Object-Based" },
  { q: "Inside which HTML element do we put JavaScript?", options: ["<js>", "<javascript>", "<script>", "<code>"], answer: "<script>" },
  { q: "Which symbol is used for comments in JavaScript?", options: ["//", "/* */", "<!-- -->", "#"], answer: "//" },
  { q: "How do you create a function in JavaScript?", options: ["function myFunc()", "create function myFunc()", "def myFunc()", "func myFunc()"], answer: "function myFunc()" },
  { q: "Which event occurs when the user clicks on an HTML element?", options: ["onchange", "onmouseclick", "onclick", "onmouseover"], answer: "onclick" },
  { q: "Which method converts JSON to a JavaScript object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "parse.JSON()"], answer: "JSON.parse()" },
  { q: "Which built-in method adds one or more elements to the end of an array?", options: ["last()", "push()", "append()", "add()"], answer: "push()" }
];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;
let userName = "";
let userAnswers = [];

// Validate and start quiz
userForm.addEventListener("submit", e => {
  e.preventDefault();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
  if (!emailValid) {
    alert("⚠️ Please enter a valid email address.");
    return;
  }
  userName = nameInput.value;
  infoScreen.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  userDisplay.textContent = `👤 ${userName}`;
  startQuiz();
});

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  showQuestion();
  startTimer();
}

function showQuestion() {
  const current = questions[currentQuestion];
  questionEl.textContent = current.q;
  optionsEl.innerHTML = "";
  progressEl.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;

  current.options.forEach(opt => {
    const btn = document.createElement("div");
    btn.classList.add("option");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt);
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(selected) {
  const correct = questions[currentQuestion].answer;
  const isCorrect = selected === correct;

  userAnswers.push({
    question: questions[currentQuestion].q,
    selected,
    correctAnswer: correct,
    isCorrect
  });

  if (isCorrect) {
    alert("✅ Correct!");
    score++;
  } else {
    alert(`❌ Wrong! Correct: ${correct}`);
  }
  nextQuestion();
}

function nextQuestion() {
  clearInterval(timer);
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    timeLeft = 15;
    showQuestion();
    startTimer();
  } else {
    endQuiz();
  }
}

function startTimer() {
  timeLeft = 15;
  timeEl.textContent = timeLeft;
  timeBar.style.width = "100%";

  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    timeBar.style.width = `${(timeLeft / 15) * 100}%`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("⏰ Time's up!");
      userAnswers.push({
        question: questions[currentQuestion].q,
        selected: "No answer",
        correctAnswer: questions[currentQuestion].answer,
        isCorrect: false
      });
      nextQuestion();
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timer);
  quizContainer.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  let emoji = score === questions.length ? "🏆" : score > 5 ? "😊" : "😢";
  resultMessage.innerHTML = `${emoji} ${userName}, you scored <b>${score}</b> out of <b>${questions.length}</b>!`;

  reviewContainer.innerHTML = "";
  userAnswers.forEach((item, idx) => {
    const div = document.createElement("div");
    div.classList.add("review-item");
    div.innerHTML = `
      <h4>Q${idx + 1}. ${item.question}</h4>
      <p>Your answer: <span class="${item.isCorrect ? "correct" : "wrong"}">${item.selected}</span></p>
      ${!item.isCorrect ? `<p>Correct answer: <span class="correct-answer">${item.correctAnswer}</span></p>` : ""}
    `;
    reviewContainer.appendChild(div);
  });
}

restartBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  infoScreen.classList.remove("hidden");
  userForm.reset();
});
