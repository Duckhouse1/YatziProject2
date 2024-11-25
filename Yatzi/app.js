const express = require("express")
const session = require("express-session")
/*
const game = require("./YatziGame")

const YatziGame = game()
*/
const app = express()

//MIIDDLEWARE
app.use(express.urlencoded({ extended: true }))

app.use(express.static('assets'))

app.use(session({
    secret: "secret", //Man "salter" ens password med noget mere end det man faktisk skriver (brug uuidgen ) så man ikke kan bruge en "rainbow tabel" og hacke dit password nemt
    saveUnintialized : true,
    resave: true
}))
app.set("view engine", "pug")

//ROUTES
app.get("/",(req,res) => {
    if (!req.session.players){
        req.session.players = []
    }
    res.render("forside" , {spillere : req.session.players})
})
app.post("/:spiller",(req,res) => {
    let spiller = req.body.spiller
    if (spiller) {
        req.session.players.push(spiller); // Add player to the session array
    }
    res.redirect("/")
})

app.post("/",(req,res) => {
    let player = req.body.spiller
    console.log("PLayer name" + player);
    req.session.players.push(player)
    res.redirect("/")
})

app.get('/spilSide', (req, res) => {
    res.render('spilSide', {})
})

app.post('/spilSide', (req, res) => {
    res.redirect("/spilSide")
})


//Starter server:
app.listen(8000, () => {
    console.log("Serveren lytter på port 8000");
})
