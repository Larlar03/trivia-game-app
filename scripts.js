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
    //Then add a click event to the card that calls the showQuestion function.
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
      .then((done) => card.addEventListener("click", showQuestion));
  });
}

//For each category in the categories array (film, music, television), call the addCategory function, passing each category object as a parameter.
//Creates 3 columns for film, music and television, with 3 cards each for 100 pts, 200pts and 300pts.
categories.forEach((category) => addCategory(category));

//Show Question function. Creates elements inside card to display question and buttons to answers.
//Add question from api data to each card when the cards are clicked.
function showQuestion() {
  //On this card make inner text blank - removes the card points text.
  this.innerHTML = "";

  //Creates a div to display question text.
  const questionText = document.createElement("div");

  //Creates button with true-button class and "True" text. Repeat for false button.
  const trueButton = document.createElement("button");
  trueButton.classList.add("true-button");
  trueButton.innerHTML = "True";
  const falseButton = document.createElement("button");
  falseButton.classList.add("false-button");
  falseButton.innerHTML = "False";

  //Adds click event to buttons that calls a showResult function.
  trueButton.addEventListener("click", showResult);
  falseButton.addEventListener("click", showResult);

  //Changes the text in the questionText div to the data-question attribute assigned to this card. The question data from the api.
  questionText.innerHTML = this.getAttribute("data-question");

  //Adds the 3 elements to this card.
  this.append(questionText, trueButton, falseButton);

  //Selects all elements with the class "card" and creates an array with them. Assigns the array to a "allCards" variable.
  //For each card in the allCards array, remove the click event listeners and this (showQuestion) function.
  //Stops user from being able to click other cards before answering question on current card.
  const allCards = Array.from(document.querySelectorAll(".card"));

  allCards.forEach((card) => card.removeEventListener("click", showQuestion));
}

//Show Result Function
function showResult() {
  //Adds all card divs to an array and then re-adds the event listener that was removed before you clicked the true or false button to answer the question.
  //Now user can select a different card to play.
  const allCards = Array.from(document.querySelectorAll(".card"));
  allCards.forEach((card) => card.addEventListener("click", showQuestion));

  //Selects the parent element of this (the card that the button is in), and adds it to a variable.
  const cardOfButton = this.parentElement;

  //If value in the data-answer attribute ("True" or "False") of this card is equal to the text in this button ("True" or "False").
  //The score variable value is now equal to it's current value + the data-value of the current card. Score + 100, 200 or 300.
  //Add the value of the score variable to the inner text of the score display div.
  if (cardOfButton.getAttribute("data-answer") === this.innerHTML) {
    score = score + parseInt(cardOfButton.getAttribute("data-value"));
    scoreDisplay.innerHTML = score;

    //Add a class of correct-answer to this card - to create different styling for the correct answers.
    cardOfButton.classList.add("correct-answer");

    //After 1 second, while there is a first child element in the card, remove the last child element, repeat until there is no first child element (no child elements at all).
    //Then changed the inner text of the card to the value in the "data-value" attribute (100 pts, 200pts or 300pts).
    setTimeout(() => {
      while (cardOfButton.firstChild) {
        cardOfButton.removeChild(cardOfButton.lastChild);
      }
      cardOfButton.innerHTML = cardOfButton.getAttribute("data-value");
    }, 1000);
  } else {
    //Else the answer isn't correct so add a wrong-answer class to the card to chnage the styling.
    cardOfButton.classList.add("wrong-answer");
    //Then remove all child elements in card and change the inner text to 0, for 0 points.
    setTimeout(() => {
      while (cardOfButton.firstChild) {
        cardOfButton.removeChild(cardOfButton.lastChild);
      }
      cardOfButton.innerHTML = 0;
    }, 1000);
  }

  //Remove the click event listener that shows the question, so that the user can't click the card again.
  cardOfButton.removeEventListener("click", showQuestion);

  //Call Max Points Function after answering each question.
  maxPoints();
}

//Max Points function. If user gets the maximum points (1800) a gif and message is displayed.
function maxPoints() {
  setTimeout(() => {
    if (score === 1800) {
      game.innerHTML = `<p id="max-points-message">You got every question right!</p> 
      <img id="max-points-img" src="max-points.gif" alt="winning" />`;
    }
  }, 500);
}
