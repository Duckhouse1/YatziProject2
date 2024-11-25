
const express = require("express");
const session = require("express-session");
const fs = require('node:fs/promises');
const path = require("path");
const app = express();
const { YatziGame } = require('./YatziGame');

const game = new YatziGame();

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static('assets'));

app.use(session({
    secret: "secret", 
    saveUninitialized: true,
    resave: true
}));
app.set("view engine", "pug");

const filePath = path.resolve(__dirname, 'spillere.txt');

async function spillerFil(spiller) {
    try {
        let content = "YatziGame: ";

         content += JSON.stringify(game, null,2); 

        await fs.writeFile(filePath, content, { encoding: 'utf8' });
    } catch (err) {
        console.log("Error writing to file:", err);
    }
}

// ROUTES
app.get("/", (req, res) => {
    if (!req.session.players) {
        req.session.players = [];
    }
    res.render("forside", { spillere: req.session.players });
});

app.post("/", (req, res) => {
    let player = req.body.spiller;
    console.log("Player name:", player);
    if (player) {
        game.addPlayer(player)
        console.log(game.getPlayers());
        req.session.players.push(player);
        spillerFil(player);
    }
    res.redirect("/");
});

app.get('/spilSide', (req, res) => {
    if (!req.session.players) {
        req.session.players = [];
    }
    res.render('spilSide', { spillere: req.session.players });
});

app.post('/spilSide', (req, res) => {
    let player = req.body.spiller;
    console.log("Player name:", player);
    if (player) {
        req.session.players.push(player);
        spillerFil(player);
    }
    res.redirect("/spilSide");
});

app.put('/addGamer', (request, response) => {

});

app.get('/rollDice', (request, response) => {

})

// Start the server
app.listen(8000, () => {
    console.log("Serveren lytter på port 8000");
});
