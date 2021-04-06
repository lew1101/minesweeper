/*
Beginner – 9 * 9 Board and 10 Mines
Intermediate – 16 * 16 Board and 40 Mines
Advanced – 24 * 24 Board and 99 Mines
*/

/* ---- CONSTANTS AND DECLARATIONS ----- */

const CANVAS_SCALER = 0.73 // 1 = 100% vmin
const DEFAULT_DIFFICULTY = 'MEDIUM'

const SIZE_MIN = 4;
const SIZE_MAX = 40;
const MINES_MAX = 199;
const MINES_MIN = 7;

const DIFFICULTY = {
    'EASY': { 'size': 9, 'mines': 10 },
    'MEDIUM': { 'size': 16, 'mines': 40 },
    'HARD': { 'size': 24, 'mines': 99 }
}

let CURRENT_SIZE = DIFFICULTY[DEFAULT_DIFFICULTY].size;
let CURRENT_MINES = DIFFICULTY[DEFAULT_DIFFICULTY].mines;

images_preload = { //fetch from html (how did this solution take me 3hrs to think of bruh im dum) 
    'mine': document.getElementById('mine'), // uh oh stinky poopy
    'flag': document.getElementById('flag'),
    'crossed_flag': document.getElementById('crossed_flag')
}

let HIGH_SCORE = null //secs




/* -------- OPTIONS PAGE -------- */
let settings_button = document.getElementById('option-btn');
let selector_filter = document.getElementById('selector-filter');
let popup = document.getElementById('difficulty-selector');
let x_icon = document.getElementById('x-icon');
let oRadio = document.forms[0].elements['difficulty'];
let save_difficulty_button = document.getElementById('save-difficulty-btn');

let cs_size = document.getElementById('custom-size');
let cs_mines = document.getElementById('custom-mines');

let size_minus_button = document.getElementById('custom-size-minus');
let size_add_button = document.getElementById('custom-size-add');
let mines_minus_button = document.getElementById('custom-mines-minus');
let mines_add_button = document.getElementById('custom-mines-add');

let temp_size = 0;
let temp_mines = 0;


setDefaultCheckedValue(DEFAULT_DIFFICULTY)

settings_button.addEventListener('click', evt => { // show menu when settings_button.click
    showGameOptions(true);
    setDefaultCheckedValue(DEFAULT_DIFFICULTY) //  set form option to current difficulty
    temp_size = CURRENT_SIZE;
    temp_mines = CURRENT_MINES;
    cs_size.innerHTML = temp_size;
    cs_mines.innerHTML = temp_mines;
});

selector_filter.addEventListener('click', evt => { //if click outside of box -> close menu
    showGameOptions(false);
});

x_icon.addEventListener('click', evt => { // exit menu
    showGameOptions(false);
});

save_difficulty_button.addEventListener('click', evt => { // bind save button to save difficulty and execute
    CURRENT_SIZE = temp_size;
    CURRENT_MINES = temp_mines;
    resetGame(CURRENT_SIZE, CURRENT_MINES);
    showGameOptions(false);
});

size_add_button.addEventListener('click', evt => {
    temp_size += 1;
    cs_size.innerHTML = temp_size;
    uncheckAllRadio();
    checkIncrementButtons();
});

size_minus_button.addEventListener('click', evt => {
    temp_size -= 1;
    cs_size.innerHTML = temp_size;
    uncheckAllRadio();
    checkIncrementButtons();
});

mines_add_button.addEventListener('click', evt => {
    temp_mines += 1;
    cs_mines.innerHTML = temp_mines;
    uncheckAllRadio();
    checkIncrementButtons();

});

mines_minus_button.addEventListener('click', evt => {
    temp_mines -= 1;
    cs_mines.innerHTML = temp_mines;
    uncheckAllRadio();
    checkIncrementButtons();
});

function checkIncrementButtons() {
    size_minus_button.disabled = temp_size <= SIZE_MIN;
    size_add_button.disabled = temp_size >= SIZE_MAX;
    if (temp_mines > ((temp_size * temp_size) - 11)) {
        temp_mines = (temp_size * temp_size) - 11;
        cs_mines.innerHTML = temp_mines;
        mines_add_button.disabled = true;
    } else {
        mines_add_button.disabled = temp_mines >= MINES_MAX;
    }
    mines_minus_button.disabled = temp_mines <= MINES_MIN;
}

let choice_easy = document.getElementById('choice-easy');
let choice_medium = document.getElementById('choice-medium');
let choice_hard = document.getElementById('choice-hard');

choice_easy.addEventListener('change', evt => {
    temp_size = 9;
    temp_mines = 10;
    cs_size.innerHTML = temp_size;
    cs_mines.innerHTML = temp_mines;
    checkIncrementButtons();
});

choice_medium.addEventListener('change', evt => {
    temp_size = 16;
    temp_mines = 40;
    cs_size.innerHTML = temp_size;
    cs_mines.innerHTML = temp_mines;
    checkIncrementButtons();
});

choice_hard.addEventListener('change', evt => {
    temp_size = 24;
    temp_mines = 99;
    cs_size.innerHTML = temp_size;
    cs_mines.innerHTML = temp_mines;
    checkIncrementButtons();
});


function showGameOptions(bool) { // whether show settings or not
    selector_filter.style.display = bool ? 'block' : 'none';
    popup.style.display = bool ? 'block' : 'none';
}

function uncheckAllRadio() {
    for (var i = 0; i < oRadio.length; i++) {
        oRadio[i].checked = false;
    }
}

