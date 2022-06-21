// get div element with id="puzzle"
const puzzleBoard = document.querySelector('#puzzle')

// get button element with id="solve-button"
const solveButton = document.querySelector('#solve-button')

// get p element with id="solution"
const displaySol = document.querySelector('.solution')

// array of user inputs
let submission = []

// making 9x9 puzzle board (as set by sudoku solver API) of user inputs
const numSquares = 81
for(let i = 0; i < numSquares; i++){
    const inputElement = document.createElement('input')

    // only numbers 1-9 are allowed as inputs
    inputElement.setAttribute('type', 'number')
    inputElement.setAttribute('min', '1')
    inputElement.setAttribute('max', '9')

    // assign grid colors by adding class to input element
    if( ((i % 9 === 0 || i % 9 === 1 || i % 9 === 2 ) && (i < 27 || i > 53)) ||
        ((i % 9 === 6 || i % 9 === 7 || i % 9 === 8 ) && (i < 27 || i > 53)) ||
        ((i % 9 === 3 || i % 9 === 4 || i % 9 === 5 ) && i > 27 && i < 54)
        ){
        inputElement.classList.add('odd-section')
    }

    // add the input elements to the HTML doc
    puzzleBoard.append(inputElement)
}

// function to get all the user input values of the board by adding values to submission array
const joinValues = () => {
    const inputs = document.querySelectorAll('input')
    inputs.forEach(input => {
        if(input.value){
            submission.push(input.value)
        }else{
            submission.push('.')
        }
    })
}

// populate the values of the puzzle board
const populateValues = (isSolvable, solution) => {
    const inputs = document.querySelectorAll('input')
    if(isSolvable && solution){
        inputs.forEach((input, i) => {
            input.value = solution[i]
        })
        // populate the p element with the text
        displaySol.innerHTML = 'This is the solution!'
        displaySol.classList.remove('no-display')
    }else{
        displaySol.innerHTML = 'This is not solvable :('
        displaySol.classList.remove('no-display')
    }
}

const solve = () => {
    // gets joined input values in string with no spaces or commas
    joinValues()
    const data = {numbers: submission.join('')}

    // connect backend for API key
    fetch('http://localhost:8000/solve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        // passing through data with body, which goes to the backend server and is attached to req in app.post()
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        // run function to populate board with solution
        populateValues(data.solvable, data.solution)
        submission = []
    })
    .catch(error => {
        console.error('Error: ' + error)
    })
}



// if the button is clicked, the function solve will be executed
solveButton.addEventListener('click', solve)