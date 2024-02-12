const board = document.getElementById("board");
let size;
let activeCell;

function buildBoard() { //generates board based on size variable
    const header = document.querySelector("h1");
    header.textContent = `A ${size}x${size} Sudoku!`;
    for (let row = 0; row < size; row++){
        for (let col = 0; col < size; col++){ //generates each sized "box"
            const newBox = document.createElement("div");
            newBox.className = "box";
            newBox.style.border = `${1/size}px solid black`;
            board.appendChild(newBox);
            for (let bRow = 0; bRow < size; bRow++){
                for (let bCol = 0; bCol < size; bCol++){ //generates each cell
                    const newCell = document.createElement("div");
                    newCell.className = "cell";
                    newBox.appendChild(newCell);
                    newCell.id = `${row} ${col} ${bRow} ${bCol}`;
                    newCell.textContent = Math.floor(Math.random() * size**2+1); //randomly fills sudoku
                    newCell.style.fontSize = (`${150/size}px`)
                    newCell.style.lineHeight = (`${150/size}px`)
                    if (size % 2 === 0){
                        newCell.classList.add ((bCol+bRow) % 2 === 0 ? "even" : "odd");
                    }
                    else {
                        newCell.classList.add ((bRow+bCol+col+row) % 2 === 0 ? "even" : "odd");
                    }
                    size <= 3 ? newCell.addEventListener("click", _ => onClick(newCell)) : null; //generates key inputs if 2x2, 1x1 or 3x3
                }
            }
                newBox.style.gridTemplateColumns = `repeat(${size}, ${150/size}px)`;
                newBox.style.gridTemplateRows = `repeat(${size}, ${150/size}px)`;
            }
    }
    
    
    board.style.gridTemplateColumns = `repeat(${size}, 150px)`;
    board.style.gridTemplateRows = `repeat(${size}, 150px)`;
}

document.addEventListener("keydown", event => {
    if (event.key >1 && event.key <= (size**2) && activeCell) {
        activeCell.textContent = event.key;
        activeCell.classList.remove("active");
        buildArray();
    }
});

function onClick(cell){ //sets active cell, for keyboard input and mouse input
    if (cell == activeCell){
        if (cell.textContent === (size**2).toString()){
            cell.textContent = "";
        }
    
        else{
            cell.textContent = Number(cell.textContent)+1;
        }}
    else if (activeCell === undefined) {
        cell.classList.add("active");
        activeCell = cell;
    } 
    else {
        activeCell.classList.remove("active");
        cell.classList.add("active");
        activeCell = cell;
    }
    buildArray();
}

function buildArray() { //converts grid to array
    let sudokuBoard = [];
    board.querySelectorAll('.box').forEach(box => {
      let sudokuBox = [];
      box.querySelectorAll('.cell').forEach(cell => {
        let targetCell = parseInt(cell.textContent);
        sudokuBox.push(targetCell);
      });
      sudokuBoard.push(sudokuBox);
    });
    checkWin(sudokuBoard);
  }
function checkWin(board){ //Checks for a win
    let reference = []
    for (let i = 1; i <= size**2; i++){
        reference.push(i)
    }

    //Imports box array (same as board)
    let sortedBoxes = JSON.parse(JSON.stringify(board));
    //Generates File Array
    let sortedFiles = []
    for (let i1 = 0; i1 < size; i1++){
        for (let i2 = 0; i2 < size; i2++){
            const offset = i2*size+i1*size**3
            let tempArray1 = JSON.parse(JSON.stringify(board))
            let tempArray2 = [];
            for (let i3 = 0; i3 < size; i3++) {
                tempArray2 = tempArray2.concat(tempArray1.flat().slice(offset + size ** 2 * i3, offset + size ** 2 * i3 + size));
            }
            sortedFiles.push(tempArray2);
        }
    }
    //Generates Ranks Array (from file array for ease of math)
    let sortedRanks = []
    for (let i1 = 0; i1 < size**2; i1++){
        let tempArray1 = JSON.parse(JSON.stringify(sortedFiles.flat()))
        let tempArray2 = [];
        for (let i2 = 0; i2 < size**2; i2++) {
            tempArray2.push(tempArray1.at(i2*size**2+i1)); //0, 9, 18, 27, 
        }
        sortedRanks.push(tempArray2);
    }
    
    //Checks if the arrays contain 1-size
    sortedBoxes.forEach(box => {
        box.sort((a,b) => a-b);
    });
    sortedFiles.forEach(file => {
        file.sort((a,b) => a-b);
    }); 
    sortedRanks.forEach(rank => {
        rank.sort((a,b) => a-b);
    });

    checkArray(sortedBoxes);
    checkArray(sortedFiles);
    checkArray(sortedRanks);

    function checkArray(targetArray) {
        let type = ""
        switch (targetArray){
            case sortedBoxes:
                type = "Box";
            break;
            case sortedFiles:
                type = "File";
            break;
            case sortedRanks:
                type = "Rank";
            break;
        }

        let solved = true;

        targetArray.forEach((area, index1) => {
            if (area.every((value, index2) => value === reference[index2])) {
                console.log(`${type} ${index1+1} is correct!`);
            } 
            else {
                console.log(`${type} ${index1+1} is wrong!`);
                solved = false
            }
        })

        solved ? win() : null;
    }

    function win(){
        const tiles = document.querySelectorAll(".cell");
        tiles.forEach(tile =>{
            tile.classList.add("won")
        })
    }

    console.log("-".repeat(70)) //for a tidier code
}

size = 3; //size of board (size by size)

if (size<10){ //originally this was so I wouldnt crash my computer, now its so I dont have to deal with 3 digit numbers.
    buildBoard();
}
else {
    console.log (`This sudoku would have ${size**4} cells, no.`)
}