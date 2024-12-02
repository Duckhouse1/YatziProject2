class YatziGame {
    constructor() {
        this.terninger = [
            new Terning("https://upload.wikimedia.org/wikipedia/commons/1/1b/Dice-1-b.svg"),
            new Terning("https://upload.wikimedia.org/wikipedia/commons/5/5f/Dice-2-b.svg"),
            new Terning("https://upload.wikimedia.org/wikipedia/commons/b/b1/Dice-3-b.svg"),
            new Terning("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Dice-4-b.svg/900px-Dice-4-b.svg.png?20231029222734"),
            new Terning("https://upload.wikimedia.org/wikipedia/commons/0/08/Dice-5-b.svg")
        ];
        this.spillere = []
        this.currentPlayer = this.spillere[0]
    }
    getTerninger(){
        return this.terninger
    }
    addPlayer(spiller){
        this.spillere.push(new Spiller(spiller))
    }
    getPlayers(){
        return this.spillere
    }
    getDiceImages(){
        return this.terninger.map(t => t.imgString)
    }
    nextPlayer(){
        const currentIndex = this.spillere.findIndex(player => player === this.currentPlayer);
        const nextIndex = (currentIndex + 1) % this.spillere.length; 

        this.currentPlayer = this.spillere[nextIndex];

        this.terninger.forEach(terning => {
            terning.hold = false
        })
    }
}
class Terning {
    constructor(img) {
        this.value = Math.floor(Math.random() * 6) + 1
        this.hold = false
        this.imgString = img
    }

    getValue() {
        return this.value
    }

    getHold() {
        return this.hold
    }

    setHold(hold) {
        this.hold = hold
    }
    getImgString(){
        return this.imgString
    }

    rollTerning() {
        this.value = Math.floor(Math.random() * 6) + 1
    }
}
class Spiller {
    constructor (navn){
        this.navn = navn
        this.score = 0;
        this.rollsLeft = 3
        this.data = new gameData()
        this.done = false
    }

    getNavn(){
        return this.navn
    }
    getScore(){
        return this.score
    }
    getRollsLeft(){
        return this.rollsLeft
    }
}
class gameData{
    constructor(){
        this.gameData = {
            "1-s": { value: 0, disabled: false },
            "2-s": { value: 0, disabled: false },
            "3-s": { value: 0, disabled: false },
            "4-s": { value: 0, disabled: false },
            "5-s": { value: 0, disabled: false },
            "6-s": { value: 0, disabled: false },
            "One pair": { value: 0, disabled: false },
            "Two pair": { value: 0, disabled: false },
            "Three same": { value: 0, disabled: false },
            "Four same": { value: 0, disabled: false },
            "Full house": { value: 0, disabled: false },
            "Small straight": { value: 0, disabled: false },
            "Large straight": { value: 0, disabled: false },
            "Chance": { value: 0, disabled: false },
            "Yatzi": { value: 0, disabled: false },
        };
    }
}

module.exports = { YatziGame }