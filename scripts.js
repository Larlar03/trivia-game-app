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

//Add Categories function. Creates the grid layout and calls API
function addCategory(categories) {
  //Creates a div with the class category-column. Adds the column to the game div.
  const column = document.createElement("div");
  column.classList.add("category-column");
  game.append(column);

  //Creates h3 element and uses the names in the categories object as it's content. Adds the h3 element to the column div.
  const h3 = document.createElement("h3");
  h3.innerHTML = categories.name;
  column.append(h3);

  //For each level in the levels array...
  levels.forEach((level) => {
    //Create a div element with the class of card. Add card to the column.
    const card = document.createElement("div");
    card.classList.add("card");
    column.append(card);

    //Create a paragraph element with the class of card-points. Add p element to the card div element.
    const cardPoints = document.createElement("p");
    cardPoints.classList.add("card-points");
    card.append(cardPoints);

    //If the level from the array assigned to card is "..." add "..." points as the text.
    if (level === "easy") {
      cardPoints.innerHTML = "100 Pts";
    } else if (level === "medium") {
      cardPoints.innerHTML = "200 Pts";
    } else if (level === "hard") {
      cardPoints.innerHTML = "300 Pts";
    }

    //Fetch api data. Fetch from url, then take the response and convert it to a JavaScript object using JSON.
    //Then take the data response and set the chosen values in the object as attributes on each card.
    //Then add a click event to the card that calls the flipCard function.
    fetch(
      `https://opentdb.com/api.php?amount=1&category=${categories.id}&difficulty=${level}&type=boolean`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        card.setAttribute("data-question", data.results[0].question);
        card.setAttribute("data-answer", data.results[0].correct_answer);
        //Below sets data-value attribute as the inner text in the card-points paragrah element. e.g 100 pts, 200 pts, 300 pts.
        card.setAttribute("data-value", cardPoints.innerHTML);
      })
      .then((done) => card.addEventListener("click", flipCard));
  });
}

//For each category in the categories array (film, music, television), call the addCategory function, passing each category object as a parameter.
//Creates 3 columns for film, music and television, with 3 cards each for 100 pts, 200pts and 300pts.
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
