//------------------------------------------------------------------------------------------------------------------
//*UTILITY FUNCTIONS *
//------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------
//*GLOBAL VARIABLES*
//------------------------------------------------------------------------------------------------------------------

let players=[];
let unostatus=[false, false, false, false];
let topcard;
let gameplayers;// list of all player objects
let currentPlayer;//current player object
let gameId;// ID of the game returned by the API. This is required tocommunicate with the API
let color; // color that is currently being played
let value; // card-value that is currently being played
let currentPlayedCard; // card that has been clicked by the last player to be played
let direction;// to track the direction of the game
let wildcolor;
let cColor;
let cValue;
//------------------------------------------------------------------------------------------------------------------
//*MODAL GetPlayerNames*
//------------------------------------------------------------------------------------------------------------------


window.onload = function() {
    var reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        startGame();
    }
}
function reloadP() {
    sessionStorage.setItem("reloading", "true");
    document.location.reload();
}

// Modalen Dialog öffnen um Namen einzugeben
document.getElementById('start').addEventListener('click', function(){

    reloadP();
    document.getElementById('topcard').className ='';
    startGame();
    //Temporarily blocking out code to make it easy to test
    $('#playerNames').on('shown.bs.modal', function() { //this function puts the focus in the input-field. focus() alone wouldn't work here because of bootsrap-modal properties.
        $('#meineid').focus();
      })
    $('#playerNames').modal();
});

document.getElementById('playerNamesForm').addEventListener('submit', function(evt){
    
    let counter;
    let player = document.getElementById('meineid').value;
    if(players.indexOf(player) < 0){    //prüft wo Playername im Array enthalten ist, wenn -1 dann nicht im Array (Jay, this is so cool!)
        players.push(player);
        counter++;
        document.getElementById('name').innerText = "Add another Player";
        //document.getElementById('meineid').value = "";
        document.getElementById('playercount').innerText = counter + "/4 players added";
        console.log("added player. players :" + players.length);
        document.getElementById('welcome').innerText = player + " welcome to the game!";
        $('#welcomebox').modal();   //this shows the modal with a "welcome..."-message for every player
        setTimeout(function() {     //The welcome-modal is just shown for the given time (millisec) and then hidden again
            $('#welcomebox').modal('hide');
        }, 500);
        //$('#meineid').focus();  //focus alone doesn't work here to refocus, as the bootstrap modal has the focus -> want to find alternative solution
        setTimeout(function() {     //The welcome-modal is just shown for the given time (millisec) and then hidden again
            document.getElementById('meineid').value = "";
        }, 500);
    } else {
        document.getElementById('name').innerText = "Player Name exists. Try another Name";
        document.getElementById('meineid').value = "";
     }
    evt.preventDefault();
    document.getElementById('meineid').innerText = "";
    
    if (players.length==4){
        document.getElementById('playercount').innerText = counter + "/4 players added";
        setTimeout(function(){      //this delays the hiding of the modal for the given time (millisec), so the last status update messages can be read
            $('#playerNames').modal('hide');
        }, 500);
        startGame();  //this sends the POST-Request to the API to start the game and gives the player-Array as a Parameter into the function
    }
})

//------------------------------------------------------------------------------------------------------------------
//*GAME START API-Request*
//------------------------------------------------------------------------------------------------------------------

async function startGame(){

    //The API-documentation mentiones that you need to send the Playernames with the Start-Game-request
    //we added the playernames to the player-array ad the gamestart via the modal-input. These Strings from the array are added to the POST-Request end send in the Requestbody
    

    //request to the Game-API as POST from our API-URL
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/start", {
        method: 'POST', 
        body: JSON.stringify(players),    //we send the Array-content not binary but as text ('stringify') in the body
        headers: {
            'Content-type' : 'application/json; charset=UTF-8'
        }
    });
    console.log(response);  //this is just to check if we get the correct response, we first get the response-head

    if(response.ok){
        gamestartJson = await response.json();  //we wait to get the comnplete response as we want the body
        console.log(gamestartJson);     // check in the console whats in the body
    }
    else{
        alert("Request to the API failed. HTTP-Errorcode: " + response.status)  //in case the request fails we want to the the information displayd on the side not just in the console
    }

    //here we get the information about the topcard from the Json-Body. We want the Color and Value
    //We combine these values (e.g. "blue1", "yellow12", "black13",...) and save them as a variable
    topcard = gamestartJson.TopCard.Color + gamestartJson.TopCard.Value;
    currentPlayedCard = topcard;
    if (gamestartJson.TopCard.Value===12){
        direction = -1;
    } else {
        direction = 1;
    }
    displayDirection();
    //topcard = "blue1";    -->code for testing specific cards
    //we call this function and pass the topcard-String (collor+value) as a parameter into it, 
    //this will add the topcard we get from the API as a background-image to the topcard-div-element
    
    //gamestartJson response is used to create player objects to hold player names, their cards and their scores
    gameplayers = gamestartJson.Players;
    color = gamestartJson.TopCard.Color;
    value = gamestartJson.TopCard.Value;
    gameId = gamestartJson.Id;
    displayTopCard();
    //the next player is extracted from the gamestartJsonresponse
    setCurrentPlayer(gamestartJson.NextPlayer);

    //the json response received earlier has all information pertaining to cards of each player.  This is going to be 
    //on the screen by this method


    for (i = 0; i < gameplayers.length; i++){
        if (gameplayers[i].Player===currentPlayer.Player){   
            displayCardsAndAddClickEvents(gameplayers[i].Player);
        } else {
            CloseCards(gameplayers[i].Player);
        }
    }
}


