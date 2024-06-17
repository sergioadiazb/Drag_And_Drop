const levels = [4, 8, 12];
const contentCard = [
  ["2x3", "15x3", "8x2", "4+4", "5x12", "3-1", "4-4", "13x4", "10x9", "5x5", "10+13", "11-10", "Ana tiene 5 cajas de huevos y cada caja tiene 6 huevos ¿Cuantos huevos tiene en total?", "2x14", "45-30", "8+9", "12x3", "20-13", "13x3", "2x17", "Juan tiene 5 manzanas y se come 2 ¿cuantas manzanas quedan?", "4x11"],
  ["6", "45", "16", "8", "60", "2", "0", "52", "90", "25", "23", "1", "30", "28", "15", "17", "36", "7", "39", "34", "3", "44"]
];

const containerProblems = document.getElementById('content-problems');
const containerAnswers = document.getElementById('content-answers');
const restartButton = document.getElementById('restartButton');
const startTimerButton = document.getElementById('startTimerButton');
const timerElement = document.getElementById('timer');
const correctCountElement = document.getElementById("correctCount");
const errorCountElement = document.getElementById("errorCount");
const totalCorrectCountElement = document.getElementById("totalCorrectCount");
const totalErrorCountElement = document.getElementById("totalErrorCount");
const levelElement = document.getElementById("level");
const totalScoreElement = document.getElementById("totalscore");
const playerInfoContainer = document.getElementById('player-info');

let correctCount = 0;
let errorCount = 0;
let currentLevel = 0;
let timerInterval;
let timerSeconds = 0;
let timerMinutes = 0;

function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timerSeconds++;
  if (timerSeconds === 60) {
    timerMinutes++;
    timerSeconds = 0;
  }
  timerElement.textContent = `${timerMinutes < 10 ? '0' + timerMinutes : timerMinutes}:${timerSeconds < 10 ? '0' + timerSeconds : timerSeconds}`;
}

function stopTimer() {
  clearInterval(timerInterval);
}

function restartTimer() {
  timerSeconds = 0;
  timerMinutes = 0;
  timerElement.textContent = '00:00';
}

function restartGame() {
  stopTimer(); // Detener el temporizador
  correctCount = 0;
  errorCount = 0;
  currentLevel = 0;
  levelElement.textContent = currentLevel + 1;
  correctCountElement.textContent = correctCount;
  errorCountElement.textContent = errorCount;
  totalCorrectCountElement.textContent = correctCount;
  totalErrorCountElement.textContent = errorCount;
  totalScoreElement.textContent = 0;
  restartTimer(); // Reiniciar el temporizador al reiniciar el juego
  playerInfoContainer.style.display = 'none'; // Ocultar el formulario
  draw();
}

function nextLevel() {
  currentLevel++;
  if (currentLevel >= levels.length) {
    stopTimer(); // Detener el temporizador al completar todos los niveles
    showCompletionMessage();
  } else {
    levelElement.textContent = currentLevel + 1;
    correctCount = 0;
    errorCount = 0;
    correctCountElement.textContent = correctCount;
    errorCountElement.textContent = errorCount;
    draw();
  }
}

function showCompletionMessage() {
  const totalScore = parseInt(totalScoreElement.textContent);
  const totalCorrect = parseInt(totalCorrectCountElement.textContent);
  const totalErrors = parseInt(totalErrorCountElement.textContent);
  const finalTime = timerElement.textContent; // Captura el tiempo final
  const scoreGrade = calculateScoreGrade(totalScore, totalCorrect, totalErrors); // Calcula la nota

  Swal.fire({
    title: '¡Felicidades por terminar el juego!',
    html: `<p>Puntaje: ${totalScore}</p>
           <p>Aciertos totales: ${totalCorrect}</p>
           <p>Errores totales: ${totalErrors}</p>
           <p>Nota: ${scoreGrade}</p>
           <p>Tiempo total de juego: ${finalTime}</p>`,
    icon: 'success',
    confirmButtonText: 'OK'
  }).then(() => {
    playerInfoContainer.style.display = 'block'; // Mostrar el formulario
  });
}

function draw() {
  containerProblems.innerHTML = '';
  containerAnswers.innerHTML = '';
  const numOfPairs = levels[currentLevel];
  const indices = Array.from({ length: contentCard[0].length }, (_, i) => i).sort(() => Math.random() - 0.5);
  const selectedIndices = indices.slice(0, numOfPairs);

  const problems = [];
  const answers = [];

  selectedIndices.forEach(index => {
    const problemDiv = document.createElement('div');
    problemDiv.classList.add('problem');
    problemDiv.textContent = contentCard[0][index];
    problemDiv.setAttribute('data-index', index);
    problems.push(problemDiv);

    const answerDiv = document.createElement('div');
    answerDiv.classList.add('answer');
    answerDiv.textContent = contentCard[1][index];
    answerDiv.setAttribute('data-index', index);
    answerDiv.setAttribute('draggable', true);
    answers.push(answerDiv);
  });

  // Mezclar las respuestas antes de agregarlas al contenedor
  answers.sort(() => Math.random() - 0.5);

  problems.forEach(problem => containerProblems.appendChild(problem));
  answers.forEach(answer => containerAnswers.appendChild(answer));

  addDragAndDropListeners();
}

