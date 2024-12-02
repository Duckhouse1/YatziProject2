const bodyNode = document.body

const button = document.querySelector("#rollButton")
const terninger = document.querySelectorAll("img")
const alleInput = document.
async function rollDice() {
    try {
        const response = await fetch("/rollDice", {
            method: "POST",
        });

        const data = await response.json();

        console.log("Dette er data" + data);
        if (data.success) {
            const diceArray = data.terninger;
            console.log("Dette er dicearray" + diceArray);
            diceArray.forEach((dice, index) => {
                const diceElement = document.getElementById(`dice-${index + 1}`);
                diceElement.src = dice.imgString;
                diceElement.dataset.value = dice.value;
                console.log(`Dice ${index + 1}: Value = ${dice.value}, Held = ${dice.held}`);
            });

            const rollsLeftElement = document.querySelector("#rollsLeft");
            rollsLeftElement.textContent = data.currentPlayer.rollsLeft;

            let currentPlayer = data.currentPlayer;
            let currentPlayerData = currentPlayer.data.gameData

            Object.keys(currentPlayerData).forEach(key => {
                let nøgle = document.getElementsByName(key)
                if (nøgle === false) {
                    nøgle.textContent = key.value
                }
            })
            console.log("Updated dice and player state successfully!");
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



async function holdIndput() {
    
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
