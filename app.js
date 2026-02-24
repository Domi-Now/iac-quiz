let currentLevel = 1;
let questions = [];
let currentSet = [];
let currentIndex = 0;
let score = 0;

let levelScores = {
    1: 0,
    2: 0,
    3: 0
};

async function startLevel(level) {
    currentLevel = level;

    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("score-screen").classList.add("hidden");
    document.getElementById("final-screen").classList.add("hidden");

    document.getElementById("quiz-screen").classList.remove("hidden");
    document.getElementById("level-title").innerText = `Level ${level}`;

    await loadQuestions(level);
    startQuiz();
}

async function loadQuestions(level) {
    const res = await fetch(`questions_level${level}.json`);
    questions = await res.json();
}

function startQuiz() {
    currentSet = questions.sort(() => 0.5 - Math.random()).slice(0, 10);
    currentIndex = 0;
    score = 0;

    showQuestion();
}

function showQuestion() {
    const q = currentSet[currentIndex];
    document.getElementById("question").innerText = q.question;

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    const oldExp = document.getElementById("explanation");
    if (oldExp) oldExp.remove();

    q.answers.forEach((ans, i) => {
        const btn = document.createElement("button");
        btn.innerText = ans;
        btn.onclick = () => checkAnswer(i);
        answersDiv.appendChild(btn);
    });
}

function checkAnswer(i) {
    const q = currentSet[currentIndex];

    if (i === q.correct) score++;

    const exp = document.createElement("div");
    exp.id = "explanation";
    exp.innerText = `Explanation: ${q.explanation}`;
    document.getElementById("quiz-screen").appendChild(exp);

    document.getElementById("next-btn").classList.remove("hidden");
}

document.getElementById("next-btn").onclick = () => {
    currentIndex++;
    document.getElementById("next-btn").classList.add("hidden");

    const oldExp = document.getElementById("explanation");
    if (oldExp) oldExp.remove();

    if (currentIndex < currentSet.length) {
        showQuestion();
    } else {
        endLevel();
    }
};

function endLevel() {
    levelScores[currentLevel] = score;

    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("score-screen").classList.remove("hidden");

    const accuracy = Math.round((score / 10) * 100);

    document.getElementById("score-title").innerText =
        `Level ${currentLevel} completed!`;

    document.getElementById("score-details").innerText =
        `Correct answers: ${score}/10\nAccuracy: ${accuracy}%`;

    document.getElementById("continue-btn").onclick = () => {
        if (currentLevel < 3) {
            startLevel(currentLevel + 1);
        } else {
            showFinalResults();
        }
    };
}

function showFinalResults() {
    document.getElementById("score-screen").classList.add("hidden");
    document.getElementById("final-screen").classList.remove("hidden");

    const total = levelScores[1] + levelScores[2] + levelScores[3];

    document.getElementById("final-summary").innerText =
        `Level 1: ${levelScores[1]}/10
Level 2: ${levelScores[2]}/10
Level 3: ${levelScores[3]}/10

Total: ${total}/30`;
}

function restartQuiz() {
    document.getElementById("final-screen").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
}