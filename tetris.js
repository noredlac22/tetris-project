const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

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

// generate random pieces

function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 through 6
    return new Piece(PIECES[r][0],PIECES[r][1]);
}

// initiate a piece

let p = randomPiece();

// draw the Object Piece

function Piece(tetrimino,color){
    this.tetrimino = tetrimino;
    this.color = color;

    this.tetriminoN = 0; // start with the first pattern(layout)
    this.activeTetrimino = this.tetrimino[this.tetriminoN];

    // to move or control the pieces
    this.x = 3;
    this.y = -2;
}

// fill function

Piece.prototype.fill = function(color){
    for(r = 0; r < this.activeTetrimino.length; r++){
        for(c = 0; c < this.activeTetrimino.length; c++){
            // we draw only the occupied squares
            if(this.activeTetrimino[r][c]){
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

// draw a piece to the board

Piece.prototype.draw = function(){
    this.fill(this.color);
}

// undraw a piece (for movement)

Piece.prototype.unDraw = function(){
    this.fill(VACANT);
}

// move down the piece each time

Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetrimino)){
        this.unDraw();
        this.y++;
        this.draw();
    } else{
        // we lock the piece and generate a new piece
        this.lock();
        p = randomPiece();
    }
}

// move right the piece on right arrow key

Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetrimino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// move left the piece on left arrow key

Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetrimino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// rotate the piece on up arrow key

Piece.prototype.rotate = function(){
    let nextPattern = this.tetrimino[(this.tetriminoN+1)%this.tetrimino.length];
    let kick = 0;

    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            // it's the right wall to kick left
            kick = -1; // this moves piece to left x - 1
        } else{
            // it's the left wall to kick right
            kick = 1;
        }
    }

    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetriminoN = (this.tetriminoN+1)%this.tetrimino.length; // example
                                                                    // (0+1)%4 = 1
        this.activeTetrimino = this.tetrimino[this.tetriminoN];
        this.draw();
    }
}

let score = 0

Piece.prototype.lock = function(){
    for(r = 0; r < this.activeTetrimino.length; r++){
        for(c = 0; c < this.activeTetrimino.length; c++){
            // we skip the vacant squares
            if(!this.activeTetrimino[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 0){
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece in place
            board[this.y+r][this.x+c] = this.color;
        }
    }
    // remove full rows or clear line
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for(c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
            // if the row is full
            // we move down all the rows above it to clear line
            for(y = r; y > 1; y--){
                for(c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            // the top row board [0][...] has no row above it
            for(c = 0; c < COL; c++){
                board[0][c] = VACANT;
            }
            // increment the score
            score += 10;
        }
    }
    // update the board
    drawBoard();

    // update the score
    scoreElement.innerHTML = score;
}

// collision function

Piece.prototype.collision = function(x,y,piece){
    for(r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            // if square is empty we skip
            if(!piece[r][c]){
                continue;
            }
            // coordinates of the piece after movement.
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            // conditions
            if(newX < 0 || newX >= COL || newY >=ROW){
                return true;
            }
            if(newY < 0){
                continue;
            }
            // check if there is a locked piece already in the board
            if(board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}


// control the piece

document.addEventListener("keydown",CONTROL);

function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40){
        p.moveDown();
        dropStart = Date.now();
    }
}

// drop the piece every second

let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    if(!gameOver){
        requestAnimationFrame(drop);
    }
}

drop();
