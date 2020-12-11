//------------------------------------------------------------------------------------------------------------------
//*UTILITY FUNCTIONS *
//------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------
//*GLOBAL VARIABLES*
//------------------------------------------------------------------------------------------------------------------

let players=[];
let topcard;
let gameplayers;// list of all player objects
let currentPlayer;//current player object
let gameId;// ID of the game returned by the API. This is required tocommunicate with the API
let color; // color that is currently being played
let value; // card-value that is currently being played
let allCards;// for the purpose of writing the vent listener separately to the parent
let currentPlayedCard; // card that has been clicked by the last player to be played
let direction;// to track the direction of the game
//------------------------------------------------------------------------------------------------------------------
//*MODAL GetPlayerNames*
//------------------------------------------------------------------------------------------------------------------

// Modalen Dialog öffnen um Namen einzugeben
document.getElementById('start').addEventListener('click', function(){
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

    if (gamestartJson.TopCard.Value===12){
        direction = -1;
    } else {
        direction = 1;
    }
    //topcard = "blue1";    -->code for testing specific cards
    //we call this function and pass the topcard-String (collor+value) as a parameter into it, 
    //this will add the topcard we get from the API as a background-image to the topcard-div-element
    displayTopCard();

    //gamestartJson response is used to create player objects to hold player names, their cards and their scores
    gameplayers = gamestartJson.Players;

    color = gamestartJson.TopCard.Color;

    value = gamestartJson.TopCard.Value;

    gameId = gamestartJson.Id;
    //the next player is extracted from the gamestartJsonresponse
    setCurrentPlayer(gamestartJson.NextPlayer);

    //the json response received earlier has all information pertaining to cards of each player.  This is going to be 
    //on the screen by this method
    //displayAllCardsAndAddClickEvents();
    //displayAllNames();
    
    for (i = 0; i < gameplayers.length; i++){
        if (gameplayers[i].Player===currentPlayer.Player){   
            displayCardsAndAddClickEvents(gameplayers[i].Player);
        } else {
            CloseCards(gameplayers[i].Player);
        }
    }
}

//---------------------------------------------------------------
//DISPLAY TOP CARD 
//----------------------------------------------------------------
    function displayTopCard (){
        //TODO - save down an old top card and remove it before added on the new top card
        //Kerstin to look at this


        //we are adding the card-values we get from the API as a classname. The classname is unique for each card. 
        // With this classname the matching card-image will be added to the html-element as a background-image (css)
        //the Value "Color" that we get from the API is Written with the Firstletter in Uppercase. 
        //As this string will be used as classnames and classnames are written in lowercase we are transforming this string to lowercase
        let lowerCaseClass = topcard.toLowerCase();
        //we get the topcard-div-element as a variable
        let topcardOnStack = document.getElementById('topcard');
        //this adds the API-cardvalue as a class to the topcard-div-element
        topcardOnStack.classList.add(lowerCaseClass);

        //this event listener allows the player to draw a card, when he / she does not have a suitable
        //card to play
}  

//---------------------------------------------------------------
//RELOAD TOP CARD 
//----------------------------------------------------------------
function replaceTopCard (){
    let lowerCaseClass = topcard.toLowerCase();
    let topcardOnStack = document.getElementById('topcard');
    topcardOnStack.classList.remove(lowerCaseClass);
    lowerCaseClass = currentPlayedCard.toLowerCase();
    topcardOnStack.classList.add(lowerCaseClass);
    topcard = currentPlayedCard;

}

//---------------------------------------------------------------
//DISPLAY ALL CARDS OF PLAYERS AND ADD CLICK EVENTS
//----------------------------------------------------------------
/* function displayAllCardsAndAddClickEvents(){
    //The gameplayers list of objects will be used to display all the cards
    //Firstly, we are iterating through each player and retrieveing their cards
    for (i = 0; i < gameplayers.length; i++)  { 
        //Secondly, we are iterating through each card in the player's hand
        for (j=0; j < 7; j++){
            let cardColor = gameplayers[i].Cards[j].Color;
            let cardValue = gameplayers[i].Cards[j].Value;
            let card = cardColor + cardValue;
            //The element Id in the html is based on the player position in the array
            elementID = 'player' + i + 'hand';
            let playerHandElement = document.getElementById(elementID);
            let li = document.createElement("li");

            //Adding a click event to all the cards that the players have
            li.addEventListener('click', async function() {
            
            // logic to validate the cards will be added here
            // as of now, any card can be played and that is wrong  
            
            
            //PUT request to the Game-API with the card that is being played, if it is a valid card.  Need to add code for checking wild, etc
            let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/playCard/"+gameId + "?value="+ cardValue + "&color=" +cardColor + "&wildColor=" + color, {
            method: 'PUT'
            });
                
            if(response.ok){
                playresult = await response.json();  //we wait to get the comnplete response as we want the body
                console.log(playresult);
                // let lastclassname = $(this).attr('class').split(' ').slice(-1);  //this was just to try if we can get the last classname this way
                // console.log("classname des items: " + lastclassname);
                color = cardColor;//updating the color that can be played by next player
                currentPlayedCard = cardColor + cardValue;
                replaceTopCard();
                console.log("updated topcard " + currentPlayedCard); //updating the topcard on the discard pile
                //unHighlightPreviousPlayer();
                setCurrentPlayer(playresult.Player);
                li.classList.remove(card.toLowerCase()) //remove the card from the player's hand
            }
            else{
                alert("Request to the API failed. HTTP-Errorcode: " + response.status)  //in case the request fails we want to the information displayd as an alert
            }
            });
            
            let playercard=playerHandElement.appendChild(li);
            playercard.classList.add(card.toLowerCase());
       }
    }  
    //allCards = document.getElementsByTagName("ul");
    //console.log(allCards.length); 
}  
 */
function displayAllNames(){
    for (i = 0; i < gameplayers.length; i++){
        let name = gameplayers[i].Player;
        elementNameID = 'player' + i + 'Name';
        document.getElementById(elementNameID).innerHTML = name;
    }
}

//---------------------------------------------------------------
//CLOSE CARDS OF PLAYERS
//----------------------------------------------------------------

async function CloseCards(playerName){

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
        console.log(playerCards);

            //find name elemnt
        elementID = 'player' + findPlayerIndex(playerName) + 'Name';
        let playerNameElement = document.getElementById(elementID);
        playerNameElement.innerHTML = playerCards.Player + " : " + playerCards.Score;

        gameplayers[findPlayerIndex(playerName)].Cards = playerCards.Cards;// saving down the card details for displaying it later
        gameplayers[findPlayerIndex(playerName)].Score = playerCards.Score;
        for (j=0; j < playerCards.Cards.length; j++){
            //The element Id in the html is based on the player position in the array
            let li = document.createElement("li");
            let playercard=playerHandElement.appendChild(li);
            playercard.classList.add('backside');
    }  
}

//---------------------------------------------------------------
//DISPLAY CARDS OF CURRENT PLAYER AND ADD CLICK EVENTS
//----------------------------------------------------------------

async function displayCardsAndAddClickEvents(playerName){
    /*
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/GetCards/" + gameId +"?playerName=" + playerName, {
    method: 'GET'
    });
    let playerCards;
    if(response.ok){
        playerCards = await response.json();  //we wait to get the comnplete response as we want the body    
    } 
    console.log(playerCards);
    */
    

    let i = findPlayerIndex(playerName);
    //Find the hand element
    elementID = 'player' + i + 'hand';
    let playerHandElement = document.getElementById(elementID);

    //remove everything on hand
    while(playerHandElement.firstChild){
        playerHandElement.removeChild(playerHandElement.firstChild);
    }
    //find name elemnt
    elementID = 'player' + i + 'Name';
    let playerNameElement = document.getElementById(elementID);
    playerNameElement.innerHTML = gameplayers[i].Player + " : " + gameplayers[i].Score;
    
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

            if (cardValue===12){// if a reverse card is played, we keep track of the changed direction
                direction = direction * -1;
            }


            //validate if card can be played (color or value) and add effect if it can't
            if(cardColor != color  && cardColor != "Black" && cardValue != value){
                        li.classList.add('shake-lr');
                        setTimeout(function() {     //The welcome-modal is just shown for the given time (millisec) and then hidden again
                            li.classList.remove('shake-lr');;
                        }, 1000);
                        return;
            }
            
            //PUT request to the Game-API with the card that is being played, if it is a valid card.  Need to add code for checking wild, etc
            let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/playCard/"+gameId + "?value="+ cardValue + "&color=" +cardColor + "&wildColor=" + color, {
            method: 'PUT'
            });
                
            if(response.ok){
                playresult = await response.json();  //we wait to get the comnplete response as we want the body
                console.log(playresult);
                // let lastclassname = $(this).attr('class').split(' ').slice(-1);  //this was just to try if we can get the last classname this way
                // console.log("classname des items: " + lastclassname);
                color = cardColor;//updating the color that can be played by next player
                
                value = cardValue;//updating the color that can be played by next player
                currentPlayedCard = cardColor + cardValue;
                replaceTopCard();
                console.log("updated topcard " + currentPlayedCard); //updating the topcard on the discard pile
            

                //unHighlightPreviousPlayer();
                CloseCards(currentPlayer.Player);
                isItaPlusCard(cardValue);                
                setCurrentPlayer(playresult.Player);
                displayCardsAndAddClickEvents(playresult.Player);
                li.classList.remove(card.toLowerCase()) //remove the card from the player's hand
            }
            else{
                alert("Request to the API failed. HTTP-Errorcode: " + response.status)  //in case the request fails we want to the information displayd as an alert
            }
            });
            
            let playercard=playerHandElement.appendChild(li);
            playercard.classList.add(card.toLowerCase());
    }
}  

