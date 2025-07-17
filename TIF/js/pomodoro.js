{/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script> */ }

// Configuración inicial
const timerSettings = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    longBreakInterval: 4
};

let timer;
let totalSeconds = timerSettings.pomodoro;
let secondsLeft = timerSettings.pomodoro;
let isRunning = false;
let mode = 'pomodoro';
let pomodoroCount = 0;
const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');

// Elementos del DOM
const timeLeftDisplay = document.getElementById('time-left');
const startPauseBtn = document.getElementById('start-pause-btn');
const modeButtons = document.querySelectorAll('.mode-btn');
const progressRing = document.getElementById('progress-ring');
const pomodoroCountDisplay = document.getElementById('pomodoro-count');
const currentModeDisplay = document.getElementById('current-mode');

// Inicializar el círculo de progreso
updateProgressCircle();

// Función para formatear el tiempo (mm:ss)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Actualizar el círculo de progreso
function updateProgressCircle() {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (secondsLeft / totalSeconds) * circumference;
    progressRing.style.strokeDashoffset = offset;
}

// Actualizar la visualización del temporizador
function updateDisplay() {
    timeLeftDisplay.textContent = formatTime(secondsLeft);
    document.title = `${formatTime(secondsLeft)} - ${mode === 'pomodoro' ? 'Trabaja' : 'Descansa'} | Pomodoro`;
    updateProgressCircle();
}

// Función principal del temporizador
function timerTick() {
    if (secondsLeft > 0) {
        secondsLeft--;
        updateDisplay();
    } else {
        audio.play();
        clearInterval(timer);
        isRunning = false;

        if (mode === 'pomodoro') {
            pomodoroCount++;
            pomodoroCountDisplay.textContent = pomodoroCount;

            if (pomodoroCount % timerSettings.longBreakInterval === 0) {
                switchMode('longBreak');
            } else {
                switchMode('shortBreak');
            }
        } else {
            switchMode('pomodoro');
        }

        toggleTimer();
    }
}

// Cambiar entre iniciar/pausar
function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startPauseBtn.textContent = 'Iniciar';
    } else {
        timer = setInterval(timerTick, 1000);
        isRunning = true;
        startPauseBtn.textContent = 'Pausar';
    }
}

// Cambiar de modo (pomodoro/descanso)
function switchMode(newMode) {
    mode = newMode;

    // Configurar el tiempo según el modo
    totalSeconds = timerSettings[mode];
    secondsLeft = totalSeconds;

    // Actualizar el color del círculo y botones
    let color;
    let modeText;

    switch (mode) {
        case 'pomodoro':
            color = 'var(--pomodoro)';
            modeText = 'Pomodoro';
            break;
        case 'shortBreak':
            color = 'var(--shortBreak)';
            modeText = 'Descanso Corto';
            break;
        case 'longBreak':
            color = 'var(--longBreak)';
            modeText = 'Descanso Largo';
            break;
    }

    document.documentElement.style.setProperty('--text', color);
    progressRing.style.stroke = color;
    currentModeDisplay.textContent = modeText;

    // Actualizar botones activos
    modeButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${mode}-btn`).classList.add('active');

    // Actualizar la visualización
    updateDisplay();

    // Pausar el temporizador si está corriendo
    if (isRunning) {
        toggleTimer();
    }
}

// Reiniciar el temporizador
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    secondsLeft = totalSeconds;
    updateDisplay();
    startPauseBtn.textContent = 'Iniciar';
}
