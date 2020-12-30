//---------------------------------------------------------------
//ADD ANIMATION TO DECKPILE WHEN PLAYER DRAWS A CARD
//----------------------------------------------------------------

function animateDrawnCard (){
    let index = findPlayerIndex(currentPlayer.Player)
    if(index === 0){
    deckpile.classList.add('roll-out-top');
    setTimeout(function() {     //The shake-class is removed after 1 sec so it can be added again to the class if you click it again
        deckpile.classList.remove('roll-out-top');
    }, 1000);
    return;
    }

    if(index === 1){
        deckpile.classList.add('roll-out-right');
        setTimeout(function() {     //The shake-class is removed after 1 sec so it can be added again to the class if you click it again
            deckpile.classList.remove('roll-out-right');
        }, 1000);
        return;
    }

    if(index === 3){
        deckpile.classList.add('roll-out-left');
        setTimeout(function() {     //The shake-class is removed after 1 sec so it can be added again to the class if you click it again
            deckpile.classList.remove('roll-out-left');
        }, 1000);
        return;
    }
    else{
        deckpile.classList.add('roll-out-bottom');
        setTimeout(function() {     //The shake-class is removed after 1 sec so it can be added again to the class if you click it again
            deckpile.classList.remove('roll-out-bottom');
        }, 1000);
        return;
    }
}

//---------------------------------------------------------------
//DISPLAY TOP CARD 
//----------------------------------------------------------------
function displayTopCard (){
    //we are adding the card-values we get from the API as a classname. The classname is unique for each card. 
    // With this classname the matching card-image will be added to the html-element as a background-image (css)
    //the Value "Color" that we get from the API is Written with the Firstletter in Uppercase. 
    //As this string will be used as classnames and classnames are written in lowercase we are transforming this string to lowercase
    let lowerCaseClass = topcard.toLowerCase();
    //we get the topcard-div-element as a variable
    let topcardOnStack = document.getElementById('topcard');
    //this adds the API-cardvalue as a class to the topcard-div-element
    topcardOnStack.classList.add(lowerCaseClass);
    displayCurrentColor()
   
    //this event listener allows the player to draw a card, when he / she does not have a suitable
    //card to play
}  

//---------------------------------------------------------------
//REPLACE TOP CARD 
//----------------------------------------------------------------
function replaceTopCard (){
let lowerCaseClass = topcard.toLowerCase();
let topcardOnStack = document.getElementById('topcard');
topcardOnStack.classList.remove(lowerCaseClass);
lowerCaseClass = currentPlayedCard.toLowerCase();
topcardOnStack.classList.add(lowerCaseClass);
let index = findPlayerIndex(currentPlayer.Player)
    if(index === 0){
        topcardOnStack.classList.add('tilt-in-top-2');
        setTimeout(function() {    
        topcardOnStack.classList.remove('tilt-in-top-2');
        }, 1000);
        displayCurrentColor();
        topcard = currentPlayedCard;
        return;
    }
    if(index === 1){
        topcardOnStack.classList.add('tilt-in-right-2');
        setTimeout(function() {    
        topcardOnStack.classList.remove('tilt-in-right-2');   
        }, 1000);
        displayCurrentColor();
        topcard = currentPlayedCard;
        return;
    }
    if(index === 3){
        topcardOnStack.classList.add('tilt-in-left-2');
        setTimeout(function() {    
        topcardOnStack.classList.remove('tilt-in-left-2');
        }, 1000);
        displayCurrentColor();
        topcard = currentPlayedCard;
        return;
    }
    else{
        topcardOnStack.classList.add('tilt-in-bottom-2');
        setTimeout(function() {    
            topcardOnStack.classList.remove('tilt-in-bottom-2');
        }, 1000);
        displayCurrentColor();
        topcard = currentPlayedCard;    
        return;

    }
    // displayCurrentColor();
    // topcard = currentPlayedCard;
}


function displayAllNames(){
for (i = 0; i < gameplayers.length; i++){
    let name = gameplayers[i].Player;
    elementNameID = 'player' + i + 'Name';
    document.getElementById(elementNameID).innerHTML = name;
}
}