//---------------------------------------------------------------
//ADD EVENT LISTENER TO THE DECKPILE TO BE ABLE TO DRAW A CARD
//----------------------------------------------------------------

let deckpile = document.getElementById('deckpile');
deckpile.addEventListener('click', async function(){
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/DrawCard/" + gameId, {
    method: 'PUT'
    });
    let drawCard;
    if(response.ok){
        drawCard = await response.json();  //we wait to get the comnplete response as we want the body
        //addCardtoHand(drawCard.Player, drawCard.Card.Color + drawCard.Card.Value);//need to somehow add the eventListener to this card too
        CloseCards(drawCard.Player);
        //unHighlightPreviousPlayer();
        setCurrentPlayer(drawCard.NextPlayer); 
        displayCardsAndAddClickEvents(drawCard.NextPlayer);  
    }    
});

//---------------------------------------------------------------
//RECURRING FUNCTIONS
//----------------------------------------------------------------
  
//this function set's the global variable for the current player and
function setCurrentPlayer(next){
    currentPlayer = gameplayers[findPlayerIndex(next)];
    //highlightCurrentPlayer(i);
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
        CloseCards(affectedPlayer);
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
    let handId = 'player' + indexOfPlayer + 'hand';
    let playerHandElement = document.getElementById(handId);
    let li = document.createElement("li");
    let playercard=playerHandElement.appendChild(li);
    playercard.classList.add(drawnCard.toLowerCase());
}




