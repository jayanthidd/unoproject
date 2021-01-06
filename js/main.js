
//------------------------------------------------------------------------------------------------------------------
//*MODAL GetPlayerNames*
//------------------------------------------------------------------------------------------------------------------


window.onload = function() {
    var reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        $('#playerNames').on('shown.bs.modal', function() { //this function puts the focus in the input-field. focus() alone wouldn't work here because of bootsrap-modal properties.
        $('#meineid').focus();
        })
        $('#playerNames').modal();
    }
}
function reloadP() {
    sessionStorage.setItem("reloading", "true");
    document.location.reload();
}


// Modalen Dialog öffnen um Namen einzugeben
document.getElementById('start').addEventListener('click', function(){
reloadP();
    $('#playerNames').on('shown.bs.modal', function() { //this function puts the focus in the input-field. focus() alone wouldn't work here because of bootsrap-modal properties.
        $('#meineid').focus();
      })
    $('#playerNames').modal();
});

// four unique and non empty player names are added
document.getElementById('playerNamesForm').addEventListener('submit', function(evt){
    let player =$('#meineid').val();
    if(players.indexOf(player) < 0){  //prüft wo Playername im Array enthalten ist, wenn -1 dann nicht im Array
        if (player==''){
            $('#name').text("Player Name cannot be blank. Try again");
        }  else{
        players.push(player);
        counter++;
        $('#name').text("Add another Player");
        document.getElementById('playercount').innerText = counter + "/4 players added";
        document.getElementById('welcome').innerText = player + " welcome to the game!";
        //The welcome modal for each player is briefly displayed and hidden
        $('#welcomebox').modal();   
        setTimeout(function() {     
            $('#welcomebox').modal('hide');
        }, 2000);
        setTimeout(function() {     
            document.getElementById('meineid').value = "";
        }, 2000);
    }
    } else {
        document.getElementById('name').innerText = "Player Name exists. Try another Name";
     }
    evt.preventDefault();
    $('#meineid').val("");
    if (players.length==4){
        document.getElementById('playercount').innerText = counter + "/4 players added";
        setTimeout(function(){      
            $('#playerNames').modal('hide');
        }, 1500);
        startGame();  //this sends the POST-Request to the API to start the game and gives the player-Array as a Parameter into the function
    }
    //refocus on the input field
    setTimeout(function (){
        $('#meineid').focus();
    }, 1000);
})

//------------------------------------------------------------------------------------------------------------------
//*GAME START API-Request*
//------------------------------------------------------------------------------------------------------------------

async function startGame(){
    let response = await fetch(gameapi + "start", {
        method: 'POST', 
        body: JSON.stringify(players), 
        headers: {
            'Content-type' : 'application/json; charset=UTF-8'
        }
    });
    
    if(response.ok){
        gamestartJson = await response.json();  //we wait to get the complete response as we want the body
    }
    else{
        alert("Request to the API failed. HTTP-Errorcode: " + response.status)  //in case the request fails we want to the the information displayd on the side not just in the console
    }

    //all information received from the api are stored as global variables for access and update throughout the rest of the game
    topcard = gamestartJson.TopCard.Color + gamestartJson.TopCard.Value;
    currentPlayedCard = topcard;

    if (gamestartJson.TopCard.Value===12){
        direction = -1;
    } else {
        direction = 1;
    }
    displayDirection();
    gameplayers = gamestartJson.Players;
    color = gamestartJson.TopCard.Color;
    value = gamestartJson.TopCard.Value;
    gameId = gamestartJson.Id;
    displayTopCard();
    setCurrentPlayer(gamestartJson.NextPlayer);
    distributeCards();
}


//---------------------------------------------------------------
//CLOSE CARDS OF PLAYERS
//----------------------------------------------------------------
// when a player skips a turn because the previous player played a plus 2 or plus 4 card, the cards will be updated by this method
async function updateCards(playerName){
    let i = findPlayerIndex(playerName);
    elementID = 'player' + i + 'hand';
    let playerHandElement = document.getElementById(elementID);
    removeCards(playerHandElement);

    let response = await fetch(gameapi + "GetCards/" + gameId +"?playerName=" + playerName, {
        method: 'GET'
        });
        let playerCards;
        if(response.ok){
            playerCards = await response.json();  //we wait to get the comnplete response as we want the body    
        } 
        
        gameplayers[i].Cards = playerCards.Cards;// saving down the card details for displaying it later
        gameplayers[i].Score = playerCards.Score;
        updatePlayerDisplay(i);

    turnCards(playerHandElement, i);
}

