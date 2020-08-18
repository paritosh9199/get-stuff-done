#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var log_symbols_1 = __importDefault(require("log-symbols"));
var fs_1 = __importDefault(require("fs"));
var clear_1 = __importDefault(require("clear"));
var path_1 = __importDefault(require("path"));
var color_1 = require("./lib/color");
// eslint-disable-next-line no-unused-vars
var Task;
(function (Task) {
    Task[Task["ALL"] = 0] = "ALL";
    Task[Task["COMPLETE"] = 1] = "COMPLETE";
    Task[Task["INCOMPLETE"] = 2] = "INCOMPLETE";
})(Task || (Task = {}));
var GetStuffDone = /** @class */ (function () {
    function GetStuffDone() {
        this.DATABASE_PATH = '';
        this.setDatabasePath();
        this.init();
    }
    GetStuffDone.prototype.init = function () {
        if (!fs_1.default.existsSync(this.getDatabasePath())) {
            console.log(color_1.Color.yellow + "Initialising storage.\n \nCreating " + color_1.Color.green + "\"db.json\"" + color_1.Color.yellow + " file" + color_1.Color.reset + "\n");
            this.setData([]);
        }
    };
    GetStuffDone.prototype.setDatabasePath = function () {
        console.log();
        if (!fs_1.default.existsSync(path_1.default.resolve(__dirname, 'settings.json'))) {
            fs_1.default.writeFileSync(path_1.default.resolve(__dirname, 'settings.json'), JSON.stringify({
                DATABASE_PATH: path_1.default.resolve(__dirname, 'db.json'),
            }));
            this.DATABASE_PATH = path_1.default.resolve(__dirname, 'db.json');
        }
        else {
            var contents = fs_1.default.readFileSync(this.DATABASE_PATH = path_1.default.resolve(__dirname, 'settings.json'));
            var data = JSON.parse(contents.toString());
            this.DATABASE_PATH = data.DATABASE_PATH;
        }
    };
    GetStuffDone.prototype.getDatabasePath = function () {
        return this.DATABASE_PATH;
    };
    GetStuffDone.prototype.printErr = function (err) {
        console.log("" + color_1.Color.red + err + color_1.Color.reset);
    };
    GetStuffDone.prototype.printSuccess = function (success) {
        console.log("" + color_1.Color.green + success + color_1.Color.reset);
    };
    GetStuffDone.prototype.getData = function () {
        var contents = fs_1.default.readFileSync(this.getDatabasePath());
        var data = JSON.parse(contents.toString());
        return data;
    };
    GetStuffDone.prototype.setData = function (data) {
        var dataString = JSON.stringify(data);
        fs_1.default.writeFileSync(this.getDatabasePath(), dataString);
    };
    GetStuffDone.prototype.usage = function () {
        var help = "\n    " + color_1.Color.skyblue + "Get Stuff Done" + color_1.Color.reset + "\n    \n    " + color_1.Color.yellow + "A Simple CLI based todo app without any distractions for devs!\n    \n    " + color_1.Color.skyblue + "Usage:\n        " + color_1.Color.green + "gdo " + color_1.Color.blue + "<Action> <Task>\n    \n    " + color_1.Color.dark_blue + "<Task> " + color_1.Color.reset + "is a task string.\n\n    " + color_1.Color.dark_blue + "<Action> " + color_1.Color.reset + "args: \n        " + color_1.Color.yellow + "\n        " + color_1.Color.yellow + "-a  : " + color_1.Color.reset + "Add a task " + color_1.Color.dark_blue + "<task>" + color_1.Color.reset + "\n              " + color_1.Color.yellow + "\"--add\", \"-a\"\n\n        " + color_1.Color.yellow + "-c  : " + color_1.Color.reset + "Mark/Unmark " + color_1.Color.dark_blue + "<task>" + color_1.Color.reset + " as complete/pending with " + color_1.Color.dark_blue + "<task number>" + color_1.Color.reset + ".\n              " + color_1.Color.yellow + "\"--check\", \"-c\"\n\n        " + color_1.Color.yellow + "-l  : " + color_1.Color.reset + "List all tasks.\n              " + color_1.Color.yellow + "\"--list\",\"--list-all\", \"-la\", \"-l\"\n\n        " + color_1.Color.yellow + "-lc : " + color_1.Color.reset + "List all completed tasks. \n              " + color_1.Color.yellow + "\"--completed\", \"--list-completed\", \"-lc\"\n\n        " + color_1.Color.yellow + "-lp : " + color_1.Color.reset + "List all pending tasks.\n              " + color_1.Color.yellow + "\"--list-pending\", \"-lp\"\n\n        " + color_1.Color.yellow + "-d  : " + color_1.Color.reset + "Delete " + color_1.Color.dark_blue + "<task>" + color_1.Color.reset + " with " + color_1.Color.dark_blue + "<task number>" + color_1.Color.reset + ".\n              " + color_1.Color.yellow + "\"--delete\", \"-d\"\n        \n        " + color_1.Color.yellow + "-da : " + color_1.Color.reset + "Delete all " + color_1.Color.dark_blue + "<task>" + color_1.Color.reset + ".\n              " + color_1.Color.yellow + "\"--delete-all\", \"-da\"\n        \n        " + color_1.Color.yellow + "-dc : " + color_1.Color.reset + "Delete all completed " + color_1.Color.dark_blue + "<task>" + color_1.Color.reset + ".\n              " + color_1.Color.yellow + "\"delete-completed\", \"-dc\"\n    \n        " + color_1.Color.yellow + "-dp : " + color_1.Color.reset + "Delete all pending " + color_1.Color.dark_blue + "<task>" + color_1.Color.reset + ".\n              " + color_1.Color.yellow + "\"--delete-pending\", \"-dp\"\n\n        " + color_1.Color.yellow + "-h  : " + color_1.Color.reset + "Toggle help.\n              " + color_1.Color.yellow + "\"--help\", \"-h\"\n              " + color_1.Color.reset + "\n    ";
        console.log(help);
    };
    GetStuffDone.prototype.addTask = function (task) {
        var data = this.getData();
        data = this.reorderTask(data);
        data.push({ id: data.length + 1, task: task, completed: false });
        // set data
        this.setData(data);
        // list
        this.list();
    };
    GetStuffDone.prototype.checkTask = function (task) {
        var data = this.getData();
        // modify the data (toggle)
        data[task].completed = !data[task].completed;
        // set data
        this.setData(data);
        // list
        this.list();
    };
    GetStuffDone.prototype.deleteTask = function (task) {
        var data = this.getData();
        // console.log(data)
        if (data.length > 0) {
            this.printSuccess('Cleared task successfully!\n');
        }
        // delete item
        data.splice(task, 1);
        // set data
        data = this.reorderTask(data);
        this.setData(data);
        // list
        this.list();
    };
    GetStuffDone.prototype.deleteAllTask = function (mode) {
        if (mode === void 0) { mode = Task.ALL; }
        var data = this.getData();
        var d = [];
        for (var i_1 = 0; i_1 < data.length; i_1++) {
            if (mode === Task.ALL) {
                break;
            }
            if (mode === Task.INCOMPLETE) {
                if (!data[i_1].completed) {
                    d.push(data[i_1]);
                }
            }
            if (mode === Task.COMPLETE) {
                if (data[i_1].completed) {
                    d.push(data[i_1]);
                }
            }
        }
        if (data.length > 0 || d.length > 0) {
            if (mode === Task.ALL && d.length === 0) {
                this.printSuccess('Cleared all tasks.\n');
            }
            else if (mode === Task.COMPLETE && d.length > 0) {
                this.printSuccess('Cleared all completed tasks.\n');
            }
            else if (mode === Task.INCOMPLETE && d.length > 0) {
                this.printSuccess('Cleared all pending tasks.\n');
            }
        }
        // console.log({data,d})
        this.setData(d);
        this.list();
    };
    GetStuffDone.prototype.reorderTask = function (data) {
        for (var i_2 = 0; i_2 < data.length; i_2++) {
            data[i_2].id = i_2 + 1;
        }
        return data;
    };
    GetStuffDone.prototype.list = function (taskList) {
        if (taskList === void 0) { taskList = Task.ALL; }
        var data = this.getData();
        var spaces = ' ';
        if (data.length >= 10 && data.length < 100) {
            spaces = '  ';
        }
        else if (data.length >= 100 && data.length < 1000) {
            spaces = '   ';
        }
        if (data.length > 0) {
            // print the list. using ANSI colors and formating
            console.log("" + color_1.Color.skyblue + color_1.Format.bold + color_1.Format.underline + "Task list:" + color_1.Format.reset + color_1.Color.yellow);
            var s_1 = spaces;
            data.forEach(function (task, index) {
                if ((index + 1) / 10 === 1
                    || (index + 1) / 10 === 10
                    || (index + 1) / 10 === 100) {
                    s_1 = s_1.slice(1);
                }
                var template = color_1.Color.blue + " " + task.id + "." + s_1 + color_1.Color.purple + "[" + (task.completed ? "" + color_1.Color.green + log_symbols_1.default.success + color_1.Color.yellow : ' ') + color_1.Color.purple + "] " + color_1.Color.yellow;
                if (taskList === Task.COMPLETE) {
                    if (task.completed) {
                        console.log(template, task.task);
                    }
                }
                else if (taskList === Task.INCOMPLETE) {
                    if (!task.completed) {
                        console.log(template, task.task);
                    }
                }
                else {
                    console.log(template, task.task);
                }
            });
            console.log("" + color_1.Color.reset);
        }
        else {
            console.log(color_1.Color.red + "No tasks found!!\n");
            console.log(color_1.Color.yellow + "Add tasks to get started!" + color_1.Color.reset);
        }
    };
    GetStuffDone.prototype.processArgs = function () {
        var args = '';
        var i = 3;
        while (process.argv[i] != null || process.argv[i] !== undefined) {
            args += process.argv[i] + " ";
            i++;
        }
        return args;
    };
    GetStuffDone.prototype.run = function () {
        var command = process.argv[2];
        var argument = process.argv[3];
        // this.init();
        clear_1.default();
        switch (command) {
            case '--add':
            case '-a':
                this.addTask(this.processArgs());
                break;
            case '--check':
            case '-c':
                this.checkTask(argument - 1);
                break;
            case '--delete':
            case '-d':
                this.deleteTask(argument - 1);
                break;
            case '--delete-all':
            case '-da':
                this.deleteAllTask(Task.ALL);
                break;
            case '--delete-completed':
            case '-dc':
                this.deleteAllTask(Task.COMPLETE);
                break;
            case '--delete-pending':
            case '-dp':
                this.deleteAllTask(Task.INCOMPLETE);
                break;
            case '--help':
            case '-h':
                this.usage();
                break;
            case '--list':
            case '--list-all':
            case '-la':
            case '-l':
                this.list(Task.ALL);
                break;
            case '--completed':
            case '--list-completed':
            case '-lc':
                this.list(Task.COMPLETE);
                break;
            case '--list-pending':
            case '-lp':
                this.list(Task.INCOMPLETE);
                break;
            case undefined:
                this.list(Task.ALL);
                break;
            default:
                console.log(color_1.Color.red + "Command not found..!" + color_1.Color.reset);
                this.usage();
                break;
        }
    };
    return GetStuffDone;
}());
var i = new GetStuffDone();
i.run();
