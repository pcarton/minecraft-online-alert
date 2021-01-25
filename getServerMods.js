const fetch = require('node-fetch');
var http = require('http');
var fs = require('fs');

var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    http.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);
      });
    });
  }

async function getSeverStatusJson(serverAddress) {
    const hostURI='https://api.mcsrvstat.us/2/'
    responseObj = ""

    await fetch(`${hostURI}${serverAddress}`)
    .then(response => response.json())
    .then(function(response) {
        responseObj =  response
    })
    .catch(function(error) {
        console.log(error);
    });
    
    return responseObj

}

const printStatusJson = async (serverAddress) => {
    const json = await getSeverStatusJson(serverAddress)
    console.log(json)
};


const getRawModsList = async (serverAddress) => {
    const json = await getSeverStatusJson(serverAddress)
    mods = json.mods.raw
    return mods
};

const printModsList = async (modsPromise) => {
    const modsJson = await modsPromise

    Object.keys(modsJson).forEach(function(key) {
        var value = modsJson[key];
        console.log(`${value}`); 
      });
};


const modsPromise = getRawModsList('localhost')
printModsList(modsPromise)