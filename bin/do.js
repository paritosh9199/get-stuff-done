#!/usr/bin/env node
const symbol = require('log-symbols');
var fs = require('fs');
var clear = require('clear');
var { Color, Highlight, Format } = require('../lib/colors.js');

//constants
var DATABASE_PATH = "./db.json";


function init() {
    //create file if it's present.
    if (!fs.existsSync(DATABASE_PATH)) {
        console.log(`${Color.yellow}Initialising storage.\n Creating ${Color.green}"db.json"${Color.yellow} file${Color.reset}`);
        setData([]);
    }
}

function printErr(err) {
    console.log(`${Color.red}${err}${Color.reset}`);
}

function printSuccess(success) {
    console.log(`${Color.green}${success}${Color.reset}`);
}

function getData() {
    //read file contents
    var contents = fs.readFileSync(DATABASE_PATH);

    //parse contents
    var data = JSON.parse(contents);

    return data;
}


function setData(data) {
    //strigify JSON
    var dataString = JSON.stringify(data);

    //write to  file
    fs.writeFileSync(DATABASE_PATH, dataString);
}

//display usage
function usage() {
    var help = `
    ${Color.skyblue}Just-Do-It${Color.reset}
    
    ${Color.yellow}A Simple CLI based todo app without any distractions for devs!
    
    ${Color.skyblue}Usage:
        ${Color.green}do ${Color.blue}<Action> <Task>
    
    ${Color.dark_blue}<Task> ${Color.reset}is a task string.

    ${Color.dark_blue}<Action> ${Color.reset}args: 
        ${Color.yellow}
        ${Color.yellow}-a  : ${Color.reset}Add a task ${Color.dark_blue}<task>${Color.reset}
              ${Color.yellow}"--add", "-a"

        ${Color.yellow}-c  : ${Color.reset}Mark/Unmark ${Color.dark_blue}<task>${Color.reset} as complete/pending with ${Color.dark_blue}<task number>${Color.reset}.
              ${Color.yellow}"--check", "-c"

        ${Color.yellow}-l  : ${Color.reset}List all tasks.
              ${Color.yellow}"--list","--list-all", "-la", "-l"

        ${Color.yellow}-lc : ${Color.reset}List all completed tasks. 
              ${Color.yellow}"--completed", "--list-completed", "-lc"

        ${Color.yellow}-lp : ${Color.reset}List all pending tasks.
              ${Color.yellow}"--list-pending", "-lp"

        ${Color.yellow}-d  : ${Color.reset}Delete ${Color.dark_blue}<task>${Color.reset} with ${Color.dark_blue}<task number>${Color.reset}.
              ${Color.yellow}"--delete", "-d"
        
        ${Color.yellow}-da : ${Color.reset}Delete all ${Color.dark_blue}<task>${Color.reset}.
              ${Color.yellow}"--delete-all", "-da"
        
        ${Color.yellow}-dc : ${Color.reset}Delete all completed ${Color.dark_blue}<task>${Color.reset}.
              ${Color.yellow}"delete-completed", "-dc"
    
        ${Color.yellow}-dp : ${Color.reset}Delete all pending ${Color.dark_blue}<task>${Color.reset}.
              ${Color.yellow}"--delete-pending", "-dp"

        ${Color.yellow}-h  : ${Color.reset}Toggle help.
              ${Color.yellow}"--help", "-h"
              ${Color.reset}
    `

    console.log(help)
}

//add task
function add(task) {
    //get data
    var data = getData();

    data = reOrder(data);
    data.push({ id: data.length + 1, task: task, completed: false });

    //set data
    setData(data);

    //list
    list();
}

//check task
function check(task) {
    //get data
    var data = getData();

    //modify the data (toggle)
    data[task].completed = !data[task].completed;

    //set data
    setData(data);

    //list
    list();
}

//delete task
function del(task) {
    //get data
    var data = getData();
    // console.log(data)
    if (data.length > 0)
        printSuccess("Cleared task successfully!\n");

    //delete item
    data.splice(task, 1);

    //set data
    data = reOrder(data);
    setData(data);

    //list
    list();
}

