const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
let score = 0;

const categories = [
  {
    name: "Film",
    id: 11,
  },
  {
    name: "Music",
    id: 12,
  },
  {
    name: "Television",
    id: 14,
  },
];

const levels = ["easy", "medium", "hard"];

//Creates a column div and add it to the game div html.
function addCategory(categories) {
  const column = document.createElement("div");
  column.classList.add("category-column");
  game.append(column);

  const h3 = document.createElement("h3");
  h3.innerHTML = categories.name;
  column.append(h3);

  //For each level in the levels array, add it to the url and then get the response, then log the data from the response.
  levels.forEach((level) => {
    const card = document.createElement("div");
    card.classList.add("card");
    column.append(card);

    const cardPoints = document.createElement("p");
    cardPoints.classList.add("card-points");
    card.append(cardPoints);

    if (level === "easy") {
      cardPoints.innerHTML = "100 Pts";
    } else if (level === "medium") {
      cardPoints.innerHTML = "200 Pts";
    } else if (level === "hard") {
      cardPoints.innerHTML = "300 Pts";
    }

    //Fetch api data
    fetch(
      `https://opentdb.com/api.php?amount=1&category=${categories.id}&difficulty=${level}&type=boolean`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        card.setAttribute("data-question", data.results[0].question);
        card.setAttribute("data-answer", data.results[0].correct_answer);
        card.setAttribute("data-value", cardPoints.getInnerHTML());
      })
      .then((done) => card.addEventListener("click", flipCard));
  });
}

categories.forEach((category) => addCategory(category));

function flipCard() {
  this.innerHTML = "";
  this.style.fontSize = "15px";
  const textDisplay = document.createElement("div");
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  const trueButton = document.createElement("button");
  const falseButton = document.createElement("button");
  trueButton.classList.add("true-button");
  falseButton.classList.add("false-button");
  trueButton.innerHTML = "True";
  falseButton.innerHTML = "False";
  trueButton.addEventListener("click", getResult);
  falseButton.addEventListener("click", getResult);
  textDisplay.innerHTML = this.getAttribute("data-question");
  this.append(textDisplay, trueButton, falseButton);

  const allCards = Array.from(document.querySelectorAll(".card"));
  allCards.forEach((card) => card.removeEventListener("click", flipCard));
}

function getResult() {
  const allCards = Array.from(document.querySelectorAll(".card"));
  allCards.forEach((card) => card.addEventListener("click", flipCard));

  const cardOfButton = this.parentElement;

  if (cardOfButton.getAttribute("data-answer") === this.innerHTML) {
    score = score + parseInt(cardOfButton.getAttribute("data-value"));
    scoreDisplay.innerHTML = score;

    cardOfButton.classList.add("correct-answer");

    setTimeout(() => {
      while (cardOfButton.firstChild) {
        cardOfButton.removeChild(cardOfButton.lastChild);
      }
      cardOfButton.innerHTML = cardOfButton.getAttribute("data-value");
    }, 100);
  } else {
    cardOfButton.classList.add("wrong-answer");
    setTimeout(() => {
      while (cardOfButton.firstChild) {
        cardOfButton.removeChild(cardOfButton.lastChild);
      }
      cardOfButton.innerHTML = 0;
    }, 100);
  }

  cardOfButton.removeEventListener("click", flipCard);
}
