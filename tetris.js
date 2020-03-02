const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");

const ROW = 20; // size of how many squares in each row
const COL = COLUMN = 10; // size of how many squares in each column
const SQ = SQUARE = 20; // size of each square(in pixels)
const VACANT = "WHITE"; // color of empty square

// draw a square in the canvas with unit SQ
function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}


// create the tetris board

let board = [];
for(r = 0; r < ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

// draw the board to canvas
function drawBoard(){
    for(r = 0; r < ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();

// the pieces and the colors

const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"purple"],
    [O,"yellow"],
    [L,"blue"],
    [I,"cyan"],
    [J,"orange"],
];

// initiate a piece

let p = new Piece(PIECES[0][0],PIECES[0][1]);

// draw the Object Piece

function Piece(tetrimino,color){
    this.tetrimino = tetrimino;
    this.color = color;

    this.tetriminoN = 0; // start with the first pattern(layout)
    this.activeTetrimino = this.tetrimino[this.tetriminoN];

    // to move or control the pieces
    this.x = 3;
    this.y = 0;
}

// draw a piece to the board

Piece.prototype.draw = function(){
    for(r = 0; r < this.activeTetrimino.length; r++){
        for(c = 0; c < this.activeTetrimino.length; c++){
            // we draw only the occupied squares
            if(this.activeTetrimino[r][c]){
                drawSquare(this.x + c, this.y + r, this.color);
            }
        }
    }
}

// undraw a piece (for movement)

Piece.prototype.unDraw = function(){
    for(r = 0; r < this.activeTetrimino.length; r++){
        for(c = 0; c < this.activeTetrimino.length; c++){
            // we draw only the occupied squares
            if(this.activeTetrimino[r][c]){
                drawSquare(this.x + c, this.y + r, VACANT);
            }
        }
    }
}

// move down the piece each time

Piece.prototype.moveDown = function(){
    this.unDraw();
    this.y++;
    this.draw();
}

// drop the piece every second

let dropStart = Date.now();
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    requestAnimationFrame(drop);
}

drop();
