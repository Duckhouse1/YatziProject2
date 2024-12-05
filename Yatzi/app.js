
const express = require("express");
const session = require("express-session");
const fs = require('node:fs/promises');
const path = require("path");
const app = express();
const { YatziGame } = require('./YatziGame');

let game = new YatziGame();

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

// ROUTES
//Forside
app.get("/", (req, res) => {
    if (!req.session.players) {
        req.session.players = [];
        req.session.dices = []
    } 
    res.render("forside", { spillere: req.session.players })
});
//Sørger for når du trykker opret ved "login"
app.post("/", (req, res) => {
    let player = req.body.spiller;
    if (player) {
        game.addPlayer(player);
        req.session.players.push(player);
        gemSpil(player);
    }
    game.currentPlayer = game.spillere[0]
    res.redirect(302, "/");
});
//YatziForside
app.get("/spilSide", (req, res) => {
    let terninger = game.terninger
    let spiller = game.currentPlayer
    let gameData = spiller.data.gameData
    res.render("spilSide", { spillere: req.session.players, terninger: terninger, gameData: gameData, currentPlayer: spiller, gameSpillere: game.spillere })
})

// Start the server
app.listen(8000, () => {
    console.log("Serveren lytter på port 8000");
});

//Når man trykker på roll knappen
app.post("/rollDice", async (req, res) => {
    const diceImages = [
        "https://upload.wikimedia.org/wikipedia/commons/1/1b/Dice-1-b.svg",
        "https://upload.wikimedia.org/wikipedia/commons/5/5f/Dice-2-b.svg",
        "https://upload.wikimedia.org/wikipedia/commons/b/b1/Dice-3-b.svg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Dice-4-b.svg/900px-Dice-4-b.svg.png?20231029222734",
        "https://upload.wikimedia.org/wikipedia/commons/0/08/Dice-5-b.svg",
        "https://upload.wikimedia.org/wikipedia/commons/2/26/Dice-6-b.svg"
    ];

    try {
        let currentPlayer = game.currentPlayer;

        if (currentPlayer.rollsLeft > 0) {
            game.terninger.forEach((dice) => {
                if (!dice.getHold()) {
                    dice.rollTerning();
                    dice.imgString = diceImages[dice.value - 1];
                }
            });
            
            currentPlayer.rollsLeft -= 1;
        }

        udregnData(game.terninger, currentPlayer);
        res.json({
            success: true,
            terninger: game.terninger,
            currentPlayer: currentPlayer,
            CurrentPlayerData: currentPlayer.data.gameData
        });
    } catch (error) {

    }
});

//Hold på den enkelte terning
app.get("/toggleHold/:index", (req, res) => {
    const index = parseInt(req.params.index);

    if (index >= 0 && index < game.terninger.length) {
        let dice = game.terninger[index];
        if (dice.getHold()) {
            dice.setHold(false);
        } else {
            dice.setHold(true);
            dice.class = "disabled"
        }
        res.json({
            success: true,
            index: index,
            hold: dice.getHold(), // Send the updated hold state
        })
    } else {
        res.status(400).send("Invalid dice index.");
    }
});
//Hold/disable det specifikke input 
app.get("/toggleDisabledInput/:key", (req, res) => {
    const spiller = game.currentPlayer;
    const keyIndex = parseInt(req.params.key);

    let key = Object.keys(spiller.data.gameData).find((key, index) => index === keyIndex)

    spiller.score += spiller.data.gameData[key].value
    spiller.data.gameData[key].disabled = true

    
    if (key.endsWith("s")) {
        spiller.sumScore += Number(spiller.data.gameData[key].value)
        if (spiller.sumScore >= 63 && !spiller.bonus){
            spiller.score += 50
            spiller.bonus = true
        }
    }
    nulStilInputs()

    spiller.rollsLeft = 3
    game.nextPlayer();

    gemSpil();
    //Sæt alle terninger til 1 for "reset"
    game.terninger.forEach(terning => {
        terning.imgString = "https://upload.wikimedia.org/wikipedia/commons/1/1b/Dice-1-b.svg"
    })

    let sidsteInputValgt = Object.values(spiller.data.gameData).every(data => data.disabled);

    if (sidsteInputValgt) {
        spiller.done = true;
    }
    if (game.spillere.every(spiller => spiller.done === true)) {

        return res.json({
            redirect: true,
            url: "/results"
        })

    } else {
        res.json({
            forrigSpiller: spiller,
            success: true,
            currentPlayer: game.currentPlayer,
            key: key,
            hold: spiller.data.gameData[key].disabled
        });
    }

});
//Render slutsiden når alle spillere er done
app.get("/results", (req, res) => {
    let vinder = game.spillere.find((s1, s2) => s1.score > s2)
    let tabere = game.spillere.filter(spiller => spiller.score < vinder.score)

    res.render("results", { vinder: vinder, tabere: tabere })
})
//Når man trykker på rematch knappen
app.get("/rematch", (req, res) => {
    game = new YatziGame()
    req.session.players = [];
    req.session.dices = []
    res.redirect("/")
})

