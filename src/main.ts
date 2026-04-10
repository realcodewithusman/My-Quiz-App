// Questions Data
const questions = [
  {
    text: "What is HTML?",
    options: ["A programming language", "A markup language", "A database", "An operating system"],
    correctAnswer: "A markup language"
  },
  {
    text: "What does CSS do?",
    options: ["Structure the page", "Style the page", "Add logic", "Store data"],
    correctAnswer: "Style the page"
  },
  {
    text: "What is JavaScript used for?",
    options: ["Styling", "Structure", "Interactivity", "Hosting"],
    correctAnswer: "Interactivity"
  },
  {
    text: "Which HTML tag is used to define an internal style sheet?",
    options: ["<script>", "<style>", "<css>", "<html>"],
    correctAnswer: "<style>"
  },
  {
    text: "Which property is used to change the background color in CSS?",
    options: ["color", "bgcolor", "background-color", "background"],
    correctAnswer: "background-color"
  },
  {
    text: "How do you write 'Hello World' in an alert box in JavaScript?",
    options: ["msg('Hello World')", "alertBox('Hello World')", "alert('Hello World')", "console.log('Hello World')"],
    correctAnswer: "alert('Hello World')"
  },
  {
    text: "Which HTML element is used for the largest heading?",
    options: ["<h6>", "<heading>", "<h1>", "<head>"],
    correctAnswer: "<h1>"
  },
  {
    text: "What is the correct way to write a JavaScript array?",
    options: ["var colors = 'red', 'blue', 'green'", "var colors = (1:'red', 2:'blue', 3:'green')", "var colors = ['red', 'blue', 'green']", "var colors = {1:'red', 2:'blue', 3:'green'}"],
    correctAnswer: "var colors = ['red', 'blue', 'green']"
  },
  {
    text: "Which CSS property controls the text size?",
    options: ["font-style", "text-size", "font-size", "text-style"],
    correctAnswer: "font-size"
  },
  {
    text: "How do you create a function in JavaScript?",
    options: ["function myFunction()", "function:myFunction()", "function = myFunction()", "def myFunction()"],
    correctAnswer: "function myFunction()"
  }
];

// State
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let isAnswered = false;

// DOM Elements
const startScreen = document.getElementById('start-screen')!;
const quizScreen = document.getElementById('quiz-screen')!;
const resultScreen = document.getElementById('result-screen')!;

const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
const restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;

const questionText = document.getElementById('question-text')!;
const optionsContainer = document.getElementById('options-container')!;
const questionCounter = document.getElementById('question-counter')!;
const currentScoreDisplay = document.getElementById('current-score')!;
const progressBar = document.getElementById('progress-bar')!;

const finalScoreDisplay = document.getElementById('final-score')!;
const resultMessage = document.getElementById('result-message')!;

// Functions
function showScreen(screenId: string) {
  [startScreen, quizScreen, resultScreen].forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId)!.classList.add('active');
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  selectedAnswer = null;
  isAnswered = false;
  showScreen('quiz-screen');
  loadQuestion();
}

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  
  // Update UI
  questionText.textContent = currentQuestion.text;
  questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  currentScoreDisplay.textContent = `Score: ${score}`;
  progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
  
  // Reset Button
  nextBtn.textContent = 'Check Answer';
  nextBtn.disabled = true;
  isAnswered = false;
  selectedAnswer = null;

  // Render Options
  optionsContainer.innerHTML = '';
  currentQuestion.options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    const span = document.createElement('span');
    span.textContent = option;
    button.appendChild(span);
    button.onclick = () => selectAnswer(option, button);
    optionsContainer.appendChild(button);
  });
}

function selectAnswer(option: string, button: HTMLButtonElement) {
  if (isAnswered) return;

  // Reset all buttons
  const allButtons = optionsContainer.querySelectorAll('.option-btn');
  allButtons.forEach(btn => btn.classList.remove('selected'));

  // Select this one
  button.classList.add('selected');
  selectedAnswer = option as any;
  nextBtn.disabled = false;
}

function checkAnswer() {
  if (isAnswered) {
    nextQuestion();
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  isAnswered = true;
  
  const tickIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
  const crossIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

  const allButtons = optionsContainer.querySelectorAll('.option-btn');
  allButtons.forEach(btn => {
    btn.classList.add('answered');
    const span = btn.querySelector('span')!;
    const optionText = span.textContent;
    
    if (optionText === currentQuestion.correctAnswer) {
      btn.classList.add('correct');
      btn.innerHTML = '';
      btn.appendChild(span);
      btn.insertAdjacentHTML('beforeend', tickIcon);
    } else if (optionText === selectedAnswer) {
      btn.classList.add('wrong');
      btn.innerHTML = '';
      btn.appendChild(span);
      btn.insertAdjacentHTML('beforeend', crossIcon);
    } else {
      btn.classList.add('faded');
    }
  });

  if (selectedAnswer === currentQuestion.correctAnswer) {
    score++;
    currentScoreDisplay.textContent = `Score: ${score}`;
  }

  if (currentQuestionIndex + 1 === questions.length) {
    nextBtn.textContent = 'See Results';
  } else {
    nextBtn.textContent = 'Next Question';
  }
}

function nextQuestion() {
  if (currentQuestionIndex + 1 < questions.length) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  finalScoreDisplay.textContent = score.toString();
  
  const percentage = (score / questions.length) * 100;
  if (percentage >= 80) {
    resultMessage.textContent = "Excellent! You're a Master!";
  } else if (percentage >= 50) {
    resultMessage.textContent = "Good job! Keep practicing.";
  } else {
    resultMessage.textContent = "Average. Try again to improve!";
  }
  
  showScreen('result-screen');
}

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', checkAnswer);
restartBtn.addEventListener('click', startQuiz);

// Initialize
showScreen('start-screen');
