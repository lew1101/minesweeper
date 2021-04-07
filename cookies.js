function setCookie(dict) { // dictionary as argument
    let cookie_string = '';
    for (key in dict) {
        cookie_string += key + '=' + dict[key] + ';'
    }
    document.cookie = cookie_string + 'path=/';
    console.log(cookie_string + 'path=/')
}

function getCookies() {
    let cookies = document.cookie.split(';');
    console.log(document.cookie);
    if (cookies.indexOf(0) != -1) {
        let dict = {};
        for (cookie of cookies) {
            let c = cookie.split('=');
            dict[c[0]] = c[1];
        }
        return dict;
    } else {
        return null;
    }
}

window.onbeforeunload = function() {
    let ci = { board_size: CURRENT_SIZE, board_mines: CURRENT_MINES, high_score: HIGH_SCORES };
    setCookie(ci);
}

let cookies = getCookies();
if (cookies == null) {
    SHOW_RULES = true;
} else {
    CURRENT_SIZE = cookies['board_size'];
    CURRENT_MINES = cookies['board_mines'];
    HIGH_SCORES = cookies['high_scores'];
}
console.log(cookies)