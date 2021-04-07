/* validate new highscore */

function validateHighScore(size, mines, time) {
    for (var score of HIGH_SCORES) {
        if (score['size'] == size && score['mines'] == mines) { // old highscore found
            if (time < score.time) {
                score['time'] = time; // replace original highscore
                return 1;
            } else {
                return 0; // nothing
            }
        }
    }

    // if old score not found
    if (HIGH_SCORES.length > HIGH_SCORE_LENGTH) {
        HIGH_SCORES.shift();
    }
    HIGH_SCORES.push({ 'size': size, 'mines': mines, 'time': time });
    return 1;
}

function getHighScore(size, mines) {
    for (var score of HIGH_SCORES) {
        if (score['size'] == size && score['mines'] == mines) { // old highscore found
            return score['time'];
        }
    }

    return undefined; // if highscore not found 
}

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
    if (s == undefined) {
        return '-- : --'
    }
    let min = Math.floor(s / 60);
    let sec = s - (min * 60);

    min = min.toString().length % 2 ? '0' + min : min;
    sec = sec.toString().length % 2 ? '0' + sec : sec

    return min + ' : ' + sec
}