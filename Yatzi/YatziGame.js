class YatziGame {
    constructor() {
        this.terninger = [
            new Terning(),
            new Terning(),
            new Terning(),
            new Terning(),
            new Terning()
        ];

        
    }
}
class Terning {
    constructor(value, hold) {
        this.value = Math.floor(Math.random() * 6) + 1
        this.hold = true
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

    constructor(name){
        this.name = name;
    }
  


}

