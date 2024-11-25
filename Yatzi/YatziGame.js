class YatziGame {
    constructor() {
        this.terninger = [
            new Terning(),
            new Terning(),
            new Terning(),
            new Terning(),
            new Terning()
        ];
        this.spillere = []
    }
    addPlayer(spiller){
        this.spillere.push(new Spiller(spiller))
    }
    getPlayers(){
        return this.spillere
    }
}
class Terning {
    constructor() {
        this.value = Math.floor(Math.random() * 6) + 1
        this.hold = false
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

    rollTerning() {
        this.value = Math.floor(Math.random() * 6) + 1
    }
}
class Spiller {
    constructor (navn){
        this.navn = navn
    }

    getNavn(){
        return this.navn
    }
}

module.exports = { YatziGame }