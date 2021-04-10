/* ------- NEW GAME SCREEN ----------*/

$('#new-game-btn').click(evt => {
    resetGame(CURRENT_SIZE, CURRENT_MINES);
});

$('#gameend-close').click(evt => {
    $('#gameend-popup').css('display', 'none');
    $('#gameend-filter').css('display', 'none');
});

/* ------- HOW TO PLAY PAGE -------- */

$('#instructions_btn').click(evt => {
    $('#instructions-popup').css('display', 'block');
    $('#instructions-filter').css('display', 'block');
});

$('#instructions-filter').click(evt => {
    $('#instructions-popup').css('display', 'none');
    $('#instructions-filter').css('display', 'none');
});

$('#instructions-close').click(evt => {
    $('#instructions-popup').css('display', 'none');
    $('#instructions-filter').css('display', 'none');
});


/* -------- OPTIONS PAGE -------- */

let oRadio = document.forms[0].elements['difficulty'];

let temp_size = 0;
let temp_mines = 0;

setDefaultCheckedValue(DEFAULT_DIFFICULTY)

$('#option-btn').click(evt => { // show menu when settings_button.click
    showGameOptions(true);
    setDefaultCheckedValue(DEFAULT_DIFFICULTY) //  set form option to current difficulty
    temp_size = CURRENT_SIZE;
    temp_mines = CURRENT_MINES;
    $('#custom-size').html(temp_size);
    $('#custom-mines').html(temp_mines);
});

$('#selector-filter').click(evt => { //if click outside of box -> close menu
    showGameOptions(false);
});

$('#difficulty-close').click(evt => { // exit menu
    showGameOptions(false);
});

$('#save-difficulty-btn').click(evt => { // bind save button to save difficulty and execute
    CURRENT_SIZE = temp_size;
    CURRENT_MINES = temp_mines;
    resetGame(CURRENT_SIZE, CURRENT_MINES);
    showGameOptions(false);
});

$('#custom-size-add').click(evt => {
    temp_size += 1;
    $('#custom-size').html(temp_size);
    uncheckAllRadio();
    checkIncrementButtons();
});

$('#custom-size-minus').click(evt => {
    temp_size -= 1;
    $('#custom-size').html(temp_size);
    uncheckAllRadio();
    checkIncrementButtons();
});

$('#custom-mines-add').click(evt => {
    temp_mines += 1;
    $('#custom-mines').html(temp_mines);
    uncheckAllRadio();
    checkIncrementButtons();

});

$('#custom-mines-minus').click(evt => {
    temp_mines -= 1;
    $('#custom-mines').html(temp_mines);
    uncheckAllRadio();
    checkIncrementButtons();
});

function checkIncrementButtons() {
    $('#custom-size-minus').disabled = temp_size <= SIZE_MIN;
    $('#custom-size-add').disabled = temp_size >= SIZE_MAX;
    if (temp_mines > ((temp_size * temp_size) - 11)) {
        temp_mines = (temp_size * temp_size) - 11;
        $('#custom-mines').html(temp_mines);
        $('#custom-mines-add').disabled = true;
    } else {
        $('#custom-mines-add').disabled = temp_mines >= MINES_MAX;
    }
    $('#custom-mines-minus').disabled = temp_mines <= MINES_MIN;
}


$('#choice-easy').on('change', evt => {
    temp_size = 9;
    temp_mines = 10;
    $('#custom-size').html(temp_size);
    $('#custom-mines').html(temp_mines);
    checkIncrementButtons();
});

$('#choice-medium').on('change', evt => {
    temp_size = 16;
    temp_mines = 40;
    $('#custom-size').html(temp_size);
    $('#custom-mines').html(temp_mines);
    checkIncrementButtons();
});

$('#choice-hard').on('change', evt => {
    temp_size = 24;
    temp_mines = 99;
    $('#custom-size').html(temp_size);
    $('#custom-mines').html(temp_mines);
    checkIncrementButtons();
});


function showGameOptions(bool) { // whether show settings or not
    $('#selector-filter').css('display', bool ? 'block' : 'none');
    $('#difficulty-selector').css('display', bool ? 'block' : 'none');
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

function showGameEndMessage(state) { //
    const time = getTime();

    if (state == 1) {
        let isHighScore = validateHighScore(CURRENT_SIZE, CURRENT_MINES, time);
        $('#gameend-message').html(isHighScore) ? 'New High Score!' : 'You Win!';
        $('#show-score').html(secToMin(time));
        $('#show-highscore').html(secToMin(getHighScore(CURRENT_SIZE, CURRENT_MINES)));
    } else if (state == 0) {
        $('#gameend-message').html('Game Over!');
        $('#show-score').html(secToMin(time));
        $('#show-highscore').html(secToMin(getHighScore(CURRENT_SIZE, CURRENT_MINES)));
    }

    $('#ending-size').html(CURRENT_SIZE);
    $('#ending-mines').html(CURRENT_MINES);
    $('#gameend-popup').css('display', 'block');
    $('#gameend-filter').css('display', 'block');
}

$('#play-again-button').click(evt => {
    $('#gameend-popup').css('display', 'none');
    $('#gameend-filter').css('display', 'none');
    resetGame(CURRENT_SIZE, CURRENT_MINES);
});

/* MOBILE RIGHT_CLICK ALTERNATIVE */