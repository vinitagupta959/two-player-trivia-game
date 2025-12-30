let playerInput1 = document.getElementById("player1");
let playerInput2 = document.getElementById("player2");
let startBtn = document.getElementById("startBtn");
let errorPlyer1 = document.getElementById("errorPlyer1");
let errorPlyer2 = document.getElementById("errorPlyer2");
let categoryPage = document.getElementById("categoryPage");
let playerSetupPage = document.getElementById("playerSetupPage");
let startGame = document.getElementById("startGame");
let allCategory = document.getElementById("allCategory");
let errMegPage = document.getElementById("errMegPage");
let questionPage = document.getElementById("questionPage");
let questionText = document.getElementById("que");
let allOptions = document.querySelectorAll(".options");
let allOptionsText = document.querySelectorAll(".optionText");
let errorBoth = document.getElementById("errorBoth");
let roundText = document.getElementById("roundText");
let answerMsg = document.getElementById("answerMsg");
let nextBtn = document.getElementById("nextBtn");
let playerTurnText = document.getElementById("playerTurn");
let categoryText = document.getElementById("categoryText");
let difficultyText = document.getElementById("difficultyText");
let roundTextQue = document.getElementById("roundTextQue");
let player1ScoreText = document.getElementById("player1Score");
let player2ScoreText = document.getElementById("player2Score");
let summaryPage = document.getElementById("summaryPage");
let nextRoundBtn = document.getElementById("nextRoundBtn");
let endGameBtn = document.getElementById("endGameBtn");
let finalResultPage = document.getElementById("finalResultPage");
let finalScorePlyer1 = document.getElementById("finalScorePlyer1");
let finalScorePlyer2 = document.getElementById("finalScorePlyer2");
let resultContain = document.getElementById("resultText");
let round = 1;
let player1;
let player2;
let player1Score = 0;
let player2Score = 0;
let currectPlayer;
let category;
let difficulties;
let question;
let i = 0;
let correctAnswer;

startBtn.addEventListener("click", function () {
  if (playerInput1.value.trim() == "") {
    errorPlyer1.innerText = "Enter Vaild Name";
    return;
  } else if (playerInput2.value == "" || playerInput2.value == " ") {
    errorPlyer2.innerText = "Enter Vaild Name";
    errorPlyer1.innerText = "";
    return;
  } else if (playerInput1.value === playerInput2.value) {
    errorPlyer2.innerText = "";
    errorPlyer1.innerText = "";
    errorBoth.innerText = "Both player name is same use uniqe one";
    return;
  } else {
    errorPlyer1.innerText = "";
    errorPlyer2.innerText = "";
    errorBoth.innerText = "";
    player1 = playerInput1.value;
    player2 = playerInput2.value;
  }
  console.log(player1, player2);
  playerSetupPage.style.display = "none";
  categoryPage.style.display = "block";
  roundText.innerText = `Round ${round}`;
  // playerName1.innerText = player1;
  // playerName2.innerText = player2;
});

startGame.addEventListener("click", function () {
  category = allCategory.value;
  fetchQue(category);
});

async function fetchQue(category) {
  try {
    let response = await Promise.all([
      fetch(
        `https://the-trivia-api.com/v2/questions?limit=2&categories=${category}&difficulties=easy`
      ),
      fetch(
        `https://the-trivia-api.com/v2/questions?limit=2&categories=${category}&difficulties=medium`
      ),
      fetch(
        `https://the-trivia-api.com/v2/questions?limit=2&categories=${category}&difficulties=hard`
      ),
    ]);
    response.forEach(function (item) {
      if (!item.ok) {
        errMegPage.innerHTML =
          "<p>Something went wrong while fetching Data</p>";
        throw new Error("Reqest failed");
      }
    });
    let data = await Promise.all(
      response.map(function (item) {
        return item.json();
      })
    );
    if (data[0].length <2 || data[1].length <2 || data[2].length <2) {
      errMegPage.innerHTML =
        "<p>Question not found in this category try with diffenct category</p>";
    } else {
      let allQue = [...data[0], ...data[1], ...data[2]];
      question = allQue;
      displayQue(question);
    }
  } catch (err) {
    console.log(err.message);
  }
}

