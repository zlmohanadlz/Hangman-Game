// generate letters (this can stay outside)
const letter = "abcdefghijklmnopqrstuvwxyz";
let letters = Array.from(letter);
let letterContainer = document.querySelector(".letters");

letters.forEach((letter) => {
    let span = document.createElement("span");
    span.append(letter);
    span.className = "letter-box";
    letterContainer.append(span);
});

// object of words with all categories
async function getWordsData() {
    try {
        let data = await fetch("words.json");
        let words = await data.json();
        console.log(words);
        return words;
    } catch (reason) {
        console.log(reason);
    }
}

// main async function to initialize the game
async function initGame() {
    // fetch words
    let words = await getWordsData();

    // choose random category
    let keys = Object.keys(words);
    let randomCategoryIndex = Math.floor(Math.random() * keys.length);
    let randomCategory = keys[randomCategoryIndex];

    // choose random word in category
    let wordsInCategory = words[randomCategory];
    let randomWordIndex = Math.floor(Math.random() * wordsInCategory.length);
    let randomWord = wordsInCategory[randomWordIndex];

    // console.log(randomWord, randomCategory); for showing just

    // show category
    let category = document.querySelector(".category span");
    category.textContent = randomCategory;

    let success = 0; // if the player has succeeded in guessing the word
    // generate guess word letters
    let guess = document.querySelector(".letters-guess");
    let lettersArr = Array.from(randomWord);

    lettersArr.forEach((letter) => {
        let span = document.createElement("span");
        letter === " "
            ? ((span.classList = "has-space"), success++)
            : (span.className = "");
        guess.append(span);
    });

    // handle clicked letters
    let allLettersSpan = document.querySelectorAll(".letters-guess span");
    let wrongAttempts = 0;
    let theDraw = document.querySelector(".hangman-draw");

    document.addEventListener("click", function (e) {
        if (e.target.className === "letter-box") {
            e.target.classList.add("clicked");
            let clickedLetter = e.target.textContent.toLowerCase();
            let statusOfClick = false;

            lettersArr.forEach((wordLetter, index) => {
                if (clickedLetter == wordLetter.toLowerCase()) {
                    statusOfClick = true;
                    allLettersSpan[index].textContent = wordLetter;
                    success++;
                    if (success === lettersArr.length) {
                        endGameSuccess(wrongAttempts);
                        letterContainer.classList.add("finished");
                    }
                }
            });

            if (!statusOfClick) {
                wrongAttempts++;
                theDraw.classList.add(`wrong-${wrongAttempts}`);
                document.getElementById("error").play();
                if (wrongAttempts === 8) {
                    endGameFail(randomWord);
                    letterContainer.classList.add("finished");
                }
            } else {
                document.getElementById("success").play();
            }
        }
    });
}

// call the init function
initGame();

// endGame function
function endGameFail(word) {
    let div = document.createElement("div");
    div.append(`Game Over. The Word Is: ${word}`);
    div.classList.add("popup");
    document.body.append(div);
}

function endGameSuccess(wrongAttempts) {
    let div = document.createElement("div");
    div.append(
        `Good Job. You've Guessed Right And You had Wrong Guess For ${wrongAttempts} Times`
    );
    div.classList.add("popup");
    document.body.append(div);
}
