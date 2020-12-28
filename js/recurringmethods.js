//---------------------------------------------------------------
//RECURRING FUNCTIONS
//----------------------------------------------------------------
  
//this function set's the global variable for the current player and
function setCurrentPlayer(next){
    currentPlayer = gameplayers[findPlayerIndex(next)];
}

function findPlayerIndex(name){
    for(i=0; i<4; i++){
        if (gameplayers[i].Player === name){
            return i;
        }
    }
}

function findNextPlayer(name){
    let currentPlayerindex = findPlayerIndex(name);
    let nextPlayerIndex = currentPlayerindex + direction;
    if (nextPlayerIndex===4){
        return players[0];
    } 
    if (nextPlayerIndex===-1){
        return players[3];
    }
    return players[nextPlayerIndex];
}

function isItaPlusCard(cardValue){
    if (cardValue === 13 || cardValue === 10) {
        let affectedPlayer = findNextPlayer(currentPlayer.Player);
        updateCards(affectedPlayer);
    }
}

//to highlight the current player's field
function highlightCurrentPlayer(index){
    let currentElementId = 'player' + index + 'field';
    document.getElementById(currentElementId).classList.add('activePlayer');
} 

function unHighlightPreviousPlayer() {
    let currentElementId = 'player' + findPlayerIndex(currentPlayer.Player) +'field';
    document.getElementById(currentElementId).classList.remove('activePlayer');
}
function addCardtoHand(playerName, drawnCard) {
    let indexOfPlayer = findPlayerIndex(playerName);
    gameplayers[indexOfPlayer].Cards.push(drawnCard);
    gameplayers[indexOfPlayer].Score += drawnCard.Score;
}

function removeCardfromHand(cardValue, cardColor, player){
    let index = findPlayerIndex(player);
    for (i = 0; i < gameplayers[index].Cards.length; i ++){
        if (gameplayers[index].Cards[i].Color === cardColor && gameplayers[index].Cards[i].Value === cardValue){
            gameplayers[index].Score -= gameplayers[index].Cards[i].Score;
            gameplayers[index].Cards.splice(i,1);
        }
    }
}

function displayCurrentColor(){
    let topcardOnStack = document.getElementById('topcard');
      topcardOnStack.classList.remove('redshadow');
      topcardOnStack.classList.remove('blueshadow');
      topcardOnStack.classList.remove('greenshadow');
      topcardOnStack.classList.remove('yellowshadow');
      topcardOnStack.classList.remove('blackshadow');
      topcardOnStack.classList.add(color.toLowerCase()  + 'shadow');
  }


  function displayDirection(){
    let directionelement = document.getElementById("direction");
    if (direction > 0){
        directionelement.classList.add('directionclock');
    } else {
        directionelement.classList.add('directionanti');
    }
}

function addCallUno(i){
    if (gameplayers[i].Cards.length == 2){
        let btn = document.createElement('Button');
        btn.innerHTML = 'Call Uno';
        btn.id = 'player' + i + 'uno';
        document.getElementById('player' + i + 'Name').appendChild(btn);
        btn.addEventListener('click', function(){
            alert(gameplayers[i].Player + ' says Uno!');
            unostatus[i] = true;
        })
    }
}