function addDragAndDropListeners() {
  const answers = document.querySelectorAll('.answer');
  const problems = document.querySelectorAll('.problem');

  answers.forEach(answer => {
    answer.addEventListener('dragstart', handleDragStart);
    answer.addEventListener('dragend', handleDragEnd);
  });

  problems.forEach(problem => {
    problem.addEventListener('dragover', handleDragOver);
    problem.addEventListener('drop', handleDrop);
  });
}

function handleDragStart(event) {
  event.dataTransfer.setData('text', event.target.getAttribute('data-index'));
  setTimeout(() => {
    event.target.style.opacity = '0.5';
  }, 0);
}

function handleDragEnd(event) {
  event.target.style.opacity = '1';
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const problemIndex = event.target.getAttribute('data-index');
  const answerIndex = event.dataTransfer.getData('text');
  const answerElement = document.querySelector(`.answer[data-index="${answerIndex}"]`);
  if (problemIndex === answerIndex) {
    event.target.textContent += ' ✓';
    event.target.classList.add('correct');
    answerElement.classList.add('correct');
    answerElement.setAttribute('draggable', false);
    correctCount++;
    totalScoreElement.textContent = parseInt(totalScoreElement.textContent) + 20; // Aumentar 20 puntos por acierto
  } else {
    errorCount++;
    totalScoreElement.textContent = parseInt(totalScoreElement.textContent) - 13; // Disminuir 13 puntos por error
  }
  correctCountElement.textContent = correctCount;
  errorCountElement.textContent = errorCount;
  totalCorrectCountElement.textContent = parseInt(totalCorrectCountElement.textContent) + (problemIndex === answerIndex ? 1 : 0);
  totalErrorCountElement.textContent = parseInt(totalErrorCountElement.textContent) + (problemIndex !== answerIndex ? 1 : 0);

  if (correctCount === levels[currentLevel]) {
    setTimeout(() => {
      Swal.fire({
        title: `¡Felicidades! Has completado el nivel ${currentLevel + 1}.`,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        nextLevel();
      });
    }, 100);
  }
}

restartButton.addEventListener('click', restartGame);
startTimerButton.addEventListener('click', startTimer);
restartGame();

document.getElementById("playerForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const grade = document.getElementById("grade").value; 
  const school = document.getElementById("schools").value;
  
  // Variables que ya están definidas en el script.js
  const totalScore = parseInt(totalScoreElement.textContent);
  const totalCorrectCount = parseInt(totalCorrectCountElement.textContent);
  const totalErrorCount = parseInt(totalErrorCountElement.textContent);
  const finalTime = timerElement.textContent;
  const scoreGrade = calculateScoreGrade(totalScore, totalCorrectCount, totalErrorCount);

  console.log("totalScore:", totalScore);
  console.log("totalCorrectCount:", totalCorrectCount);
  console.log("totalErrorCount:", totalErrorCount);
  console.log("scoreGrade:", scoreGrade);

  const gameData = {
    name,
    age,
    grade,
    hit: totalCorrectCount,
    failure: totalErrorCount,
    note: scoreGrade,
    idSchool: parseInt(school),
    score: totalScore,
    playingTime: finalTime,
  };

  axios.post('https://backendmemorygame-production.up.railway.app/api/game/createGame', gameData)
    .then(response => {
      console.log('Respuesta de la API:', response.data);
      Swal.fire({
        title: 'Datos enviados correctamente',
        text: 'Los datos del juego se han enviado correctamente.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        restartGame(); // Reiniciar el juego
      });
    })
    .catch(error => {
      console.error('Error al crear el juego:', error);
      Swal.fire({
        title: 'Error al enviar los datos',
        text: 'Hubo un problema al intentar enviar los datos del juego.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
});


function calculateScoreGrade(totalScore, totalCorrectCount, totalErrorCount) {
  // Calcular el puntaje máximo posible
  const maxScore = 480;

  // Calcular el puntaje obtenido
  const score = totalScore + (totalCorrectCount * 20) - (totalErrorCount * 13);

  // Calcular la nota en base al puntaje obtenido
  let scoreGrade = (score / maxScore) * 4 + 1;

  // Asegurarse de que la nota esté dentro del rango de 1.0 a 5.0
  scoreGrade = Math.max(1.0, Math.min(5.0, scoreGrade));

  return scoreGrade.toFixed(1); // Redondear a un decimal
}





