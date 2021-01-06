
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
let counter = 0;
gameapi = 'http://nowaunoweb.azurewebsites.net/api/game/';