function setDefaultCheckedValue(value) { // give form default value
    for (var i = 0; i < oRadio.length; i++) {
        let d = DIFFICULTY[oRadio[i].value]
        if (d.size == CURRENT_SIZE && d.mines == CURRENT_MINES) {
            oRadio[i].checked = true;
        } else {
            oRadio[i].checked = false;
        }
    }
}


/* ------ GAME END POPUP ------ */

let gameend_filter = document.getElementById('gameend-filter');
let gameend_popup = document.getElementById('gameend-popup')
let message = document.getElementById('gameend-message')
let current_score = document.getElementById('show-score');
let high_score = document.getElementById('show-highscore')
let play_again_button = document.getElementById('play-again-button')

function showGameEndMessage(state) {
    const time = getTime();

    if (state == 1) {
        if (time < HIGH_SCORE || !HIGH_SCORE) {
            message.innerHTML = 'New High Score!';
            HIGH_SCORE = time;
        } else {
            message.innerHTML = 'You Win!';
        }
        current_score.innerHTML = secToMin(time);
        high_score.innerHTML = secToMin(HIGH_SCORE);
    } else if (state == 0) {
        message.innerHTML = 'You Lose!';
        current_score.innerHTML = secToMin(time);
        high_score.innerHTML = secToMin(HIGH_SCORE);
    }


    gameend_popup.style.display = 'block';
    gameend_filter.style.display = 'block';
}

play_again_button.addEventListener('click', evt => {
    gameend_popup.style.display = 'none';
    gameend_filter.style.display = 'none';
    resetGame(CURRENT_SIZE, CURRENT_MINES)
});





/* -------- FLAGS LEFT COUNTER METHODS -------- */
const flags_left = document.getElementById('count-flags');
let count = 0;

function setMineCount(value) {
    count = value;
    flags_left.innerHTML = value;
}

function addMineCount(value) {
    count += value;
    flags_left.innerHTML = count;
}

function resetMineCount() {
    count = 0
    flags_left.innerHTML = 0
}

/* ------ TIMER METHODS --------- */
const timer_cap = 999
const timer = document.getElementById('timer');
let time = 0;
let intervalID;

function initiateTimer() {
    time = 0;
    timer.innerHTML = 0;
    intervalID = window.setInterval(evt => {
        if (time < timer_cap) {
            time++;
            timer.innerHTML = time
        } else {
            freezeTimer();
        }

    }, 1000);
}

function freezeTimer() {
    if (intervalID) {
        window.clearInterval(intervalID);
        return time;
    }
}

function resetTimer() {
    freezeTimer();
    time = 0;
    timer.innerHTML = 0;
}

function getTime() {
    return time
}

function secToMin(s) {
    let min = Math.floor(s / 60);
    let sec = s - (min * 60);

    min = min.toString().length % 2 ? '0' + min : min;
    sec = sec.toString().length % 2 ? '0' + sec : sec

    return min + ' : ' + sec
}




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

let DEFAULT_COLOR = '#a7d34f';
let PARITY_COLOR = '#9dc94b';
let HIGHLIGHT_COLOR = '#bcdb7d';
let REVEALED_DEFAULT_COLOR = '#e5c29f';
let REVEALED_PARITY_COLOR = '#d2bb9b';
let REVEALED_HIGHLIGHT_COLOR = '#e3ccb6';

let TEXT_STYLE = { // give splash of color to text
    '1': '#387CE1',
    '2': '#DA2727',
    '3': '#4F9E33',
    '4': '#9627DA',
    '5': '#E18938',
    '6': '#2AC39F',
    '7': '#DB23C8',
    '8': '#DEBF1D',
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
            evt.target.style.cursor = 'pointer';
            const tileX = ~~(evt.offsetX / this.tile_length);
            const tileY = ~~(evt.offsetY / this.tile_length);
            const tileNum = tileX + this.canvas.width / this.tile_length * tileY;

            if (this.lastTile == -1 || this.lastTile != tileNum) {
                this.lastTile = tileNum;
                this.clearCanvas();
                this.draw();
            }
        });

        this.canvas.addEventListener("mouseout", evt => { //check if mouse leave canvas
            this.lastTile = -1;
            this.clearCanvas();
            this.draw();
        });

        this.canvas.addEventListener("click", evt => { // check if leftclick on tile
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
        });

        this.canvas.addEventListener("contextmenu", evt => { // check if rightclick on tile
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

                if (!tile.isFlagged) { // not flagged
                    switch (tile.value) { // add image or text
                        case null:
                            break;
                        case 'mine':
                            if (tile.isRevealed) {
                                this.ctx.drawImage(images_preload['mine'], xx + image_offset, yy + image_offset, this.tile_length * 0.85, this.tile_length * 0.85);
                            }
                            break;
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                            if (tile.isRevealed) {
                                this.ctx.fillStyle = TEXT_STYLE[tile.value];
                                this.ctx.fillText(tile.value, xx + text_offset, yy + text_offset);
                                break;
                            }
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
            console.log(this.size, Error('Too little squares to place mines'));
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
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const tile = this.board[x][y]
                if (!tile.isFlagged) {
                    switch (tile.value) {
                        case null:
                            output += ' ';
                            break;
                        case 'mine':
                            output += color_codes['mine'] + 'X' + color_codes['escape'];
                            break;
                        default:
                            output += color_codes[tile.value] + tile.value + color_codes['escape']
                            break;
                    }
                } else {
                    output += color_codes['flag'] + '|' + color_codes['escape'];
                    break;
                }
                output += '   '
            }
            output += '\n\n'
        }

        console.log(output)
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