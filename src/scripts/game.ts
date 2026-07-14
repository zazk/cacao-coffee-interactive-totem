import { mapPoints } from '../data/mapPoints';
import { questions } from '../data/questions';
import { submitScore } from '../lib/api';

type Screen = 'start' | 'map' | 'quiz' | 'register' | 'thanks';

const QUIZ_TIME_SECONDS = 20;

interface GameState {
	screen: Screen;
	visitedPoints: Set<number>;
	currentQuestion: number;
	answers: Record<number, string>;
	timerId: ReturnType<typeof setInterval> | null;
	timeLeft: number;
	gameStartedAt: number | null; // ms timestamp when the quiz begins
}

const state: GameState = {
	screen: 'start',
	visitedPoints: new Set(),
	currentQuestion: 0,
	answers: {},
	timerId: null,
	timeLeft: QUIZ_TIME_SECONDS,
	gameStartedAt: null,
};

function $(id: string): HTMLElement {
	const el = document.getElementById(id);
	if (!el) throw new Error(`Element #${id} not found`);
	return el;
}

function showScreen(screen: Screen): void {
	state.screen = screen;
	document.querySelectorAll('[data-screen]').forEach((el) => {
		el.classList.toggle('active', el.getAttribute('data-screen') === screen);
	});
}

function renderMapPoints(): void {
	const container = $('map-points');
	container.innerHTML = '';

	const nextPoint = state.visitedPoints.size + 1;

	mapPoints.forEach((point) => {
		const btn = document.createElement('button');

		const visited = state.visitedPoints.has(point.id);
		const enabled = visited || point.id === nextPoint;

		btn.type = 'button';
		btn.className = `map-point${visited ? ' visited' : ''}`;

		btn.style.left = `${point.x}%`;
		btn.style.top = `${point.y}%`;

		btn.innerHTML = `<span class="map-point__number">${point.id}</span>`;

		if (enabled) {
			btn.addEventListener('click', () => openPointDetail(point.id));
		}

		container.appendChild(btn);
	});
}

function openPointDetail(id: number): void {
	const point = mapPoints.find((p) => p.id === id);
	if (!point) return;

	const detailCard = $('detail-card');

	detailCard.style.backgroundImage = `url("${point.background}")`;

	$('detail-text').textContent = point.text;
	$('detail-overlay').classList.add('open');

	if (!state.visitedPoints.has(id)) {
		state.visitedPoints.add(id);
		renderMapPoints();
	}
}

function updateTestButton(): void {
	const btn = $('btn-test');
	const enabled = state.visitedPoints.size === mapPoints.length;
	btn.classList.toggle('enabled', enabled);
}

function closePointDetail(): void {
	$('detail-overlay').classList.remove('open');

	$('detail-card').style.backgroundImage = '';

	updateTestButton();
}

function startQuiz(): void {
	state.currentQuestion = 0;
	state.answers = {};
	state.gameStartedAt = Date.now();
	showScreen('quiz');
	renderQuestion();
}

function clearTimer(): void {
	if (state.timerId) {
		clearInterval(state.timerId);
		state.timerId = null;
	}
}

function startTimer(): void {
	clearTimer();
	state.timeLeft = QUIZ_TIME_SECONDS;
	updateTimerDisplay();

	state.timerId = setInterval(() => {
		state.timeLeft -= 1;
		updateTimerDisplay();
		if (state.timeLeft <= 0) {
			clearTimer();
			selectAnswer(null);
		}
	}, 1000);
}

function updateTimerDisplay(): void {
	const timer = $('quiz-timer');
	timer.textContent = `00:${String(state.timeLeft).padStart(2, '0')}`;
	timer.classList.toggle('warning', state.timeLeft <= 5);
}

function renderQuestion(): void {
	const question = questions[state.currentQuestion];
	if (!question) return;

	$('quiz-question').textContent = question.text;

	const optionsEl = $('quiz-options');
	optionsEl.innerHTML = '';

	question.options.forEach((option) => {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'quiz-option';
		btn.textContent = option.text;
		btn.addEventListener('click', () => selectAnswer(option.id));
		optionsEl.appendChild(btn);
	});

	startTimer();
}

function selectAnswer(optionId: string | null): void {
	clearTimer();
	const question = questions[state.currentQuestion];
	if (!question) return;

	if (optionId) {
		state.answers[question.id] = optionId;
	}

	const options = $('quiz-options').querySelectorAll('.quiz-option');
	options.forEach((btn, i) => {
		const opt = question.options[i];
		if (!opt) return;
		(btn as HTMLButtonElement).disabled = true;
		if (opt.id === question.correctId) {
			btn.classList.add('correct');
		} else if (opt.id === optionId) {
			btn.classList.add('wrong');
		}
	});

	setTimeout(() => {
		if (state.currentQuestion < questions.length - 1) {
			state.currentQuestion += 1;
			renderQuestion();
		} else {
			showScreen('register');
		}
	}, 1200);
}

function handleRegisterSubmit(event: Event): void {
	event.preventDefault();
	const form = event.target as HTMLFormElement;
	const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
	const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();

	if (!name || !email) return;

	const score = questions.reduce((acc, q) => {
		return acc + (state.answers[q.id] === q.correctId ? 1 : 0);
	}, 0);

	const timeMs = state.gameStartedAt ? Date.now() - state.gameStartedAt : 0;
	const userId = crypto.randomUUID();

	// Send score to the backend — fire and forget so the UI never waits
	submitScore({ userId, email, name, score, timeMs }).catch((err) => {
		console.warn('[api] Failed to save score:', err);
	});

	$('thanks-score').textContent = `You scored ${score} out of ${questions.length} correct answers.`;
	showScreen('thanks');
	form.reset();
}

function resetGame(): void {
	clearTimer();
	state.visitedPoints = new Set();
	state.currentQuestion = 0;
	state.answers = {};
	state.gameStartedAt = null;
	closePointDetail();
	renderMapPoints();
	showScreen('start');
}

export function initGame(): void {
	renderMapPoints();
	updateTestButton();

	$('btn-start').addEventListener('click', () => {
		showScreen('map');
	});

	$('btn-test').addEventListener('click', () => {
		if (state.visitedPoints.size === mapPoints.length) {
			startQuiz();
		}
	});

	$('btn-close-detail').addEventListener('click', closePointDetail);

	$('detail-overlay').addEventListener('click', (e) => {
		if (e.target === $('detail-overlay')) closePointDetail();
	});

	$('register-form').addEventListener('submit', handleRegisterSubmit);
	$('btn-restart').addEventListener('click', resetGame);
}
