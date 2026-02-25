let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let playerName = "";

// -------------------------
// NAME INPUT LOGIC
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
    const nameScreen = document.getElementById("name-screen");
    const levelScreen = document.getElementById("level-screen");
    const nameInput = document.getElementById("player-name-input");
    const startNameBtn = document.getElementById("start-name-btn");
    const nameDisplay = document.getElementById("player-name-display");

    const savedName = localStorage.getItem("playerName");

    if (savedName) {
        playerName = savedName;
        nameDisplay.textContent = savedName;
        nameScreen.style.display = "none";
        levelScreen.style.display = "block";
    }

    startNameBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();

        if (name.length < 2) {
            alert("Please enter a valid name.");
            return;
        }

        localStorage.setItem("playerName", name);
        playerName = name;

        nameDisplay.textContent = name;
        nameScreen.style.display = "none";
        levelScreen.style.display = "block";
    });
});

// -------------------------
// QUIZ START
// -------------------------
function startQuiz(level) {
    document.getElementById("level-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "block";

    fetch(`questions_level${level}.json`)
        .then(response => response.json())
        .then(data => {
            questions = data;
            currentQuestionIndex = 0;
            score = 0;
            showQuestion();
        });
}

// -------------------------
// SHOW QUESTION
// -------------------------
function showQuestion() {
    const question = questions[currentQuestionIndex];

    document.getElementById("question-title").textContent =
        `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    const container = document.getElementById("question-container");
    container.innerHTML = "";

    question.answers.forEach((answer, index) => {
        const btn = document.createElement("button");
        btn.textContent = answer;
        btn.onclick = () => selectAnswer(index, question.correct);
        container.appendChild(btn);
    });

    document.getElementById("next-btn").style.display = "none";
}

// -------------------------
// ANSWER SELECTION
// -------------------------
function selectAnswer(selectedIndex, correctIndex) {
    const buttons = document.querySelectorAll("#question-container button");

    buttons.forEach((btn, index) => {
        if (index === correctIndex) btn.classList.add("correct");
        if (index === selectedIndex && selectedIndex !== correctIndex)
            btn.classList.add("wrong");

        btn.disabled = true;
    });

    if (selectedIndex === correctIndex) score++;

    document.getElementById("next-btn").style.display = "block";
    document.getElementById("next-btn").onclick = nextQuestion;
}

// -------------------------
// NEXT QUESTION
// -------------------------
function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

// -------------------------
// END QUIZ
// -------------------------
function endQuiz() {
    document.getElementById("quiz-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "block";

    document.getElementById("result-text").textContent =
        `${playerName}, your score is ${score} out of ${questions.length}.`;

    saveHighscore(score);
}

// -------------------------
// SAVE HIGHSCORE
// -------------------------
function saveHighscore(score) {
    let highscores = JSON.parse(localStorage.getItem("highscores")) || [];

    highscores.push({
        name: playerName,
        score: score,
        date: new Date().toLocaleString()
    });

    highscores.sort((a, b) => b.score - a.score);

    localStorage.setItem("highscores", JSON.stringify(highscores));
}

// -------------------------
// BACK TO LEVELS
// -------------------------
function goBackToLevels() {
    document.getElementById("result-screen").style.display = "none";
    document.getElementById("level-screen").style.display = "block";
}