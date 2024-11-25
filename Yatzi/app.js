const express = require("express")
const session = require("express-session")
const fs = require('node:fs/promises')
const path = require("path");

const app = express()

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(express.static('assets'))

app.use(session({
    secret: "secret", 
    saveUninitialized: true,
    resave: true
}));
app.set("view engine", "pug");

const filePath = path.resolve(__dirname, 'spillere.txt');

async function spillerFil(spiller) {
    try {
        let content = '';
        try {
            content = await fs.readFile(filePath, { encoding: 'utf8' });
        } catch (err) {
            console.log('No existing file or error reading it');
        }
        
        const updatedContent = content + '\n' + spiller;
        
        await fs.writeFile(filePath, updatedContent);
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

app.post("/:spiller", (req, res) => {
    let spiller = req.body.spiller;
    if (spiller) {
        req.session.players.push(spiller);
        spillerFil(spiller);
    }
    res.redirect("/");
});

app.post("/", (req, res) => {
    let player = req.body.spiller;
    console.log("Player name:", player);
    if (player) {
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