async function gemSpil() {
    let content = "YatziGame: ";

    content += JSON.stringify(game, null, 2);

    await fs.writeFile(filePath, content, { encoding: 'utf8' });
}


function udregnData(array, spiller) {
    nulStilInputs()
    const dices = array;
    const antal = [0, 0, 0, 0, 0, 0];
    // -s
    dices.forEach((dice, index) => {
        if (dice.value >= 1 && dice.value <= 6) {
            antal[dice.value - 1] += 1;
            if (spiller.data.gameData[`${dice.value}-s`].disabled === false) {
                spiller.data.gameData[`${dice.value}-s`].value = antal[dice.value - 1] * dice.value;
            }

        }
    });
    //Chance
    if (spiller.data.gameData["Chance"].disabled === false) {
        let valueToReturn = dices.reduce((sum, dice) => sum + dice.value, 0);
        spiller.data.gameData["Chance"].value = valueToReturn;
    }
    //Par og ens
    antal.forEach((count, index) => {
        const value = index + 1; // Dice value is index + 1

        if (count >= 2 && spiller.data.gameData["One pair"].disabled === false) {
            spiller.data.gameData["One pair"].value = value * 2;
        }
        if (count >= 3 && spiller.data.gameData["Three same"].disabled === false) {
            spiller.data.gameData["Three same"].value = value * 3;
        }
        if (count >= 4 && spiller.data.gameData["Four same"].disabled === false) {
            spiller.data.gameData["Four same"].value = value * 4;
        }
        if (count >= 5 && spiller.data.gameData["Yatzi"].disabled === false) {
            spiller.data.gameData["Yatzi"].value = value * 5;
        }
    }
    );
    //Small straight
    if ([1, 1, 1, 1, 1, 0].every((value, index) => value === antal[index])) {
        spiller.data.gameData["Small straight"].value = 15;
    }
    //Big straight
    if ([0, 1, 1, 1, 1, 1].every((value, index) => value === antal[index])) {
        spiller.data.gameData["Large straight"].value = 20;
    }
    //To par
    let flerePar = antal.filter(value => value >= 2).length >= 2;
    if (flerePar && spiller.data.gameData["Two pair"].disabled === false) {
        let indexForPar = antal.reduce((indexes, value, index) => {
            if (value >= 2) {
                indexes.push(index + 1); //Her er det +1 fordi game.terning, dets værdi starter med 1, så der må ikke være et index 0
            }
            return indexes;
        }, []);

        let Indexpar1 = indexForPar[0]
        let Indexpar2 = indexForPar[1]

        let valueToReturn = (Indexpar1 + Indexpar2) * 2
        spiller.data.gameData["Two pair"].value = valueToReturn;
    }

    //FullHouse
    let par = 0
    let treEns = 0
    antal.forEach((value, index) => {
        if (value === 2 && (index * 2) > par && spiller.data.gameData["Full house"].disabled === false) {
            par = value * (index + 1)
            console.log(par);
        }
        if (value === 3 && (index * 3) > treEns && spiller.data.gameData["Full house"].disabled === false) {
            treEns = value * (index + 1)
            console.log(treEns);
        }
    })
    if (par > 0 && treEns > 0) {
        console.log(spiller.data.gameData["Full house"].value);
        spiller.data.gameData["Full house"].value = par + treEns;
    }
}

function nulStilInputs() {
    Object.keys(game.currentPlayer.data.gameData).forEach(key => {
        if (game.currentPlayer.data.gameData[key].disabled === false) {
            game.currentPlayer.data.gameData[key].value = 0
        }
    })
}
