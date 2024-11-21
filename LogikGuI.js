const bodyNode = document.body

// Saetter layout fra terningerne
function terningerStart() {
    const alleTableData = document.querySelectorAll("td")
    const slag1 = createImage("https://upload.wikimedia.org/wikipedia/commons/1/1b/Dice-1-b.svg")
    const slag2 = createImage("https://upload.wikimedia.org/wikipedia/commons/5/5f/Dice-2-b.svg")
    const slag3 = createImage("https://upload.wikimedia.org/wikipedia/commons/b/b1/Dice-3-b.svg")
    const slag4 = createImage("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Dice-4-b.svg/900px-Dice-4-b.svg.png?20231029222734")
    const slag5 = createImage("https://upload.wikimedia.org/wikipedia/commons/0/08/Dice-5-b.svg")
    const slag6 = createImage("https://upload.wikimedia.org/wikipedia/commons/2/26/Dice-6-b.svg")
    alleTableData.forEach((tabledata, index) => {
        tabledata
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
