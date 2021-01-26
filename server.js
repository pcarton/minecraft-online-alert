const express = require('express');
const getOnlineFaces = require('./getOnlineFaces.js')
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();
const httpPort = 3000;
const httpsPort = 5000;
const keyPath = '/etc/app-certs/privkey.pem';
const certPath = '/etc/app-certs/fullchain.pem';

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

// Listen both http & https ports
const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  key: fs.readFileSync(`${keyPath}`),
  cert: fs.readFileSync(`${certPath}`),
}, app);

httpServer.listen(httpPort, () => {
    console.log(`HTTP Server running on port ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server running on port ${httpsPort}`);
});