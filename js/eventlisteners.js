//---------------------------------------------------------------
//DRAW A CARD FROM THE DECK PILE
//----------------------------------------------------------------

let deckpile = document.getElementById('deckpile');
deckpile.addEventListener('click', drawCard);

async function drawCard(){
    animateDrawnCard ();    
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/DrawCard/" + gameId, {
    method: 'PUT'
    });
    let drawCard;
    if(response.ok){
        drawCard = await response.json();  //we wait to get the comnplete response as we want the body
        addCardtoHand(drawCard.Player, drawCard.Card);//need to somehow add the eventListener to this card too
        CloseCards(drawCard.Player);
        //unHighlightPreviousPlayer();
        setCurrentPlayer(drawCard.NextPlayer); 
        displayCardsAndAddClickEvents(drawCard.NextPlayer);  
    }    
}

//---------------------------------------------------------------
//ADD EVENT LISTENER TO CHANGE COLOR
//----------------------------------------------------------------
document.getElementById('red').addEventListener('click', function(){
    wildcolor = 'Red';
    color = 'Red';
    console.log("You picked the color: " + color);
    processCard();
    displayCurrentColor();
    $('#colorModal').modal('hide');
});
document.getElementById('blue').addEventListener('click', function(){
wildcolor = 'Blue';
color ='Blue';
console.log("You picked the color: " + color);
processCard();
displayCurrentColor();
$('#colorModal').modal('hide');
});
document.getElementById('yellow').addEventListener('click', function(){
wildcolor = 'Yellow';
color = 'Yellow';
console.log("You picked the color: " + color);
processCard();
displayCurrentColor();
$('#colorModal').modal('hide');
});
document.getElementById('green').addEventListener('click', function(){
wildcolor = 'Green';
color = 'Green';
console.log("You picked the color: " + color);
processCard();
displayCurrentColor();
$('#colorModal').modal('hide');
});
