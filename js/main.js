//------------------------------------------------------------------------------------------------------------------
//*UTILITY FUNCTIONS *
//------------------------------------------------------------------------------------------------------------------



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

let players=[];
let counter = 0;
document.getElementById('playerNamesForm').addEventListener('submit', function(evt){

    let player = document.getElementById('meineid').value;
    if(players.indexOf(player) < 0){    //prüft wo Playername im Array enthalten ist, wenn -1 dann nicht im Array (Jay, this is so cool!)
        players.push(player);
        counter++;
        document.getElementById('name').innerText = "Add another Player";
        document.getElementById('meineid').value = "";
        document.getElementById('playercount').innerText = counter + "/4 players added";
        console.log("added player. players :" + players.length);
        document.getElementById('welcome').innerText = player + " welcome to the game!";
        $('#welcomebox').modal();   //this shows the modal with a "welcome..."-message for every player
        setTimeout(function() {     //The welcome-modal is just shown for the given time (millisec) and then hidden again
            $('#welcomebox').modal('hide');
        }, 4000);
        $('#meineid').focus();  //focus alone doesn't work here to refocus, as the bootstrap modal has the focus -> want to find alternative solution
    } else {
        document.getElementById('name').innerText = "Player Name exists. Try another Name";
     }
    evt.preventDefault();
    document.getElementById('meineid').innerText = "";
    if (players.length==4){
        document.getElementById('playercount').innerText = counter + "/4 players added";
        setTimeout(function(){      //this delays the hiding of the modal for the given time (millisec), so the last status update messages can be read
            $('#playerNames').modal('hide');
        }, 1500);       
    }
    startGame();
})
let startGame = function(players){
}

/*

//---------------------------------------------------------------
//EXAMPLE FETCH-GET
//----------------------------------------------------------------
//fetch funktioniert mit promise (-> geht nur in asynchroner funktion)
//code muss in asynchroner funktion geschrieben werden, ansonsten funktioniert fetch nicht
async function load(){
    //hier starten wir das request, fetch liefert dann das promise zurück

    //warten auf promise/ Variable response speichert ergebnis der GET-Anfrage auf der Webseite
    let response = await fetch("https://jsonplaceholder.typicode.com/todos",);
    console.log(response);

    //hier kommen wir erst hin, wenn Ergebnis da ist weil wir mit await solange warten bis promise da ist
    //response.ok fragt ab ob HTTP-Response status 200 bis 299 ist
    //Antwort ist ein response-Objekt
    if(response.ok){
        //gets the response head -> müssen aber noch auf den restlichen Teil (body) warten (JSON, Img, ...), 
        // der kann je nach Größe noch nicht fertig geladen sein
        let result = await response.json();
        console.log(result);
        alert(JSON.stringify(result));  //ohne JSON.stringify würde nicht der Inhalt des Objekts als Text ausgegeben werden, sondern nur "Objekt"
        //hier ist es der Inhalt des Post mit der ID1
    }
    else{
        alert("HTTP-Error: " + response.status)

    }

}
//load();

//-------------------------------------------------------------------
//EXAMPLE FETCH-POST
//------------------------------------------------------------------
//fetch funktioniert mit promise (-> geht nur in asynchroner funktion)
//code muss in asynchroner funktion geschrieben werden, ansonsten funktioniert fetch nicht
async function load(){
    neuesTodo = {
        title: 'Web2 lernen',
        completed: true,
        userID: 7
    };

    //hier starten wir das request, fetch liefert dann das promise zurück

    //warten auf promise/ Variable response speichert ergebnis der GET-Anfrage auf der Webseite
    let response = await fetch("https://jsonplaceholder.typicode.com/todos", {
        //bei 'Post' werden Informationen im Body mitgeschickt
        method: 'POST', 
        body: JSON.stringify(neuesTodo),    //haben Objekt (binärdaten) müssen das erst in Text umwandeln, da dies die korrekte Interpretation sicherstellt
        headers: {
            'Content-type' : 'application/json; charset=UTF-8'
        }

    });
    console.log(response);

    //hier kommen wir erst hin, wenn Ergebnis da ist weil wir mit await solange warten bis promise da ist
    //response.ok fragt ab ob HTTP-Response status 200 bis 299 ist
    //Antwort ist ein response-Objekt
    if(response.ok){
        //gets the response head -> müssen aber noch auf den restlichen Teil (body) warten (JSON, Img, ...), 
        // der kann je nach Größe noch nicht fertig geladen sein
        let result = await response.json();
        console.log(result);
        alert(JSON.stringify(result));  //ohne JSON.stringify würde nicht der Inhalt des Objekts als Text ausgegeben werden, sondern nur "Objekt"
        //hier ist es der Inhalt des Post mit der ID1
    }
    else{
        alert("HTTP-Error: " + response.status)

    }

}
load();*/