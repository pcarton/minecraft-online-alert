var alertTimer = null;
var refeshUsersTimer = null
var alertInterval = 5 * 60; //in seconds
var refreshInterval = 5 * 60; //in seconds

var serverAddress=''

//Init function to set up timer and get game, etc
$(document).ready(function(){
    $('#banner').hide(0);
    $('#submit').click(submitFunction);
});

//Function to show the banner for a small amount of time then hide it
function showBanner(){
    $('#banner').slideDown(2000);
    setTimeout(function(){$('#banner').slideUp(2000);},5000);
}

function submitFunction() {
    console.log("start submit")
    let address = $('#serverAddress').val();
    setCookie('serverAddress', address);
    $('#serverAddressFormDiv').hide(0);
    $(document).mouseenter(showBanner);
    alertTimer = setInterval(showBanner,alertInterval*1000);
    refeshUsersTimer = setInterval(refreshUsers,refreshInterval*1000);
}

async function refreshUsers(){
    const response = await fetch(`/loadSkins?serverAddress=${getCookie('serverAddress')}`);
    $(".faceImage").remove()
    console.log("Adding Faces")
    await addFaces()
}

function setCookie(name, value){
    var today = new Date();
    var expiry = new Date(today.getTime() + 30 * 24 * 3600 * 1000); // plus 30 days

    document.cookie=name + "=" + escape(value) + "; path=/; expires=" + expiry.toGMTString();
}

function getCookie(name)
{
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}

async function addFaces() {
    fetch(`/playersOnline?serverAddress=${getCookie('serverAddress')}`)
    .then(response => response.json())
    .then( async function(response) {
        if(response){
            console.log(response)
            response.forEach( (name) => {
                const faceDiv = makeFaceDiv(name);
                $(faceDiv).appendTo('#imageList');
            });
        }
    });
}

function makeFaceDiv(user) {
   return `<div id="${user}" class="faceImage"><img id="${user}Image" src="skins/faces/${user}.png"></div>`
}