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


const getOnlineUsersPromise = async (serverAddress) => {
    const json = await getSeverStatusJson(serverAddress)
    users = json.players
    return users
};

const getOnlineUsersSkins = async (usersPromise) => {
    const skinURL = 'https://sessionserver.mojang.com/session/minecraft/profile/'
    const usersJson = await usersPromise

    if(usersJson.list){
        usersJson.list.forEach( (name) => {
            userUUID = usersJson.uuid[name];
            console.log(`${name}:${userUUID}`);
    
            fetch(`${skinURL}${userUUID}`)
            .then(response => response.json())
            .then(function(response) {
                textureBase64 = response.properties[0].value
                const buff = Buffer.from(textureBase64, 'base64');
                const textureStr = buff.toString('utf-8');
                const textureJson = JSON.parse(textureStr);
                const skinURL = textureJson.textures.SKIN.url
                download(skinURL, `./skins/${name}.png`)
                console.log(skinURL)
            })
            .catch(function(error) {
                console.log(error);
            }); 
        });    
    }
};


module.exports = { getOnlineUsersPromise, getOnlineUsersSkins };