function displayQue(questions) {
  categoryPage.style.display = "none";
  questionPage.style.display = "block";
  nextBtn.disabled = true;
  let item = questions[i];
  let mixAnswer = [...item.incorrectAnswers];
  mixAnswer.push(item.correctAnswer);
  correctAnswer = item.correctAnswer;

  for (let j = 0; j < mixAnswer.length; j++) {
    let index = Math.floor(Math.random() * (j + 1));
    let temp;
    temp = mixAnswer[j];
    mixAnswer[j] = mixAnswer[index];
    mixAnswer[index] = temp;
  }

  findDifficulty();
  findCurrentPlayer();
  player1ScoreText.innerText = `${player1} : ${player1Score}`;
  player2ScoreText.innerText = `${player2} : ${player2Score}`;
  roundTextQue.innerText = `Round ${round}`;
  categoryText.innerText = `Category: ${category}`;
  difficultyText.innerText = `Difficulty: ${difficulties}`;
  playerTurnText.innerText = `${currectPlayer}'s turn`;
  questionText.innerText = `Q. ${item.question.text}`;
  allOptions.forEach(function (option, index) {
    option.value = mixAnswer[index];
    allOptionsText[index].innerText = mixAnswer[index];
  });

  // allOptions[1].value = mixAnswer[1];
  // allOptionsText[1].innerText = mixAnswer[1];
  // allOptions[2].value = mixAnswer[2];
  // allOptionsText[2].innerText = mixAnswer[2];
  // allOptions[3].value = mixAnswer[3];
  // allOptionsText[3].innerText = mixAnswer[3];
}

allOptions.forEach(function (option) {
  option.addEventListener("click", function () {
    let chooseAnswer = option.value;
    checkAnswer(chooseAnswer);
  });
});

function checkAnswer(choosenAnswer) {
  allOptions[0].disabled = true;
  allOptions[1].disabled = true;
  allOptions[2].disabled = true;
  allOptions[3].disabled = true;
  allOptions.forEach(function (option) {
    if (option.value == choosenAnswer) {
      option.disabled = false;
    }
  });
  if (correctAnswer == choosenAnswer) {
    answerMsg.innerText = `Correct Answer`;
    answerMsg.style.color = "green";
    updateScore();
    player1ScoreText.innerText = `${player1} : ${player1Score}`;
    player2ScoreText.innerText = `${player2} : ${player2Score}`;
  } else {
    answerMsg.innerText = `Oh it's Wrong!, Correct answer is: ${correctAnswer}`;
    answerMsg.style.color = "red";
  }
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", function () {
  allOptions[0].checked = "";
  allOptions[1].checked = "";
  allOptions[2].checked = "";
  allOptions[3].checked = "";
  allOptions[0].disabled = false;
  allOptions[1].disabled = false;
  allOptions[2].disabled = false;
  allOptions[3].disabled = false;
  answerMsg.innerText = "";
  answerMsg.style.color = "";
  if (i < 5) {
    i++;
    displayQue(question);
  } else {
    questionPage.style.display = "none";
    summaryPage.style.display = "flex";
    removeCategry();
    i = 0;
  }
});

endGameBtn.addEventListener("click", function () {
  summaryPage.style.display = "none";
  finalResultPage.style.display = "block";

  if (player1Score < player2Score) {
    resultContain.innerText = `${player2} is Win the Game`;
  } else if (player2Score < player1Score) {
    resultContain.innerText = `${player1} is win the Game`;
  } else {
    resultContain.innerText = `Game draw as both  player have equal score.`;
  }
  finalScorePlyer1.innerText = `${player1} Score is ${player1Score}`;
  finalScorePlyer2.innerText = `${player2} Score is ${player2Score}`;
});

nextRoundBtn.addEventListener("click", function () {
  console.log(allCategory);
  summaryPage.style.display = "none";
  categoryPage.style.display = "block";
  allCategory.value = "";
  round += 1;
  roundText.innerText = `Round ${round}`;
});
function updateScore() {
  let score;
  if (difficulties == "Easy") {
    score = 10;
  } else if (difficulties == "Medium") {
    score = 15;
  } else {
    score = 20;
  }
  if (currectPlayer == player1) {
    player1Score += score;
  } else {
    player2Score += score;
  }
}
function findCurrentPlayer() {
  if (i % 2 == 0) {
    currectPlayer = player1;
  } else {
    currectPlayer = player2;
  }
}
function findDifficulty() {
  if (i < 2) {
    difficulties = "Easy";
  } else if (i < 4) {
    difficulties = "Medium";
  } else {
    difficulties = "Hard";
  }
}

function removeCategry() {
  let categoryOptionList = document.querySelectorAll(".categoryOption");
  console.log(categoryOptionList);

  if (allCategory.length > 2) {
    categoryOptionList.forEach(function (option, index) {
      if (option.value == category) {
        allCategory.removeChild(allCategory[index]);
      }
    });
  } else {
    nextRoundBtn.disabled = true;
  }
}
