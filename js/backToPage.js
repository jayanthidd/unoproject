
/* let buttonBack = document.getElementById('backToPage');

buttonBack.onclick = backToPage();

function backToPage (){
    console.log("Window should close now");
    window.close();
} */

document.getElementById('backToPage').addEventListener('click', function(){
    console.log("Window should close now");
    window.close();
    });