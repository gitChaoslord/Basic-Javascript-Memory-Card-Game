// Flipped Card Vars
var FirstCard = null;
var FirstCardIMG = null;
var SecondCard = null;
var SecondCardIMG = null;
var FlippedCards = 0; //

var selectedDeck = "funny"; // Default Deck
var State = true; // Gamestate, true = pick a card, false = wait 
var cardlist = null;  // Contains the parent element of all cards

var TotalMatches = 0; // Counter for win condition

// Score Variables
var HighscoreListElement = null;

var highscoreList = [];
var TotalTries = 0;
var FailedTries = 0;
var ScoreMult = 1;
var GameScore = 0;

var TotalTriesElement = null;
var GameScoreElement = null;

var init = 1;

let isMobile = false;
var sidebar = null;
var navbar = null;

window.onload = function () {
    cardlist = document.getElementById("CardList");
    TotalTriesElement = document.getElementById("Tries");
    GameScoreElement = document.getElementById("Score");
    HighscoreListElement = document.getElementById("highscore-list");
    sidebar = document.getElementById("sidebar-left");
    navbar = document.getElementById("navbar");

    initCards();
    RebuildHighscores();


    window.addEventListener('resize', isMobileObs);
    this.isMobile = window.innerWidth <= 991.98;
    toggleUiElements();
}

function toggleUiElements() {
    if (this.isMobile) {
        this.sidebar.classList.add("d-none");
        this.navbar.classList.remove("d-none");
    }
    else {
        this.sidebar.classList.remove("d-none");
        this.navbar.classList.add("d-none");
    }
}



function isMobileObs() {
    this.isMobile = window.innerWidth <= 991.98;
    toggleUiElements();
}

function initCards() {
    for (var i = 1; i <= 10; i++) { // generate 10 pairs
        for (var j = 1; j <= 2; j++) { // generate 2 cards per pair
            var card = document.createElement('div'); // create Card
            card.id = i + "" + j;
            card.setAttribute("onclick", "DisplayCard(this)");
            card.className = "gamecard";
            card.setAttribute("data-value", i);
            var cardImg = document.createElement('div'); // add card image
            cardImg.className = "cardimg";
            cardImg.setAttribute("style", "background-image: url('assets/decks/" + selectedDeck + "/image" + i + ".jpg');background-size: 100% 100%;"); // use background img to avoid problems with extension IMAGUS
            var cardBG = document.createElement('div'); // add card background
            cardBG.className = "cardbg";
            cardBG.setAttribute("style", "background-image: url('assets/decks/" + selectedDeck + "/background" + ".jpg');background-size: 100% 100%;"); // use background img to avoid problems with extension IMAGUS
            card.append(cardImg);
            card.append(cardBG);
            cardlist.appendChild(card);
        }
    }
    RandomizeCards();
}

function RandomizeCards() {
    // re-initiliaze game aka reset button is pressed
    FirstCard = null;
    SecondCard = null;
    FlippedCards = 0;
    TotalTries = 0;
    TotalTriesElement.innerHTML = TotalTries;
    FailedTries = 0;
    ScoreMult = 1;
    GameScore = 0;
    GameScoreElement.innerHTML = GameScore;
    TotalMatches = 0;
    State = true;

    //randomizes cards
    var nodes = cardlist.childNodes, i = 0;
    nodes = Array.prototype.slice.call(nodes).sort(function (a, b) { return 0.5 - Math.random() });

    while (i < nodes.length) {
        cardlist.appendChild(nodes[i]);
        var x = document.getElementById("CardList").lastElementChild;
        x.classList.remove('flip'); // remove flip class, used when user resets game and not on initilization of the game
        x.style.pointerEvents = 'auto';
        ++i;
    }
}

function changeDeck(deckname) {
    cardlist.innerHTML = "";
    this.selectedDeck = deckname;
    initCards();
}

