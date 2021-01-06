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

function getPlayerNames(){
    $('#playerNames').on('shown.bs.modal', function() { //this function puts the focus in the input-field. focus() alone wouldn't work here because of bootsrap-modal properties.
        $('#meineid').focus();
        })
        $('#playerNames').modal();
}

function distributeCards() {
    for (i = 0; i < gameplayers.length; i++){
        if (gameplayers[i].Player===currentPlayer.Player){   
            displayCardsAndAddClickEvents(gameplayers[i].Player);
        } else {
            CloseCards(gameplayers[i].Player);
        }
    }
}

function removeCards(playerHandElement){
    while(playerHandElement.firstChild){
        playerHandElement.removeChild(playerHandElement.firstChild);
    }
}

function turnCards(playerHandElement, i) {
    let j;
    for (j=0; j < gameplayers[i].Cards.length; j++){
        let li = document.createElement("li");
        let playercard=playerHandElement.appendChild(li);
        playercard.classList.add('backside');
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

function doWeHaveAWinner(player){
    if(player === currentPlayer.Player){ 
        updateWinner();
    }
}

function updateWinner() {
    let winnerScore = 0;
    for(i=0; i < 4; i++){
        winnerScore += gameplayers[i].Score;
    }
    let winnerName = currentPlayer.Player;
    winnerNameID = 'winner';
    document.getElementById(winnerNameID).innerHTML = winnerName + ' has won the game with  ' + winnerScore + ' points!';
    $('#winnerModal').modal('show');
    console.log(playresult.Player +  ' has won the game with ' + winnerScore + ' points! Congratulations');
    return;
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
        directionelement.classList.remove('directionanti');
        directionelement.classList.remove('rotateanti');
        directionelement.classList.add('directionclock');
        directionelement.classList.add('rotateclock');
    } else {
        directionelement.classList.remove('directionclock');
        directionelement.classList.remove('rotateclock');
        directionelement.classList.add('directionanti');
        directionelement.classList.add('rotateanti');
    }
}

function addCallUno(i){
    if (gameplayers[i].Cards.length == 2){
        let btn = document.createElement('Button');
        btn.innerHTML = 'Uno';
        btn.id = 'player' + i + 'uno';
        btn.className = 'unobutton';
        document.getElementById('player' + i + 'Name').appendChild(btn);
        // btn.addEventListener('click', function(){
        //     alert(gameplayers[i].Player + ' says Uno!');
        //     unostatus[i] = true;
        // })
        btn.onclick = function() {
            $('#unoModal').modal('show');
            setTimeout(function() {     //The welcome-modal is just shown for the given time (millisec) and then hidden again
                $('#unoModal').modal('hide');
            }, 1000);
            unostatus[i] = true;
        }   
    }
}

function updatePlayerDisplay(index){
    elementID = 'player' + index + 'Name';
    let playerNameElement = document.getElementById(elementID);
    playerNameElement.innerHTML = gameplayers[index].Player + " : " + gameplayers[index].Score;
}

async function validateCard(li, cardColor, cardValue){
    if(cardColor === "Black" && cardValue === 13){
        for (j=0; j < gameplayers[i].Cards.length; j++){
            if (gameplayers[i].Cards[j].Color === color){
                li.classList.add('shake-lr');
                setTimeout(function() {     //The welcome-modal is just shown for the given time (millisec) and then hidden again
                    li.classList.remove('shake-lr');;
                }, 1000);
                return;
            }
        }
    }
    if(cardColor != color  && cardColor != "Black" && cardValue != value){
        li.classList.add('shake-lr');
        setTimeout(function() {     //The shake-class is removed after 1 sec so it can be added again to the class if you click it again
            li.classList.remove('shake-lr');
        }, 1000);
        return;
    }
}