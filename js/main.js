// Modalen Dialog öffnen um Namen einzugeben
document.getElementById('start').addEventListener('click', function(){
    $('#playerNames').modal();
});

let players=[];
document.getElementById('playerNamesForm').addEventListener('submit', function(evt){

    let player = document.getElementById('meineid').value;
    if(players.indexOf(player) < 0){
        players.push(player);
        document.getElementById('name').innerText = "Player Name";
        console.log("added player. players :" + players.length);
    } else {
        document.getElementById('name').innerText = "Player Name exists.  Try another Name";
     }
    evt.preventDefault();
    document.getElementById('meineid').innerText = "";
    if (players.length==4){
        $('#playerNames').modal('hide');
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