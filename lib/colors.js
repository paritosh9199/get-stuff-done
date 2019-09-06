
//util function
function print_Formats() {
    for (var i = 1; i < 100; i++) {
        // if ((i > 30 && i < 37) || (i > 40 && i < 50) || (i > 89 && i < 97))
        console.log(` \x1b[${i}m :ABCDE:${i}:12345:\x1b[0m`)
    }
}
// console.log("\x1b[24m hey")

var Color = {
    "gray": "\x1b[90m",
    "red": "\x1b[91m",
    "green": "\x1b[92m",
    "yellow": "\x1b[93m",
    "blue": "\x1b[94m",
    "purple": "\x1b[95m",
    "skyblue": "\x1b[96m",
    "black": "\x1b[30m",
    "dark_red": "\x1b[31m",
    "dark_green": "\x1b[32m",
    "dark_yellow": "\x1b[33m",
    "dark_blue": "\x1b[34m",
    "dark_purple": "\x1b[35m",
    "dark_skyblue": "\x1b[36m",
    "reset": "\x1b[0m"
}

var Highlight = {
    "red": "\x1b[41m",
    "green": "\x1b[42m",
    "yellow": "\x1b[43m",
    "blue": "\x1b[44m",
    "purple": "\x1b[45m",
    "skyblue": "\x1b[46m",
    "white": "\x1b[47m",
    "white2": "\x1b[7m",
    "reset": "\x1b[0m",
}

var Format = {
    "bold": "\x1b[1m",
    "underline": "\x1b[4m",
    "reset": "\x1b[0m",
}

module.exports = { Color, Highlight, Format }

// console.log(Color)