function delAll(mode = 1) {

    // MODE 0 all
    // MODE 1 comp
    // MODE 2 PENDING
    var data = getData();
    var d = [];

    var count = 0;
    for (var i = 0; i < data.length; i++) {
        if (mode == 0)
            break;

        (mode == 1) ? ((!data[i].completed) ? (d.push(data[i])) : ("")) : ("");
        (mode == 2) ? ((data[i].completed) ? (d.push(data[i])) : ("")) : ("");
    }

    if (data.length > 0 || d.length > 0)
        if (mode == 0 && d.length == 0)
            printSuccess("Cleared all tasks.\n");
        else if (mode == 1 && d.length > 0)
            printSuccess("Cleared all completed tasks.\n")
        else if (mode == 2 && d.length > 0)
            printSuccess("Cleared all pending tasks.\n")
    // console.log({data,d})
    setData(d);

    list();

}

function reOrder(data) {
    for (var i = 0; i < data.length; i++) {
        data[i].id = i + 1;
    }
    // console.log(data)
    return data;
}

function list(all = 1) {

    var data = getData();
    var spaces = " ";

    if (data.length >= 10 && data.length < 100)
        spaces = "  "
    else if (data.length >= 100 && data.length < 1000)
        spaces = "   "

    if (data.length > 0) {
        //print the list. using ANSI colors and formating

        console.log(`${Color.skyblue}${Format.bold}${Format.underline}Task list:${Format.reset}${Color.yellow}`);
        var s = spaces;
        data.forEach(function (task, index) {
            if ((index + 1) / 10 == 1 || (index + 1) / 10 == 10 || (index + 1) / 10 == 100)
                s = s.slice(1)

            if (all == 1) {
                console.log(`${Color.blue} ` + task.id + "." + `${s}${Color.purple}` + "[" + (task.completed ? `${Color.green}${symbol.success}${Color.yellow}` : " ") + `${Color.purple}] ${Color.yellow}`, task.task);
            } else if (all == 2) {
                //only completed ones
                if (task.completed)
                    console.log(`${Color.blue} ` + task.id + "." + `${s}${Color.purple}` + "[" + (task.completed ? `${Color.green}${symbol.success}${Color.yellow}` : " ") + `${Color.purple}] ${Color.yellow}`, task.task);
            } else {
                //remaining
                //✓
                if (!task.completed)
                    console.log(`${Color.blue} ` + task.id + "." + `${s}${Color.purple}` + "[" + (task.completed ? `${Color.green}${symbol.success}${Color.yellow}` : " ") + `${Color.purple}] ${Color.yellow}`, task.task);
            }
        });

        console.log(`${Color.reset}`)

    } else {
        console.log(`${Color.red}No tasks found!!\n`);
        console.log(`${Color.yellow}Add tasks to get started!${Color.reset}`);
    }
}

var command = process.argv[2];
var argument = process.argv[3];
function argslist() {
    var args = ""
    var i = 3;
    while (process.argv[i] != null || process.argv[i] != undefined) {
        args += process.argv[i] + " "
        i++;
    }

    return args
}


function main() {
    init();
    clear();
    switch (command) {
        case "--add":
        case "-a":
            add(argslist());
            break;

        case "--check":
        case "-c":
            check(argument - 1);
            break;

        case "--delete":
        case "-d":
            del(argument - 1);
            break;

        case "--delete-all":
        case "-da":
            delAll(0);
            break;

        case "--delete-completed":
        case "-dc":
            delAll(1);
            break;

        case "--delete-pending":
        case "-dp":
            delAll(2);
            break;

        case "--help":
        case "-h":
            usage();
            break;

        case "--list":
        case "--list-all":
        case "-la":
        case "-l":
            list(1);
            break;

        case "--completed":
        case "--list-completed":
        case "-lc":
            list(2);
            break;

        case "--list-pending":
        case "-lp":
            list(0);
            break;

        case undefined:
            list();
            break;

        default:
            console.log(`    ${Color.red}Command not found..!${Color.reset}`);
            usage();
            break;
    }
}

main();