
var fs = require('fs');


//constants
var TASK_JSON_PATH = "./db.json";


function init() {
    //create file if it's present.
    if (!fs.existsSync(TASK_JSON_PATH)) {
        console.log("Initialising storage.\n Creating `db.json` file");
        setData([]);
    }

}

function getData() {
    //read file contents
    var contents = fs.readFileSync(TASK_JSON_PATH);

    //parse contents
    var data = JSON.parse(contents);

    return data;
}


function setData(data) {
    //strigify JSON
    var dataString = JSON.stringify(data);

    //write to  file

    fs.writeFileSync(TASK_JSON_PATH, dataString);
}

//display usage
function usage() {
    var help = `
    |TODO-APP|
    ----------
    This is a Simple todo app written for devs!
    Usage:
        todo <Action> <Task>
    
    <Task> is a task string.

    <Action> args: 
        -a  : Add a task <task>
              "add", "-a"
        -c  : Mark <task> as complete with <task number>.
              "check", "-c"
        -d  : Delete <task> with <task number>.
              "delete", "-d"
        -l  : List all tasks.
              "list","list-all", "-la", "-l"
        -lc : List all completed tasks. 
              "completed", "list-completed", "-lc"
        -lp : List all pending tasks.
              "list-pending", "-lp"
        -h  : Toggle help.
              "help", "-h"
    `

    console.log(help)
}

//add task
function add(task) {
    //get data
    var data = getData();

    //add item
    data.push({ task: task, completed: false });

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

    //delete item
    data.splice(task, task + 1);

    //set data
    setData(data);

    //list
    list();
}

//list all tasks
function list(all = 1) {

    //data
    var data = getData();

    if (data.length > 0) {
        //print the list. using ANSI colors and formating
        console.log("\x1b[93m\x1b[4mTask list:\x1b[24m");
        data.forEach(function (task, index) {
            if (all == 1) {
                console.log(index + 1 + ".", " [" + (task.completed ? "\x1b[92m✓\x1b[93m" : " ") + "] ", task.task);
            } else if (all == 2) {
                //only completed ones
                if (task.completed)
                    console.log(index + 1 + ".", " [" + (task.completed ? "\x1b[92m✓\x1b[93m" : " ") + "] ", task.task);
            } else {
                //remaining
                if (!task.completed)
                    console.log(index + 1 + ".", " [" + (task.completed ? "\x1b[92m✓\x1b[93m" : " ") + "] ", task.task);

            }
        });

    } else {
        console.log("\x1b[91mNo tasks added!!");
    }

}



var command = process.argv[2];
var argument = process.argv[3];

init();

switch (command) {
    case "add":
    case "-a":
        add(argument);
        break;
    case "check":
    case "-c":
        check(argument - 1);
        break;
    case "delete":
    case "-d":
        del(argument - 1);
        break;
    case "help":
    case "-h":
        usage();
        break;
    case "list": 
    case "list-all":
    case "-la":
    case "-l":
        list(1);
        break;
    case "completed": 
    case "list-completed":
    case "-lc":
        list(2);
        break;
    case "list-pending":
    case "-lp":
        list(0);
        break;
    case undefined:
        list();
        break;
    default:
        console.log("\x1b[91mCommand not found!!\x1b[0m");
        usage();
        break;
}