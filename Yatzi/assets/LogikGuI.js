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
        if (data.redirect) {
            window.location.href = data.url;
        } else if (data.success) {
            let input = document.getElementById(`input${data.key}`)

            if (data.hold) {
                input.classList.add("disabled");
            } else {
                input.classList.remove("disabled");
            }
        }

        resetDices()
        updateScoreList(data.forrigSpiller)
        updateSumAndTotal(data.forrigSpiller)
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

    let sumInput = document.getElementById("Sum")
    sumInput.value = spiller.sumScore
    let totalNode = document.getElementById("Totalinput")
    totalNode.value = spiller.score
    if (spiller.sumScore < 63) {
        let bonusNode = document.getElementById("Bonus")
        bonusNode.classList.add("disabled")
    }
}

function updateInputs(spiller) {
    const spillerDataKeys = Object.keys(spiller.data.gameData)

    spillerDataKeys.forEach((key, index) => {
        let input = document.getElementById(`input${key}`)
        input.value = spiller.data.gameData[key].value
    })
}
function updateScoreList(forrigeSpiller) {

    let scoreList = document.getElementById(`li${forrigeSpiller.navn}`)

    scoreList.textContent = `${forrigeSpiller.navn}: ${forrigeSpiller.score}`

}

function updateSumAndTotal(spiller) {
    let sumNode = document.getElementById("Sum")
    let totalNode = document.getElementById("Totalinput")
    let bonusNode = document.getElementById("Bonus")

    sumNode.value = spiller.sumScore
    totalNode.value = spiller.score

    if (spiller.sumScore >= 63 && bonusNode.classList.contains("disabled")) {
        bonusNode.classList.remove("disabled")
        bonusNode.classList.remove("placeholder")

    } else {
        bonusNode.classList.add("disabled")
    }

}

function updateCurrentPlayer(currentplayer) {
    let currentPlayerNode = document.getElementById("currentPlayerh3")

    currentPlayerNode.textContent = currentplayer
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
