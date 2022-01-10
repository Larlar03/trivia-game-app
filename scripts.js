const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");

const music = 12;
const levels = ["easy", "medium", "hard"];

//Creates a column div and add it to the game div html.
function addCategory() {
  const column = document.createElement("div");
  column.classList.add("category-column");
  column.innerHTML = "This is a column";
  game.append(column);

  //For each level in the levels array, add it to the url and then get the response, then log the data from the response.
  levels.forEach((level) => {
    const card = document.createElement("div");
    card.classList.add("card");
    column.append(card);
    card.innerHTML = "This is the card";
    fetch(
      `https://opentdb.com/api.php?amount=1&category=12&difficulty=${level}&type=boolean`
    )
      .then((response) => response.json())
      .then((data) => console.log(data));
  });
}

addCategory();