/*
//---------------------------------------------------------------
//DISPLAY ALL CARDS OF PLAYERS AND ADD CLICK EVENTS
//----------------------------------------------------------------
function displayAllCardsAndAddClickEvents(){
    //The gameplayers list of objects will be used to display all the cards
    //Firstly, we are iterating through each player and retrieveing their cards
    for (i = 0; i < gameplayers.length; i++)  { 
        //Secondly, we are iterating through each card in the player's hand
        for (j=0; j < 7; j++){
            let cardColor = gameplayers[i].Cards[j].Color;
            let cardValue = gameplayers[i].Cards[j].Value;
            let card = cardColor + cardValue;
            //The element Id in the html is based on the player position in the array
            elementID = 'player' + i + 'hand';
            let playerHandElement = document.getElementById(elementID);
            let li = document.createElement("li");

            //Adding a click event to all the cards that the players have
            li.addEventListener('click', async function() {
            
            // logic to validate the cards will be added here
            // as of now, any card can be played and that is wrong  
            
            
            //PUT request to the Game-API with the card that is being played, if it is a valid card.  Need to add code for checking wild, etc
            let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/playCard/"+gameId + "?value="+ cardValue + "&color=" +cardColor + "&wildColor=" + color, {
            method: 'PUT'
            });
                
            if(response.ok){
                playresult = await response.json();  //we wait to get the comnplete response as we want the body
                console.log(playresult);
                // let lastclassname = $(this).attr('class').split(' ').slice(-1);  //this was just to try if we can get the last classname this way
                // console.log("classname des items: " + lastclassname);
                color = cardColor;//updating the color that can be played by next player
                currentPlayedCard = cardColor + cardValue;
                replaceTopCard();
                console.log("updated topcard " + currentPlayedCard); //updating the topcard on the discard pile
                //unHighlightPreviousPlayer();
                setCurrentPlayer(playresult.Player);
                li.classList.remove(card.toLowerCase()) //remove the card from the player's hand
            }
            else{
                alert("Request to the API failed. HTTP-Errorcode: " + response.status)  //in case the request fails we want to the information displayd as an alert
            }
            });
            
            let playercard=playerHandElement.appendChild(li);
            playercard.classList.add(card.toLowerCase());
       }
    }  
}  

function displayAllNames(){
    for (i = 0; i < gameplayers.length; i++){
        let name = gameplayers[i].Player;
        elementNameID = 'player' + i + 'Name';
        document.getElementById(elementNameID).innerHTML = name;
    }
}


*/


