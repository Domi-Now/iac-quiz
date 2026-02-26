// version 6
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let playerName = "";

// -------------------------
// SHUFFLE FUNCTION
// -------------------------
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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
    hideAllScreens();
    document.getElementById("intro-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "block";

    fetch(`questions_level${level}.json`)
        .then(response => response.json())
        .then(data => {

            const shuffled = shuffleArray(data);
            questions = shuffled.slice(0, 12);

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
        `Question ${currentQuestionIndex + 1} of 12`;

    document.getElementById("question-text").textContent = question.question;

    const container = document.getElementById("question-container");
    container.innerHTML = "";

    const explanationBox = document.getElementById("explanation-box");
    explanationBox.style.display = "none";
    explanationBox.textContent = "";

    const answers = question.answers.map((answer, index) => ({
        text: answer,
        index: index
    }));

    const shuffled = shuffleArray(answers);

    shuffled.forEach(answerObj => {
        const btn = document.createElement("button");
        btn.textContent = answerObj.text;
        btn.onclick = () => selectAnswer(answerObj.index, question.correct);
        container.appendChild(btn);
    });

    document.getElementById("next-btn").style.display = "none";
}

// -------------------------
// ANSWER SELECTION
// -------------------------
function selectAnswer(selectedIndex, correctIndex) {
    const buttons = document.querySelectorAll("#question-container button");

    buttons.forEach(btn => {
        const originalAnswerIndex =
            questions[currentQuestionIndex].answers.indexOf(btn.textContent);

        if (originalAnswerIndex === correctIndex) btn.classList.add("correct");
        if (originalAnswerIndex === selectedIndex && selectedIndex !== correctIndex)
            btn.classList.add("wrong");

        btn.disabled = true;
    });

    if (selectedIndex === correctIndex) score++;

    const explanationBox = document.getElementById("explanation-box");
    explanationBox.style.display = "block";
    explanationBox.textContent = questions[currentQuestionIndex].explanation;

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
    hideAllScreens();
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
// SHOW HIGHSCORES
// -------------------------
function showHighscores() {
    hideAllScreens();
    document.getElementById("highscore-screen").style.display = "block";

    const list = document.getElementById("highscore-list");
    list.innerHTML = "";

    const highscores = JSON.parse(localStorage.getItem("highscores")) || [];

    highscores.forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${entry.name} – ${entry.score}`;
        list.appendChild(li);
    });
}

// -------------------------
// CLEAR HIGHSCORES
// -------------------------
function clearHighscores() {
    if (confirm("Are you sure you want to clear all highscores?")) {
        localStorage.removeItem("highscores");
        showHighscores();
    }
}

// -------------------------
// NAVIGATION HELPERS
// -------------------------
function hideAllScreens() {
    document.getElementById("intro-screen").style.display = "none";
    document.getElementById("name-screen").style.display = "none";
    document.getElementById("level-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "none";
    document.getElementById("highscore-screen").style.display = "none";
}

function goBackToLevels() {
    hideAllScreens();
    document.getElementById("intro-screen").style.display = "block";
    document.getElementById("level-screen").style.display = "block";
}