function DisplayCard(element) {
    if (State == true) {
        if (FlippedCards == 0) {
            FirstCard = document.getElementById(element.id)
            FlippedCards++
            TotalTries++
            TotalTriesElement.innerHTML = TotalTries;
            FirstCard.classList.add('flip');
            document.getElementById(FirstCard.id).style.pointerEvents = 'none';

        } else if (FlippedCards == 1) {
            SecondCard = document.getElementById(element.id)
            SecondCard.classList.add('flip');
            FindMatch(FirstCard, SecondCard)
        }
    }
}


function FindMatch(FirstCard, SecondCard) {
    if (document.getElementById(FirstCard.id).getAttribute("data-value") == document.getElementById(SecondCard.id).getAttribute("data-value")) {
        //change background & disable click on element
        document.getElementById(SecondCard.id).style.pointerEvents = 'none';
        document.getElementById(FirstCard.id).style.pointerEvents = 'none';
        //clear turn values
        SecondCard = null;
        FirstCard = null;
        FlippedCards = 0;
        TotalMatches++;
        GameScore = Math.round(GameScore + (100 * ScoreMult));
        GameScoreElement.innerHTML = GameScore;
        if (TotalMatches == 10) {
            sleep(500).then(() => {
                WinGame();
            });
        }
    }
    else {
        sleep(800).then(() => {
            ResetCards(FirstCard, SecondCard);
            FlippedCards = 0;
            State = true;
        });
    }
}

function ResetCards(FirstCard, SecondCard) {
    FirstCard.classList.remove('flip');
    SecondCard.classList.remove('flip');
    //prevent bug clicking same card again
    document.getElementById(FirstCard.id).style.pointerEvents = 'auto';

    SecondCard = null;
    FirstCard = null;
    FailedTries++
    if (FailedTries >= 5) {
        if (ScoreMult > 0.5) {
            ScoreMult = ScoreMult - 0.1;
        } else if (ScoreMult > 0.1) {
            ScoreMult = ScoreMult - 0.05;
        }
    }
}

function sleep(time) {
    State = false
    return new Promise((resolve) => setTimeout(resolve, time));
}

function buildHighscores() {

    var nodes = highscoreList, i = 0;

    while (i < nodes.length) {
        HighscoreListElement.appendChild(nodes[i]);
        // TODO: isws einai perito na to kanw kol giati to highscore table de tha ginete rebuild otan patiete reset button, ara one time on load
        //maybe an thelw na allazei dunamika o pinakas an briskete neo highscore meta apo game
        var y = document.getElementById("highscorelist").lastElementChild
        y.style.fontWeight = "normal";
        ++i;
    }
    var x = document.getElementById("highscorelist").firstElementChild;
    x.style.fontWeight = "bold";
}

function WinGame() {
    // TODO: make a modal for information input
    var PlayerName = prompt("You win! What's your name ?");
    highscoreList.push({ GameScore, PlayerName });
    localStorage.setItem('highscoresList', JSON.stringify(highscoreList))
    RebuildHighscores();
}

function RebuildHighscores() {
    HighscoreListElement.innerHTML = ""; // Clears Highscore list

    if (init == 1) {
        var HighScores = JSON.parse(localStorage.getItem('highscoresList')) || [];
        HighScores.map(HighScore => {
            highscoreList.push(HighScore)
        })
        init = 0;
    }

    highscoreList.sort(function (a, b) { return a.GameScore - b.GameScore });
    highscoreList.reverse();
    highscoreList.splice(4);

    for (var i = 0; i < highscoreList.length; i++) {
        var HighscoreNode = document.createElement("li");

        var HighscoreTxt = document.createTextNode(highscoreList[i].PlayerName + " - " + highscoreList[i].GameScore);
        HighscoreNode.appendChild(HighscoreTxt);
        HighscoreNode.className = 'list-group-item';
        HighscoreListElement.appendChild(HighscoreNode);
    }

}

