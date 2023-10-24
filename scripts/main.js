// @ Listeners
document.addEventListener("click", async function (e) {
  if (e.target.id == "start") {
    startGame();
  } else if (e.target.id == "nextRound") {
    const checked = document.querySelectorAll("input[type='radio']:checked");

    if (checked && checked.length == 2) {
      // @ todas respondidas
      let correct = 0;

      for (let i = 0; i < checked.length; i++) {
        let responseIndex = checked[i].dataset.index;

        if (responseIndex) {
          const questions = await fetchQuestions();
          const currentQuestion = questions.filter(
            (question) => question.pregunta == checked[i].dataset.question
          );

          if (currentQuestion[0].respuesta_correcta == responseIndex) correct++;
        }
      }

      if (correct != 2)
        return alert(
          "Respuestas incorrectas, no puedes pasar a la siguiente ronda"
        );

      if (currentRound + 1 < maxRounds) {
        currentRound++;
        nextRound(sortedQuestions);
      } else {
        deleteElements();

        console.log("Has terminado");
        const finalText = document.createElement("h1");
        finalText.textContent="Has terminado! completaste todas las preguntas correctamente!";
        finalText.style.color="green";
        document.body.appendChild(finalText);
      }
    } else alert("Por favor, responde todas las preguntas");
  }
});

// @ Vars
let currentRound = 0;
let sortedQuestions;

const maxRounds = 3;

// @ Functions --- inician las preguntas
const startGame = async () => {
  document.querySelector("#start").style.display = "none";

  const questions = await fetchQuestions();

  if (!questions) return;

  sortedQuestions = questions.sort(() => 0.5 - Math.random());

  nextRound(sortedQuestions);
};

//siguente ronda
const nextRound = (sortedQuestions) => {
  // @ Borrarme todas las preguntas de la pantalla Y EL BOTON
  deleteElements();

  // @ Renderizarme 2 preguntas, una con el número de la ronda + 1 y otra numero de ronda + 2
  let roundValues = getRoundValues();

  renderQuestion(roundValues[0], sortedQuestions[roundValues[0]]);
  renderQuestion(roundValues[1], sortedQuestions[roundValues[1]]);

  // @ Next Question Button
  const nextButton = document.createElement("button");
  nextButton.id = "nextRound";
  nextButton.className = "w-[450px] bg-blue-500 py-2 text-white";
  nextButton.textContent = "Siguiente ronda";

  document.body.appendChild(nextButton);
};

function getRoundValues() {
  return [2 * currentRound, 2 * currentRound + 1];
}

const deleteElements = () => {
  var divs = document.getElementsByTagName("div");
  var buttons = document.getElementsByTagName("button");

  for (var i = divs.length - 1; i >= 0; i--) {
    divs[i].remove();
  }

  for (var i = buttons.length - 1; i >= 0; i--) {
    buttons[i].remove();
  }
};

const renderQuestion = (questionIndex, question) => {
  const body = document.body;
  const completeQuestion = document.createElement("div");

  completeQuestion.id = "question-" + questionIndex;
  completeQuestion.className =
    "flex flex-col rounded-lg shadow-xl border-solid border-2 border-grey p-5 w-[450px]";

  completeQuestion.innerHTML = `
        <h2>${question.pregunta}</h2>

        <div class="flex flex-col gap-2 mt-3">
            ${question.respuestas
              .map((respuesta, index) => {
                return `
                        <div class="flex items-center gap-5">
                            <input type="radio" data-question="${question.pregunta}" data-index="${index}" name="question-${questionIndex}" id="response-${questionIndex}-${index}" />
                            <label for="response-${questionIndex}-${index}">${respuesta}</label>
                        </div>
                    `;
              })
              .join("")}
        </div>
    `;

  body.appendChild(completeQuestion);
};

const fetchQuestions = async () => {
  const questions = await fetch("./scripts/questions.json");
  const json = questions.json();

  if (!json) return false;

  return json;
};
