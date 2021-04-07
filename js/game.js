// Flipped Card Vars
var FirstCard = null;
var FirstCardIMG = null;
var SecondCard = null;
var SecondCardIMG = null;
var FlippedCards = 0; //

var selectedDeck = "Funny"; // Default Deck
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

var sidebar = null;
var init = 1; 

//Some elements do not exist until the page has finished loading
window.onload = function() {
    sidebar = document.getElementById("sidebar");
    cardlist = document.getElementById("CardList");
    TotalTriesElement = document.getElementById("Tries");
    GameScoreElement = document.getElementById("Score");
    HighscoreListElement = document.getElementById("highscore-list");
    initCards();
    RebuildHighscores(); 
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
                cardImg.setAttribute("style", "background-image: url('Decks/" + selectedDeck + "/image" + i + ".jpg');background-size: 100% 100%;"); // use background img to avoid problems with extension IMAGUS
            var cardBG = document.createElement('div'); // add card background
                cardBG.className = "cardbg";
                cardBG.setAttribute("style", "background-image: url('Decks/" + selectedDeck + "/background" + ".jpg');background-size: 100% 100%;"); // use background img to avoid problems with extension IMAGUS
            card.append(cardImg);
            card.append(cardBG);
            cardlist.appendChild(card);
        }
    }
    RandomizeCards();
}

function RandomizeCards(){
    // re-initiliaze game aka reset button is pressed
    FirstCard = null;
    SecondCard = null;
    FlippedCards = 0;
    TotalTries = 0;
    TotalTriesElement.innerHTML = "Tries: " + TotalTries;
    FailedTries = 0;
    ScoreMult = 1;
    GameScore = 0;
    GameScoreElement.innerHTML = "Score: " + GameScore;
    TotalMatches = 0;
    State = true;

    //randomizes cards
    var nodes = cardlist.childNodes, i = 0;
    nodes = Array.prototype.slice.call(nodes).sort(function(a, b){return 0.5 - Math.random()});
    
    while(i < nodes.length) {
    cardlist.appendChild(nodes[i]);
        var x = document.getElementById("CardList").lastElementChild;
        x.classList.remove('flip'); // remove flip class, used when user resets game and not on initilization of the game
        x.style.pointerEvents = 'auto';
       ++i;
    }
}

function changeDeck( deckname ){
    cardlist.innerHTML = "";
    this.selectedDeck = deckname;
    initCards();
    // toggleSidemenu(); // maybe close when on phone only or find a different solution like present a button
}

function DisplayCard(element){
    if(State == true){
            if (FlippedCards == 0) {
                FirstCard = document.getElementById(element.id)
                FlippedCards++
                TotalTries++
                TotalTriesElement.innerHTML = "Tries: " + TotalTries;
                FirstCard.classList.add('flip');
                document.getElementById(FirstCard.id).style.pointerEvents = 'none';
                
            } else if (FlippedCards == 1) {
                SecondCard = document.getElementById(element.id)
                SecondCard.classList.add('flip');
                FindMatch(FirstCard,SecondCard)
        }
    }
}


function FindMatch(FirstCard,SecondCard){
    if(document.getElementById(FirstCard.id).getAttribute("data-value") == document.getElementById(SecondCard.id).getAttribute("data-value")){
       //change background & disable click on element
        document.getElementById(SecondCard.id).style.pointerEvents = 'none';
        document.getElementById(FirstCard.id).style.pointerEvents = 'none';
        //clear turn values
        SecondCard = null;
        FirstCard = null;
        FlippedCards = 0;
        TotalMatches++;
        GameScore = Math.round(GameScore + (100 * ScoreMult));
        GameScoreElement.innerHTML = "Score:" + GameScore;
        if( TotalMatches == 10){
            sleep(500).then(() => {
                WinGame();                   
            });
        }
    }
    else{
        sleep(800).then(() => {
        ResetCards(FirstCard,SecondCard);
        FlippedCards = 0;
        State = true;
        });
    }
}

