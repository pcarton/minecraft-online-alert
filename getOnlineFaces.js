const fetch = require('node-fetch');
var http = require('http');
var fs = require('fs');
const sharp = require('sharp');

var download = function(url, dest) {
    return new Promise((resolve,reject) => {
        var file = fs.createWriteStream(dest);
    
        http.get(url, function(response) {
          response.pipe(file);
          file.on('finish',() => {resolve(true)});
          file.on("error", reject); // don't forget this!
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

const printPromiseJson = async (promise) => {
    promise.then((values) => {
        console.log(values);
      });
};


const getOnlineUsersPromise = async (serverAddress) => {
    const json = await getSeverStatusJson(serverAddress)
    users = json.players
    return users
};

const downloadOnlineUsersSkinLocations = async (usersPromise) => {
    const skinURL = 'https://sessionserver.mojang.com/session/minecraft/profile/'
    const usersJson = await usersPromise

    if(usersJson.list){
        usersJson.list.forEach( (name) => {
            userUUID = usersJson.uuid[name];
            console.log(`${name}:${userUUID}`);
    
            fetch(`${skinURL}${userUUID}`)
            .then(response => response.json())
            .then( async function(response) {
                textureBase64 = response.properties[0].value
                const buff = Buffer.from(textureBase64, 'base64');
                const textureStr = buff.toString('utf-8');
                const textureJson = JSON.parse(textureStr);
                const skinURL = textureJson.textures.SKIN.url
                const fullSkinPath = `./skins/${name}.png`
                const faceSkinPath = `./skins/faces/${name}.png`
                await download(skinURL, fullSkinPath)

                sharp(fullSkinPath)
                .extract({ width: 8, height: 8, left: 8, top: 8 })
                .resize({ width:50, height:50, fit: 'fill', kernel: 'nearest' })
                .toFile(faceSkinPath)
                .then(function(new_file_info) {
                    console.log("Image cropped and saved");
                })
                .catch(function(err) {
                    console.log("An error occured");
                    console.log(`${err}`);
                });

            })
            .catch(function(error) {
                console.log(error);
            }); 
        });    
    }
};


const parseOutSkinUrl = async (uuid) => {
    const skinURL = 'https://sessionserver.mojang.com/session/minecraft/profile/'

    const response = await fetch(`${skinURL}${uuid}`);
    const responseJson = await response.json();
    const textureBase64 = responseJson.properties[0].value;
    const buff = Buffer.from(textureBase64, 'base64');
    const textureStr = buff.toString('utf-8');
    const textureJson = JSON.parse(textureStr);
    return textureJson.textures.SKIN.url;
};

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

const getOnlineUsersSkinLocationsPromise = async (usersPromise) => {
    const usersJson = await usersPromise

    if(usersJson.list){
        let skinLinks = []
        await asyncForEach(usersJson.list, async (name) => {
            userUUID = usersJson.uuid[name];
            console.log(`${name}:${userUUID}`);
            const skinLocationURL = await parseOutSkinUrl(userUUID)

            skinLinks.push(`${skinLocationURL}`);
        }); 
        return skinLinks
    }
};

module.exports = { getOnlineUsersPromise, downloadOnlineUsersSkinLocations, getOnlineUsersSkinLocationsPromise };