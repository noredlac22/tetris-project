const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");

const ROW = 20; // size of how many squares in each row
const COL = COLUMN = 10; // size of how many squares in each column
const SQ = SQUARE = 20; // size of each square(in pixels)
const VACANT = "WHITE"; // color of empty square

// draw a square in the canvas with unit SQ
function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,50,50);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,50,50);
}


// create the tetris board

let board = [];
for(r = 0; r < ROW; r++){
    board[r] = [];
    for(c = 0; c < COLUMN; c++){
        board[r][c] = VACANT;
    }
}
