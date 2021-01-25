const express = require('express');
const getOnlineFaces = require('./getOnlineFaces.js')
const bodyParser = require('body-parser');


const app = express();
const port = 3000;

app.use('/playerSkins', express.static('skins'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/loadSkins', (req,res) => {
    let serverAddress = req.query.serverAddress;

    const usersPromise = getOnlineFaces.getOnlineUsersPromise(`${serverAddress}`)
    getOnlineFaces.getOnlineUsersSkins(usersPromise)
    res.send('Loading Player Skins to Webserver')
});

app.get('/playersOnline', (req,res) => {
    let serverAddress = req.query.serverAddress;

    const usersPromise = getOnlineFaces.getOnlineUsersPromise(`${serverAddress}`)

    usersPromise.then( (users) => {
        res.json(users.list)
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});