/* ------- HOW TO PLAY PAGE -------- */

let instructions_btn = document.getElementById('how-to-play-btn');
let instructions = document.getElementById('instructions-popup');
let instructions_filter = document.getElementById('instructions-filter');
let instructions_close = document.getElementById('instructions-close');

instructions_btn.addEventListener('click', evt => {
    instructions.style.display = 'block';
    instructions_filter.style.display = 'block';
});

instructions_filter.addEventListener('click', evt => {
    instructions.style.display = 'none';
    instructions_filter.style.display = 'none';
});

instructions_close.addEventListener('click', evt => {
    instructions.style.display = 'none';
    instructions_filter.style.display = 'none';
});


/* -------- OPTIONS PAGE -------- */
let settings_button = document.getElementById('option-btn');
let selector_filter = document.getElementById('selector-filter');
let popup = document.getElementById('difficulty-selector');
let close_menu_button = document.getElementById('difficulty-close');
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

close_menu_button.addEventListener('click', evt => { // exit menu
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

let show_size = document.getElementById('ending-size');
let show_mines = document.getElementById('ending-mines')

function showGameEndMessage(state) { //
    const time = getTime();

    if (state == 1) {
        let isHighScore = validateHighScore(CURRENT_SIZE, CURRENT_MINES, time);
        message.innerHTML = isHighScore ? 'New High Score!' : 'You Win!';
        current_score.innerHTML = secToMin(time);
        high_score.innerHTML = secToMin(getHighScore(CURRENT_SIZE, CURRENT_MINES));
    } else if (state == 0) {
        message.innerHTML = 'You Lose!';
        current_score.innerHTML = secToMin(time);
        high_score.innerHTML = secToMin(getHighScore(CURRENT_SIZE, CURRENT_MINES));
    }

    show_size.innerHTML = CURRENT_SIZE;
    show_mines.innerHTML = CURRENT_MINES;
    gameend_popup.style.display = 'block';
    gameend_filter.style.display = 'block';
}

play_again_button.addEventListener('click', evt => {
    gameend_popup.style.display = 'none';
    gameend_filter.style.display = 'none';
    resetGame(CURRENT_SIZE, CURRENT_MINES)
});