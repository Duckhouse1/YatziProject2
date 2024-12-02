
async function rollDice() {
    try {
        const response = await fetch("/rollDice", {
            method: "POST",
        });

        const data = await response.json();

        if (data.success) {
            // Extract dice objects
            const diceArray = data.terninger;

            // Loop through each dice and update UI
            diceArray.forEach((dice, index) => {
                const diceElement = document.querySelector(`#dice-${index}`);
                diceElement.src = dice.imgString; // Update the dice image
                diceElement.dataset.value = dice.value; // Store the value as a dataset attribute
                console.log(`Dice ${index + 1}: Value = ${dice.value}, Held = ${dice.held}`);
            });

            // Update player rolls left
            const rollsLeftElement = document.querySelector("#rolls-left");
            rollsLeftElement.textContent = data.currentPlayer.rollsLeft;

            console.log("Updated dice and player state successfully!");
        } else {
            console.error("Failed to roll dice:", data.message);
        }
    } catch (error) {
        console.error("Error during dice roll:", error);
    }
}