const bodyNode = document.body

const button = document.querySelector("#rollButton")
const terninger = document.querySelectorAll("img")
const inputs = document.querySelectorAll(".input")

async function rollDice() {
    try {
        const response = await fetch("/rollDice", { method: "POST" });
        const data = await response.json();

        if (data.success) {
            const diceArray = data.terninger;
            diceArray.forEach((dice, index) => {
                const diceElement = document.getElementById(`dice-${index + 1}`);
                diceElement.src = dice.imgString;
            });

            document.querySelector("#rollsLeft").textContent = data.currentPlayer.rollsLeft;

            // Opdater inputfelterne
            const currentPlayerData = data.CurrentPlayerData;
            Object.keys(currentPlayerData).forEach((key) => {
                const inputElement = document.getElementById(`input${key}`);
                inputElement.value = currentPlayerData[key].value;

            });
        } else {
            console.error("Failed to roll dice:", data.message);
        }
    } catch (error) {
        console.error("Error during dice roll:", error);
    }
}
button.addEventListener("click", rollDice)

async function holdDice(index) {
    try {
        const response = await fetch(`/toggleHold/${index}`, {
            method: "GET",
        });

        const data = await response.json();

        if (data.success) {
            const diceElement = document.getElementById(`dice-${index + 1}`);
            if (data.hold) {
                diceElement.classList.add("disabled");
            } else {
                diceElement.classList.remove("disabled");
            }
        }
    } catch {

    }
}
terninger.forEach((terning, index) => {
    terning.addEventListener("click", () => holdDice(index))
})

async function holdIndput(keyIndex) {
    try {
        const response = await fetch(`/toggleDisabledInput/${keyIndex}`, {
            method: "GET",
        });

        const data = await response.json();

        if (data.success) {
            let input = document.getElementById(`input${data.key}`)

            if (data.hold) {
                input.classList.add("disabled");
            } else {
                input.classList.remove("disabled");
            }
        }

        resetDices()
        updateScoreList(data.forrigSpiller)
        updateSumAndTotal(data.currentPlayer, data.sumScore)
        updateInputafterSelect(data.currentPlayer)
        updateCurrentPlayer(data.currentPlayer.navn)

    } catch {

    }
}
inputs.forEach((input, index) => {
    input.addEventListener("click", () => holdIndput(index))
})

function resetDices() {
    terninger.forEach(terning => {
        terning.src = "https://upload.wikimedia.org/wikipedia/commons/1/1b/Dice-1-b.svg"
        terning.classList.remove("disabled");
    })
}

function updateInputafterSelect(spiller) {
    const spillerDataKeys = Object.keys(spiller.data.gameData)
    spillerDataKeys.forEach((key, index) => {
        let input = document.getElementById(`input${key}`)
        input.value = spiller.data.gameData[key].value
        if (spiller.data.gameData[key].disabled === false) {
            input.classList.remove("disabled");
        } else {
            input.classList.add("disabled");

        }
    })
}

function updateInputs(spiller) {
    const spillerDataKeys = Object.keys(spiller.data.gameData)

    spillerDataKeys.forEach((key, index) => {
        let input = document.getElementById(`input${key}`)
        input.value = spiller.data.gameData[key].value
    })
}
function updateScoreList(forrigeSpiller) {
    console.log(forrigeSpiller.navn);

    let scoreList = document.getElementById(`li${forrigeSpiller.navn}`)

    console.log(scoreList.textContent);
    scoreList.textContent = `${forrigeSpiller.navn}: ${forrigeSpiller.score}`
    console.log(scoreList.textContent);

}

function updateSumAndTotal(currentPlayer,sumScore) {
    let sumNode = document.getElementById("Sum")
    let totalNode = document.getElementById("Total")
    let bonusNode = document.getElementById("Bonus")
    console.log(sumScore);
    sumNode.value = sumScore
    console.log(sumNode.value);

}

function updateCurrentPlayer(currentplayer) {
    let currentPlayerNode = document.getElementById("currentPlayerh3")

    currentPlayerNode.textContent = currentplayer
}

function nulstilInputs(currentPlayer){
    const spillerDataKeys = Object.keys(currentPlayer.data.gameData)

    spillerDataKeys.forEach(key => {
        let input = document.getElementById(`input${key}`)
        console.log(`Resetting input${key}:`, input); // Debugging
        if (!input.classList.contains("disabled")){
            input.value = 0
        } 
    })

}








// Saetter layout fra terningerne
function unChangeableInput() {
    const alleInput = document.querySelectorAll("input#raekkeInput")
    alleInput.forEach(element => {
        element.readOnly = true
    })
}
unChangeableInput()

// Style dice
function adjustDices() {
    const alleDices = document.querySelectorAll("td")
    alleDices.forEach(element => {
        element.style.marginLeft = "30%"
    })
}
adjustDices()

function inputLength() {
    const allInputs = document.querySelectorAll("input")
    allInputs.forEach(input => {
        input.style.width = "25%"
    })
}
inputLength()
