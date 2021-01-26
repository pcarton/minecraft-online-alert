const express = require('express');
const getOnlineFaces = require('./getOnlineFaces.js')
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/js', express.static('express/js'));
app.use('/css', express.static('express/css'));
app.use('/skins', express.static('skins'));

app.get('/skinsListOfOnlinePlayers', (req,res) => {
    let serverAddress = req.query.serverAddress;

    const usersPromise = getOnlineFaces.getOnlineUsersPromise(`${serverAddress}`);
    const skinLocationsPromise = getOnlineFaces.getOnlineUsersSkinLocationsPromise(usersPromise);

    skinLocationsPromise.then( (skinLocations) => {
        res.json(skinLocations)
    });

});

app.get('/loadSkins', (req,res) => {
    let serverAddress = req.query.serverAddress;

    const usersPromise = getOnlineFaces.getOnlineUsersPromise(`${serverAddress}`);
    const skinLocationsPromise = getOnlineFaces.downloadOnlineUsersSkinLocations(usersPromise);

    skinLocationsPromise.then( (skinLocations) => {
        res.send('Loading Skins To Webserver')
    });

});

app.get('/playersOnline', (req,res) => {
    let serverAddress = req.query.serverAddress;

    const usersPromise = getOnlineFaces.getOnlineUsersPromise(`${serverAddress}`);

    usersPromise.then( (users) => {
        if (users) {
            res.json(users.list);
        }
    });
});

app.use('/', (req,res) => {
    res.sendFile(path.join(__dirname+'/express/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});