//---------------------------------------------------------------
//CLOSE CARDS OF PLAYERS
//----------------------------------------------------------------
// when a player skips a turn because the previous player played a plus 2 or plus 4 card, the cards will be updated by this method
async function updateCards(playerName){

    elementID = 'player' + findPlayerIndex(playerName) + 'hand';
    let playerHandElement = document.getElementById(elementID);
    while(playerHandElement.firstChild){
        playerHandElement.removeChild(playerHandElement.firstChild);
    }
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/GetCards/" + gameId +"?playerName=" + playerName, {
        method: 'GET'
        });
        let playerCards;
        if(response.ok){
            playerCards = await response.json();  //we wait to get the comnplete response as we want the body    
        } 
        
        gameplayers[findPlayerIndex(playerName)].Cards = playerCards.Cards;// saving down the card details for displaying it later
        gameplayers[findPlayerIndex(playerName)].Score = playerCards.Score;
        updatePlayerDisplay(findPlayerIndex(playerName));

        for (j=0; j < playerCards.Cards.length; j++){
            //The element Id in the html is based on the player position in the array
            let li = document.createElement("li");
            let playercard=playerHandElement.appendChild(li);
            playercard.classList.add('backside');
    }  
}

function CloseCards(playerName){

    let i = findPlayerIndex(playerName);
    elementID = 'player' + i + 'hand';
    let playerHandElement = document.getElementById(elementID);
    while(playerHandElement.firstChild){
        playerHandElement.removeChild(playerHandElement.firstChild);
    }
            //find name elemnt
    updatePlayerDisplay(i);

    for (j=0; j < gameplayers[i].Cards.length; j++){
        //The element Id in the html is based on the player position in the array
        let li = document.createElement("li");
        let playercard=playerHandElement.appendChild(li);
        playercard.classList.add('backside');
    }  
}

//---------------------------------------------------------------
//DISPLAY CARDS OF CURRENT PLAYER AND ADD CLICK EVENTS
//----------------------------------------------------------------

function displayCardsAndAddClickEvents(playerName){

    let i = findPlayerIndex(playerName);
    //Find the hand element
    elementID = 'player' + i + 'hand';
    let playerHandElement = document.getElementById(elementID);

    //remove everything on hand
    while(playerHandElement.firstChild){
        playerHandElement.removeChild(playerHandElement.firstChild);
    }
    //find name elemnt
    updatePlayerDisplay(i);
    unostatus[i] = false;
    addCallUno(i);

    for (j=0; j < gameplayers[i].Cards.length; j++){
            let cardColor = gameplayers[i].Cards[j].Color;
            let cardValue = gameplayers[i].Cards[j].Value;
            let card = cardColor + cardValue;
            //The element Id in the html is based on the player position in the array
            
            let li = document.createElement("li");

            //Adding a click event to all the cards that the players have
            li.addEventListener('click', async function() {
        
            // logic to validate the cards will be added here
            // as of now, any card can be played and that is wrong

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
            let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/playCard/"+gameId + "?value="+ cValue + "&color=" +cColor + "&wildColor=" + wildcolor, {
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
                 if(playresult.Player === currentPlayer.Player){ 
                     updateWinner();
                 }
                isItaPlusCard(cValue);                
                setCurrentPlayer(playresult.Player);
                displayCardsAndAddClickEvents(playresult.Player);
            }
            else{
                alert("Request to the API failed. HTTP-Errorcode: " + response.status)  //in case the request fails we want to the information displayd as an alert
            }
}







//Animation for clicking on stack



