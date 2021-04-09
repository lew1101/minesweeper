/*
Beginner – 9 * 9 Board and 10 Mines
Intermediate – 16 * 16 Board and 40 Mines
Advanced – 24 * 24 Board and 99 Mines
*/

/* -------------- CANVAS ------------------- */

/* ------- Tile Constructor ------- */

class Tile {
    constructor(value, x, y) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.isFlagged = false;
        this.isRevealed = false;
    }
}


/* ------- Game Board ------- */
class Gameboard {

    constructor(canvas, ctx, size, mines) {
        this.gameStarted = false;
        this.gameOver = false;

        this.canvas = canvas;
        this.ctx = ctx;
        this.size = size; // board = nxn

        this.full_sidelength = (canvas.width > canvas.height) ? canvas.height : canvas.width;
        this.tile_length = this.full_sidelength / size;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold ' + String(this.tile_length / 2) + 'pt Arial';

        this.mines_left = mines
        this.mines = mines
        this.board = this.createBoard();
        //event listeners
        this.lastTile = -1;
        this.canvas.addEventListener('mousemove', evt => { //check if hover on tile
            this.highlight(evt);
        });

        this.canvas.addEventListener("mouseout", evt => { //check if mouse leave canvas
            this.mouseOut();
        });

        this.canvas.addEventListener("click", evt => { // check if leftclick on tile
            if (evt.ctrlKey || evt.metaKey) {
                this.rightClick(evt);
            } else {
                this.leftClick(evt);
            }
        });

        this.canvas.addEventListener("contextmenu", evt => { // check if rightclick on tile
            this.rightClick(evt)
        });
    }

