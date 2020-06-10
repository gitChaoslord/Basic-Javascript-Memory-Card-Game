// Flipped Card Vars
var FirstCard = null;
var FirstCardIMG = null;
var SecondCard = null;
var SecondCardIMG = null;
var FlippedCards = 0;
// Gamestate, true = play , false = wait
var State=true;
var cardlist = null;
//counter for win condition
var TotalMatches = 0;
//sound Vars
//var ErrorSound = new Audio('error.mp3');
// Score Vars 
var HighscoreListElement = null;
var highscoreList = [];
var TotalTries = 0;
var FailedTries = 0;
var ScoreMult = 1;
var GameScore = 0;
var TotalTriesElement = null;
var GameScoreElement = null;

var init = 1;
//const testvar = JSON.parse(localStorage.getItem('highscoresList')) || [];

//kapoia elements den uparxoun mexri na kanei 'complete' load i selida kai ta functions de briskane ta objects
window.onload = function() {
    cardlist = document.getElementById("CardList");
    TotalTriesElement = document.getElementById("Tries");
    GameScoreElement = document.getElementById("Score");
    HighscoreListElement = document.getElementById("highscore-list");
    RandomizeCards();
    RebuildHighscores();
}
function RandomizeCards(){
    // re-initiliaze game aka reset button is pressed
    FirstCard = null;
    SecondCard = null;
    FlippedCards = 0;
    TotalTries = 0;
    TotalTriesElement.innerHTML = "Tries : " + TotalTries;
    FailedTries = 0;
    ScoreMult = 1;
    GameScore = 0;
    GameScoreElement.innerHTML = "Score : " + GameScore;
    TotalMatches = 0;
    State = true;

    var nodes = cardlist.childNodes, i = 0;
    nodes = Array.prototype.slice.call(nodes).sort(function(a, b){return 0.5 - Math.random()});
    
    while(i < nodes.length) {
    cardlist.appendChild(nodes[i]);
        var x = document.getElementById("CardList").lastElementChild;
        x.style.borderColor = "burlywood";
        x.style.pointerEvents = 'auto';
        x.firstElementChild.style.opacity = "0";
       ++i;
    }
    
}
function DisplayCard(element){
    if(State == true){
            if (FlippedCards == 0) {
                
                FirstCard = document.getElementById(element.id)
                //var test = document.getElementById(FirstCard.id).getAttribute("data-value");
                //console.log(test)
                FirstCard.style.borderColor = "blue"
                FirstCardIMG = document.getElementById(element.id).firstElementChild
                FirstCardIMG.style.opacity = "1"
                FlippedCards++
                TotalTries++
                TotalTriesElement.innerHTML = "Tries : " + TotalTries;
                //prevent bug clicking same card again
                document.getElementById(FirstCard.id).style.pointerEvents = 'none';
                
            } else if (FlippedCards == 1) {
                SecondCard = document.getElementById(element.id)
                SecondCard.style.borderColor = "blue"
                SecondCardIMG = document.getElementById(element.id).firstElementChild
                SecondCardIMG.style.opacity = "1"      
                FindMatch(FirstCard,SecondCard)
                //sleep(1000).then(() => {
                //ResetCards(FirstCard,SecondCard)
                //FlippedCards = 0
                //State = true
        // });
        }
    }
}
function FindMatch(FirstCard,SecondCard){
    if(document.getElementById(FirstCard.id).getAttribute("data-value") == document.getElementById(SecondCard.id).getAttribute("data-value")){
       //change background & disable click on element
        SecondCard.style.borderColor = "Green";
        document.getElementById(SecondCard.id).style.pointerEvents = 'none';
        FirstCard.style.borderColor = "Green";
        document.getElementById(FirstCard.id).style.pointerEvents = 'none';
        //clear turn values
        SecondCard = null;
        FirstCard = null;
        FlippedCards = 0;
        TotalMatches++;
        GameScore = Math.round(GameScore + (100 * ScoreMult));
        GameScoreElement.innerHTML = "Score :" + GameScore;
        //console.log(TotalMatches)
        if( TotalMatches == 10){
            sleep(500).then(() => {
                WinGame();     
                //check tou playerName me to highscore list array names gia na dwsei alert h prompt se periptwsi pou 'benei sta
                // top 10 highscores
                
            });
        }
    }
    else{
        //alternative solution to line 137

        //Play error Sounds
        //ErrorSound.currentTime = 0; // On each click, rewind clip to start
        //ErrorSound.play();

        sleep(800).then(() => {
        ResetCards(FirstCard,SecondCard);
        FlippedCards = 0;
        State = true;
        });
    }
}
function ResetCards(FirstCard,SecondCard ){
    //thelei cut to sound giati exei 1 sec keno
    //ErrorSound.play();
    SecondCard.style.borderColor = "burlywood";
    FirstCard.style.borderColor = "burlywood";
    FirstCardIMG.style.opacity = "0"
    SecondCardIMG.style.opacity = "0"
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
    //var nodes = HighscoreListElement.childNodes, i = 0;
    //nodes = Array.prototype.slice.call(nodes).sort(function(a, b){});;
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
       // var initial_read = 0
       // if(initial_read = 0){
       //     var dropa = JSON.parse(localStorage.getItem('highscoresList')) || [];
       //     const skata = dropa.split('');
       //     dropa.push(highscoreList[highscoreList.length-1])
        //error
        //dropa.push(highscoreList[highscoreList.length-1])
        //dropa.splice(4);
        //localStorage.setItem('highscoresList', JSON.stringify(dropa))
    //}  
    RebuildHighscores();
    
    
}
function RebuildHighscores(){
    //kanei clear olo to list
    HighscoreListElement.innerHTML = "";
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







//var HighscoreNode = document.createElement("Div");
    //var HighscoreTxt = document.createTextNode(highscoreList[(highscoreList.length-1)].PlayerName + " - " + highscoreList[(highscoreList.length-1)].GameScore);
    //HighscoreNode.appendChild(HighscoreTxt);
    //HighscoreListElement.appendChild(HighscoreNode);