function CloseCards(playerName){

    let i = findPlayerIndex(playerName);
    let playerHandElement = document.getElementById('player' + i + 'hand');
    
    removeCards(playerHandElement);
    updatePlayerDisplay(i);
    turnCards(playerHandElement, i);
}

//---------------------------------------------------------------
//DISPLAY CARDS OF CURRENT PLAYER AND ADD CLICK EVENTS
//----------------------------------------------------------------

function displayCardsAndAddClickEvents(playerName){

    let i = findPlayerIndex(playerName);
    let playerHandElement = document.getElementById('player' + i + 'hand');

    removeCards(playerHandElement);
    updatePlayerDisplay(i);
    unostatus[i] = false;
    addCallUno(i);

    for (j=0; j < gameplayers[i].Cards.length; j++){
            let cardColor = gameplayers[i].Cards[j].Color;
            let cardValue = gameplayers[i].Cards[j].Value;
            let card = cardColor + cardValue;
            
            let li = document.createElement("li");
            li.addEventListener('click', async function() {
        
            // logic to validate the cards 
            if(cardColor === "Black" && cardValue === 13){
                if(currentPlayedCard === 'Black13' || currentPlayedCard === 'Black14'){
                        li.classList.add('shake-lr');
                        setTimeout(function() {     //The welcome-modal is just shown for the given time (millisec) and then hidden again
                            li.classList.remove('shake-lr');;
                        }, 1000);
                        return;
                }
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

            if (gameplayers[i].Cards.length == 2 && unostatus[i] != true){
                alert('You did not say Uno. Penalty one card!');
                drawCard();
                return;
            }
            
            if (cardValue===12){// if a reverse card is played, we keep track of the changed direction
                direction = direction * -1;
                $('#reverseModal').modal();   //this shows the modal with a "welcome..."-message for every player
                setTimeout(function() {     //The welcome-modal is just shown for the given time (millisec) and then hidden again
                $('#reverseModal').modal('hide');
                }, 1500);
                displayDirection()
            }
            //validate if card can be played (color or value) and add effect if it can't

            cColor = cardColor;
            cValue = cardValue;
            if(cardColor === "Black"){
                $('#colorModal').modal('show');
                return;
            } else {
                wildcolor = " ";//updating the color that can be played by next player
                color = cColor;
            }
            processCard();
            });
            let playercard=playerHandElement.appendChild(li);
            playercard.classList.add(card.toLowerCase());
    }
}  

//---------------------------------------------------------------
//PROCESS A CARD THAT THE PLAYER HAS PLAYED
//----------------------------------------------------------------
async function processCard(){
    
            //PUT request to the Game-API with the card that is being played, if it is a valid card.  Need to add code for checking wild, etc
            let response = await fetch(gameapi + "playCard/"+gameId + "?value="+ cValue + "&color=" +cColor + "&wildColor=" + wildcolor, {
            method: 'PUT'
            });
             console.log(response);   
            if(response.ok){
                playresult = await response.json();  //we wait to get the comnplete response as we want the body
                value = cValue;//updating the value that can be played by next player
                currentPlayedCard = cColor + cValue;
                replaceTopCard();
                removeCardfromHand(cValue, cColor, currentPlayer.Player);
                CloseCards(currentPlayer.Player);
                doWeHaveAWinner(playresult.Player)
                isItaPlusCard(cValue);                
                setCurrentPlayer(playresult.Player);
                displayCardsAndAddClickEvents(playresult.Player);
            }
            else{
                alert("Request to the API failed. HTTP-Errorcode: " + response.status)  //in case the request fails we want to the information displayd as an alert
            }
}







//Animation for clicking on stack



