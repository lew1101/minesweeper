/* ---- CONSTANTS AND DECLARATIONS ----- */

const CANVAS_SCALER = 0.73 // 1 = 100% vmin
const DEFAULT_DIFFICULTY = 'MEDIUM'

const HIGH_SCORE_LENGTH = 10;
const SIZE_MIN = 4;
const SIZE_MAX = 40;
const MINES_MAX = 199;
const MINES_MIN = 7;
const PRINT_SOLUTION = true; // prints solution in console

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

let HIGH_SCORES = []; // {size: int, mines: int, time: int in sec}

/* Canvas Styling */

const DEFAULT_COLOR = '#a7d34f';
const PARITY_COLOR = '#9dc94b';
const HIGHLIGHT_COLOR = '#bcdb7d';
const REVEALED_DEFAULT_COLOR = '#e5c29f';
const REVEALED_PARITY_COLOR = '#d2bb9b';
const REVEALED_HIGHLIGHT_COLOR = '#e3ccb6';

const TEXT_STYLE = { // canvas numbers
    '1': '#387CE1',
    '2': '#DA2727',
    '3': '#4F9E33',
    '4': '#9627DA',
    '5': '#E18938',
    '6': '#2AC39F',
    '7': '#DB23C8',
    '8': '#DEBF1D',
}