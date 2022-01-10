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
  column.innerHTML = categories.name;
  game.append(column);

  //For each level in the levels array, add it to the url and then get the response, then log the data from the response.
  levels.forEach((level) => {
    const card = document.createElement("div");
    card.classList.add("card");
    column.append(card);

    if (level === "easy") {
      card.innerHTML = 100;
    } else if (level === "medium") {
      card.innerHTML = 200;
    } else if (level === "hard") {
      card.innerHTML = 300;
    }

    //Fetch api data
    fetch(
      `https://opentdb.com/api.php?amount=1&${categories.id}=12&difficulty=${level}&type=boolean`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        card.setAttribute("data-question", data.results[0].question);
        card.setAttribute("data-answer", data.results[0].correct_answer);
        card.setAttribute("data-value", card.getInnerHTML());
      })
      .then((done) => card.addEventListener("click", flipCard));
  });
}

categories.forEach((category) => addCategory(category));

function flipCard() {
  console.log("clicked");
  const textDisplay = document.createElement("div");
  const trueButton = document.createElement("button");
  const falseButton = document.createElement("button");
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
    cardOfButton.removeEventListener("click", flipCard);
  } else {
    cardOfButton.classList.add("wrong-answer");
    cardOfButton.removeEventListener("click", flipCard);
  }
}