    draw() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height) //draw white backdrop

        const text_offset = this.tile_length / 2;
        const image_offset = this.tile_length * 0.075
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {

                const tile = this.board[x][y];

                const color_parity = (x + y) % 2;
                const xx = x * this.tile_length;
                const yy = y * this.tile_length;
                const tileNum = x + this.canvas.width / this.tile_length * y;

                // change style
                if (this.lastTile == tileNum) { // highlight tile mouse is hovering
                    this.ctx.fillStyle = tile.isRevealed ? REVEALED_HIGHLIGHT_COLOR : HIGHLIGHT_COLOR;
                } else {
                    if (tile.isRevealed) { // revealed
                        this.ctx.fillStyle = color_parity ? REVEALED_DEFAULT_COLOR : REVEALED_PARITY_COLOR;
                    } else { // not revealed
                        this.ctx.fillStyle = color_parity ? DEFAULT_COLOR : PARITY_COLOR;
                    }
                }

                this.ctx.fillRect(xx, yy, this.tile_length, this.tile_length); // draw tile

                if (tile.isRevealed && !tile.isFlagged && tile.value != null) { // is revealed, not flagged, and not empty tile
                    switch (tile.value) { // add image or text
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                            this.ctx.fillStyle = TEXT_STYLE[tile.value];
                            this.ctx.fillText(tile.value, xx + text_offset, yy + text_offset);
                            break;
                        default: // runs if not number       this is here for future support, so that if future features are added, the images will be rendered
                            this.ctx.drawImage(images_preload[tile.value], xx + image_offset, yy + image_offset, this.tile_length * 0.85, this.tile_length * 0.85);
                            break;
                    }
                } else if (tile.isFlagged) { //flagged
                    if (tile.value == 'crossed_flag') {
                        this.ctx.drawImage(images_preload['crossed_flag'], xx + image_offset, yy + image_offset, this.tile_length * 0.85, this.tile_length * 0.85);
                    } else {
                        this.ctx.drawImage(images_preload['flag'], xx + image_offset, yy + image_offset, this.tile_length * 0.85, this.tile_length * 0.85);
                    }
                }
            }
        }
    }

    leftClick(evt) {
        if (!this.gameOver) {

            const tileX = ~~(evt.offsetX / this.tile_length);
            const tileY = ~~(evt.offsetY / this.tile_length);
            const tile = this.board[tileX][tileY];
            if (!this.gameStarted) { // starting sequence
                this.gameStarted = true;
                this.startGame(tile);
                tile.isRevealed = true;
                this.revealAdjacentEmptyTiles(tile);

            } else if (!tile.isFlagged && !tile.isRevealed) { // if tile not flagged
                tile.isRevealed = true;
                this.revealAdjacentEmptyTiles(tile);

            } else if (tile.isFlagged) { // if tile is flag
                this.mines_left += 1
                tile.isFlagged = false;

            }

            this.checkGameState();
            this.clearCanvas();
            this.draw();
        }
    }

    rightClick(evt) {
        evt.preventDefault();
        if (!this.gameOver) {
            const tileX = ~~(evt.offsetX / this.tile_length);
            const tileY = ~~(evt.offsetY / this.tile_length);
            const tile = this.board[tileX][tileY];

            if (this.mines_left > 0 && !tile.isRevealed && !tile.isFlagged) {
                tile.isFlagged = true;
                this.mines_left -= 1
                addMineCount(-1);

            } else if (tile.isFlagged) {
                tile.isFlagged = false;
                this.mines_left += 1
                addMineCount(1);
            }

            this.checkGameState();
            this.clearCanvas();
            this.draw();
        }
    }

    highlight(evt) {
        evt.target.style.cursor = 'pointer';
        const tileX = ~~(evt.offsetX / this.tile_length);
        const tileY = ~~(evt.offsetY / this.tile_length);
        const tileNum = tileX + this.canvas.width / this.tile_length * tileY;

        if (this.lastTile == -1 || this.lastTile != tileNum) {
            this.lastTile = tileNum;
            this.clearCanvas();
            this.draw();
        }
    }

    mouseOut() {
        this.lastTile = -1;
        this.clearCanvas();
        this.draw();
    }

    resetCanvas() {
        this.full_sidelength = (this.canvas.width > this.canvas.height) ? this.canvas.height : this.canvas.width;
        this.tile_length = this.full_sidelength / this.size;
        this.ctx.font = 'bold ' + String(this.tile_length / 2) + 'pt Arial';
        this.clearCanvas();
        this.draw();
    }

    resetGame() { // reset and init game
        resetTimer()
        setMineCount(this.mines);
        this.gameOver = false;
        this.gameStarted = false;
        this.board = this.createBoard();
        this.clearCanvas();
        this.draw();
    }

    reconfigure(n, mines) { // alters gameboard settings, resets, and inits game
        this.size = n; // board = nxn

        this.full_sidelength = (canvas.width > canvas.height) ? canvas.height : canvas.width;
        this.tile_length = this.full_sidelength / n;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold ' + String(this.tile_length / 2) + 'pt Arial';

        this.mines_left = mines
        this.mines = mines

        this.resetGame();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    createBoard() {
        let board = [];

        for (let x = 0; x < this.size; x++) { //pstd right here: rip me
            var blankYArray = [];
            for (let y = 0; y < this.size; y++) {
                blankYArray.push(new Tile(null, x, y));
            }
            board.push(blankYArray);
        }

        return board;
    }

    populateMines(num) {
        if (num > ((this.size * this.size) - 9)) {
            alert(Error('Too little squares to place mines'));
            return;
        } else {
            let mines_placed = 0;
            while (mines_placed < num) {
                const x = Math.floor(Math.random() * this.size); // this.n is no. tiles across/vertical
                const y = Math.floor(Math.random() * this.size);

                if (this.board[x][y].value != 'mine') {
                    mines_placed++;
                    this.board[x][y].value = 'mine';
                }
            }
        }
    }

    numerateTiles() {
        for (let x = 0; x < this.size; x++) { // check N, NE, E, SE, S, SW, W, NW
            for (let y = 0; y < this.size; y++) {

                if (this.board[x][y].value == null) {
                    let tile_value = 0;

                    for (let i = -1; i < 2; i++) {
                        for (let j = -1; j < 2; j++) {

                            if (x + i >= 0 && x + i < this.size && y + j >= 0 && y + j < this.size) {
                                if (this.board[x + i][y + j].value == 'mine') {
                                    tile_value++;
                                }
                            }
                        }
                    }
                    this.board[x][y].value = tile_value == '0' ? null : String(tile_value);
                }
            }
        }
    }

    revealMines() {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (this.board[x][y].value == 'mine') { //reveal if mine
                    this.board[x][y].isRevealed = true;
                } else if (this.board[x][y].isFlagged) { // change to crossed flag if not mine
                    this.board[x][y].value = 'crossed_flag'
                }
            }
        }
        this.draw()
    }

    revealAllTiles() {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                this.board[x][y].isRevealed = true;
            }
        }
        this.draw()
    }

    revealAdjacentEmptyTiles(tile) {
        // |   |   |   |
        // |   | X |   |
        // |   |   |   |
        if (!tile.isFlagged) {
            tile.isRevealed = true;
        }
        if (tile.value == null) {
            for (let i = -1; i < 2; i++) { // check N, NE, E, SE, S, SW, W, NW
                for (let j = -1; j < 2; j++)
                    if (tile.x + i >= 0 && tile.x + i < this.size && tile.y + j >= 0 && tile.y + j < this.size) {
                        const adj_tile = this.board[tile.x + i][tile.y + j]
                        if (!adj_tile.isRevealed && !adj_tile.isFlagged) { // check if tile is not revealed and not flagged
                            this.revealAdjacentEmptyTiles(adj_tile)
                        }
                    }
            }
        }
        return;
    }

    getEmptyTile(x, y, bool) { // bool checks if tile is tile.clicked
        while (true) {
            const xx = Math.floor(Math.random() * this.size); // get rand x & y
            const yy = Math.floor(Math.random() * this.size);

            if (bool) { // if tile.clicked
                if (!((xx - x) > 1 || (xx - x) < -1) && !((yy - y) > 1 || (yy - y) < -1)) { //check if tile is adjacent to tile.clicked
                    continue;
                }
            }
            if (this.board[xx][yy].value != 'mine') {
                return [xx, yy] // return new mine location
            }
        }
    }

    clearFlags() {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                this.board[x][y].isFlagged = false;
            }
        }
    }

    startGame(tileClicked) {
        this.clearFlags();
        this.populateMines(this.mines);

        if (tileClicked.value == 'mine') { // check if self is mine
            const newTileCords = this.getEmptyTile(tileClicked.x, tileClicked.y, true);
            this.board[tileClicked.x][tileClicked.y].value = null; //move mine
            this.board[newTileCords[0]][newTileCords[1]].value = 'mine';
        }

        for (let i = -1; i < 2; i++) { // move all adjacent mines
            for (let j = -1; j < 2; j++) {
                if (tileClicked.x + i >= 0 && tileClicked.x + i < this.size && tileClicked.y + j >= 0 && tileClicked.y + j < this.size) {
                    if (this.board[tileClicked.x + i][tileClicked.y + j].value == 'mine') {
                        const newTileCords = this.getEmptyTile(tileClicked.x + i, tileClicked.y + j, false);
                        this.board[tileClicked.x + i][tileClicked.y + j].value = null; // move mine
                        this.board[newTileCords[0]][newTileCords[1]].value = 'mine';
                    }
                }
            }
        }
        this.numerateTiles(); // crucial -> gives tiles numbers
        if (PRINT_SOLUTION) {
            this.print();
        }
        initiateTimer();
    }

    checkGameState() {
        let gamestate = 1; //-1 == lose, 0 == nothing, 1 == win
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (this.board[x][y].value == 'mine' && this.board[x][y].isRevealed) {
                    gamestate = -1
                    this.lose(); // ur bad lmaooooo
                    return;

                } else if (!this.board[x][y].isRevealed && !this.board[x][y].isFlagged) { //check if tile is revealed or flagged
                    gamestate = 0

                } else if (this.board[x][y].value != 'mine' && this.board[x][y].isFlagged) { //check if tile has been incorrectly flagged
                    gamestate = 0
                }
            }
        }
        if (gamestate) {
            this.win(); //if above criterion not met -> win (process of elimination)
        }
        return 1
    }

    lose() {
        // HAHA YOU BAD GIT GUD
        this.gameOver = true;
        this.revealMines(); //reveal all mines
        freezeTimer()
        showGameEndMessage(0);
    }

    win() {
        // WIN!
        this.gameOver = true;
        freezeTimer()
        showGameEndMessage(1);
    }

    print() {
        const color_codes = {
            'escape': '\x1b[39m',
            'mine': '\x1b[31m',
            'flag': '\x1b[34m',
            '1': '\x1b[92m',
            '2': '\x1b[93m',
            '3': '\x1b[94m',
            '4': '\x1b[95m',
            '5': '\x1b[96m',
            '6': '\x1b[35m',
            '7': '\x1b[36m',
            '8': '\x1b[32m',
        }
        let output = '';
        let total_mines = 0;
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const tile = this.board[x][y]
                switch (tile.value) {
                    case null:
                        output += ' ';
                        break;
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                        output += color_codes['mine'] + tile.value + color_codes['escape'];
                        break;
                    case 'mine':
                        total_mines += 1;
                        output += color_codes['mine'] + 'X' + color_codes['escape'];
                        break;
                }
                output += '   ' // add space
            }
            output += '\n\n' // new line
        }

        console.log(output)
        console.log('Total Mines: ' + total_mines)
    }
}

/* ------- Canvas Resize ------- */

function resizeCanvas() { // resize canvas 
    const canvas = document.getElementById('gameboard'); //canvas
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    canvas.height = canvas.width = w > h ? h * CANVAS_SCALER : w * CANVAS_SCALER; // choose the smaller dimension as canvas width/height * scaler
}

function resetGame(size, mines) {
    gameboard.reconfigure(size, mines)
}

/* ------- Game Init ------- */

const canvas = document.getElementById('gameboard'); // canvas
const ctx = canvas.getContext('2d'); // canvas context'

resizeCanvas();
let settings = DIFFICULTY[DEFAULT_DIFFICULTY]
setMineCount(settings.mines)
let gameboard = new Gameboard(canvas, ctx, settings.size, settings.mines);
gameboard.draw();

window.addEventListener('resize', evt => { // if window resize -> resize canvas 
    resizeCanvas();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    gameboard.resetCanvas();
});