function ResetCards(FirstCard,SecondCard){
    FirstCard.classList.remove('flip');
    SecondCard.classList.remove('flip');
    //prevent bug clicking same card again
    document.getElementById(FirstCard.id).style.pointerEvents = 'auto';

    SecondCard = null;
    FirstCard = null;
    FailedTries++
    if(FailedTries >= 5){
        if(ScoreMult > 0.5){
            ScoreMult = ScoreMult - 0.1;
        }else if (ScoreMult > 0.1){
            ScoreMult = ScoreMult - 0.05;
        }
    }
}

function sleep(time){
    State = false
    return new Promise((resolve) => setTimeout(resolve, time));
}

function buildHighscores(){
    
    var nodes = highscoreList, i = 0;
    
    while(i < nodes.length) {
        HighscoreListElement.appendChild(nodes[i]);
        //isws einai perito na to kanw kol giati to highscore table de tha ginete rebuild otan patiete reset button, ara one time on load
        //maybe an thelw na allazei dunamika o pinakas an briskete neo highscore meta apo game
        var y = document.getElementById("highscorelist").lastElementChild
            y.style.fontWeight = "normal";
            ++i;
    }
    var x = document.getElementById("highscorelist").firstElementChild;
    x.style.fontWeight = "bold";
}

function WinGame(){
    //check gia an benei highscore kai gia cancel click
    var PlayerName = prompt("You win! What's your name ?");
    highscoreList.push({GameScore,PlayerName});
    // highscoreList.sort(function(a,b){return a.GameScore < b.GameScore});
    //highscoreList.splice(4); 
    //nomizw thelei check gia na vlepei an uparxei eidh, allios kanei reset sto refresh
    localStorage.setItem('highscoresList', JSON.stringify(highscoreList))
    RebuildHighscores();
}

function RebuildHighscores(){
    HighscoreListElement.innerHTML = ""; // Clears Highscore list
    //kai meta rebuild olo to list
    //HighScores = JSON.parse(localStorage.getItem('highscoresList')) || [];
    //aallakse se var apo const prin to kleisw
    if(init == 1){ 
        var HighScores = JSON.parse(localStorage.getItem('highscoresList')) || [];
        HighScores.map(HighScore => {
            highscoreList.push(HighScore)
        })
        init = 0;
    }

    highscoreList.sort(function(a,b){return a.GameScore - b.GameScore});
    highscoreList.reverse(); 
    highscoreList.splice(4); 

    for(var i = 0 ; i < highscoreList.length; i++){
        var HighscoreNode = document.createElement("Div");
        var HighscoreTxt = document.createTextNode(highscoreList[i].PlayerName + " - " + highscoreList[i].GameScore);
        HighscoreNode.appendChild(HighscoreTxt);
        HighscoreListElement.appendChild(HighscoreNode);
    }
    
    //var HighScores = JSON.parse(localStorage.getItem('highscoresList')) || [];
   // HighScores.map(HighScore => {
   //     var HighscoreNode = document.createElement("Div");
   //     var HighscoreTxt = document.createTextNode(HighScore.PlayerName + " - " + HighScore.GameScore);
   //     //--------
   //     highscoreList.push(HighScore)
   //     highscoreList.sort(function(a,b){return a.GameScore < b.GameScore});
   //     highscoreList.splice(4); 
   //     
   //     HighscoreNode.appendChild(HighscoreTxt);
   //     HighscoreListElement.appendChild(HighscoreNode);
   // })
    //bgazei kapoio error otan kaleite prwth fora h rebuildhighscores giati einai adio to table, fix it later
    if(highscoreList.length >=1 ){
        var x = document.getElementById("highscore-list").firstElementChild;
        x.style.fontWeight = "bold";
        x.style.fontSize = "27px";
    }
}

function toggleSidemenu(){
    if(sidebar.style.width == "250px"){
        sidebar.style.width = "0px";
    }
    else
    {
        sidebar.style.width = "250px";
    }
}

    
