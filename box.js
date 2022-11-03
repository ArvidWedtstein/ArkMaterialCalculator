const chalk = require('chalk');

module.exports = (padding = 4, string, color) => {
    var empty = " ";

    var line = "─";

    if (color) {
        var box = [
            `╭${line.repeat((padding*2)+string.length)}╮`,
            `│${empty.repeat((padding*2)+string.length)}│`,
            chalk`│${empty.repeat(padding)}{${color}${string}}${empty.repeat(padding)}│`,
            `│${empty.repeat((padding*2)+string.length)}│`,
            `╰${line.repeat((padding*2)+string.length)}╯`
        ];
    } else {
        var box = [
            `╭${line.repeat((padding*2)+string.length)}╮`,
            `│${empty.repeat((padding*2)+string.length)}│`,
            `│${empty.repeat(padding)}${string}${empty.repeat(padding)}│`,
            `│${empty.repeat((padding*2)+string.length)}│`,
            `╰${line.repeat((padding*2)+string.length)}╯`
        ]
    }
    

    return box;
}
