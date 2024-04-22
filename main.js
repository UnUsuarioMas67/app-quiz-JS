const path = 'questions.json';
const maxQuestions = 5;

let questions = [];
let currentQuestion = 0;

const questionElem = document.querySelector('#question');
const questionCounter = document.querySelector('#question-counter');

const answersElem = document.querySelector('#answers');
answersElem.onclick = (e) => {
	let answer = e.target;
	if (!answer.classList.contains('answer')) return;
	answerQuestion(answer.dataset.index);
};

const prevBtn = document.querySelector('#prev');
prevBtn.onclick = prevQuestion;
const nextBtn = document.querySelector('#next');
nextBtn.onclick = nextQuestion;
const resultBtn = document.querySelector('#check-result');
resultBtn.onclick = showResult;

const scoreElem = document.querySelector('#score');
const resetBtn = document.querySelector('#reset');
resetBtn.onclick = reset;
const reviewBtn = document.querySelector('#review');
reviewBtn.onclick = showQuestions;

const questionSection = document.querySelector('.question-section');
const resultSection = document.querySelector('.result-section');

window.onload = loadQuestions;

function loadQuestions() {
	fetch(path)
		.then((response) => response.json())
		.then((array) => {
			questions = [];

			for (let i = 0; i < maxQuestions; i++) {
				if (array.length == 0) break;

				// elige un elemento aleatorio del array de origen
				let randIndex = Math.floor(Math.random() * array.length);
				let newQuestion = array[randIndex];
				// agrega una nueva propiedad al objeto y luego este se añade al array 'questions'
				newQuestion.chosenAnswer = null;
				questions.push(newQuestion);
				// este elemento luego se elimina del array de origen para que no se repita
				array.splice(randIndex, 1);
			}

			console.log(questions);
			currentQuestion = 0;
			updateCurrentQuestion();
		});
}

function updateCurrentQuestion() {
	let q = questions[currentQuestion];

	questionElem.textContent = q.question;

	// quitar todos los hijos del elemento '#answers'
	while (answersElem.firstChild) {
		answersElem.removeChild(answersElem.lastChild);
	}

	for (let a in q.answers) {
		let btn = document.createElement('button');
		btn.textContent = q.answers[a];
		btn.dataset.index = a;
		btn.classList.add('answer');
		answersElem.appendChild(btn);
	}

	if (q.chosenAnswer != null) {
		disableQuestion(q);
	}

	updateButtons();
	updateCounter();
}

function disableQuestion(question) {
	for (let btn of answersElem.children) {
		if (!btn.classList.contains('answer')) continue;

		btn.disabled = true;

		if (btn.dataset.index == question.correctAnswer) {
			btn.classList.add('answer-correct');
		} else if (btn.dataset.index == question.chosenAnswer) {
			btn.classList.add('answer-wrong');
		}
	}
}

function nextQuestion() {
	if (currentQuestion == questions.length - 1) return;

	currentQuestion++;
	updateCurrentQuestion();
}

function prevQuestion() {
	if (currentQuestion == 0) return;

	currentQuestion--;
	updateCurrentQuestion();
}

function updateButtons() {
	nextBtn.hidden = currentQuestion == questions.length - 1;
	resultBtn.hidden = !(currentQuestion == questions.length - 1);
	prevBtn.disabled = currentQuestion == 0;
}

function answerQuestion(index) {
	const question = questions[currentQuestion];
	question.chosenAnswer = index;

	if (question.correctAnswer == index) {
		console.log('La respuesta es correcta');
	} else {
		console.log('La respuesta es incorrecta');
	}

	disableQuestion(question);

	if (questions.every((q) => q.chosenAnswer != null)) {
		resultBtn.disabled = false;
	}

	console.log(questions);
}

function showResult() {
	let score = 0;

	for (let question of questions) {
		if (question.chosenAnswer == question.correctAnswer) score++;
	}

	scoreElem.textContent = `${score}/${questions.length}`;

	questionSection.dataset.inactive = true;
	delete resultSection.dataset.inactive;
}

function showQuestions() {
	delete questionSection.dataset.inactive;
	resultSection.dataset.inactive = true;
}

function reset() {
	resultBtn.disabled = true;
	showQuestions();
	loadQuestions();
}

function updateCounter() {
	let questionCount = questions.length
	questionCounter.textContent = `Pregunta ${currentQuestion + 1} de ${questionCount}`;
}