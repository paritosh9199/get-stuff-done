#!/usr/bin/env node
import symbol from 'log-symbols';
import fs from 'fs';
import clear from 'clear';
import path from 'path';
import { Color, Format } from './lib/color';

interface DATA_OBJECT {
  id: number;
  task: string;
  completed: boolean;
}

// eslint-disable-next-line no-unused-vars
enum Task { ALL, COMPLETE, INCOMPLETE }

class GetStuffDone {
  DATABASE_PATH: string = ''

  constructor() {
    this.setDatabasePath();
    this.init();
  }

  init() {
    if (!fs.existsSync(this.getDatabasePath())) {
      console.log(`${Color.yellow}Initialising storage.\n \nCreating ${Color.green}"db.json"${Color.yellow} file${Color.reset}\n`);
      this.setData([]);
    }
  }

  setDatabasePath() {
    console.log();
    if (!fs.existsSync(path.resolve(__dirname, 'settings.json'))) {
      fs.writeFileSync(path.resolve(__dirname, 'settings.json'), JSON.stringify({
        DATABASE_PATH: path.resolve(__dirname, 'db.json'),
      }));
      this.DATABASE_PATH = path.resolve(__dirname, 'db.json');
    } else {
      const contents = fs.readFileSync(this.DATABASE_PATH = path.resolve(__dirname, 'settings.json'));
      const data = JSON.parse(contents.toString());
      this.DATABASE_PATH = data.DATABASE_PATH;
    }
  }

  getDatabasePath() {
    return this.DATABASE_PATH;
  }

  printErr(err: string) {
    console.log(`${Color.red}${err}${Color.reset}`);
  }

  printSuccess(success: string) {
    console.log(`${Color.green}${success}${Color.reset}`);
  }

  getData(): DATA_OBJECT[] {
    const contents = fs.readFileSync(this.getDatabasePath());
    const data = JSON.parse(contents.toString());
    return data;
  }

  setData(data: DATA_OBJECT[]) {
    const dataString = JSON.stringify(data);
    fs.writeFileSync(this.getDatabasePath(), dataString);
  }

  usage() {
    const help = `
    ${Color.skyblue}Get Stuff Done${Color.reset}
    
    ${Color.yellow}A Simple CLI based todo app without any distractions for devs!
    
    ${Color.skyblue}Usage:
        ${Color.green}gdo ${Color.blue}<Action> <Task>
    
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
    `;

    console.log(help);
  }

  addTask(task: string) {
    let data: DATA_OBJECT[] = this.getData();

    data = this.reorderTask(data);

    data.push({ id: data.length + 1, task, completed: false });

    // set data
    this.setData(data);

    // list
    this.list();
  }

  checkTask(task: number) {
    const data = this.getData();

    // modify the data (toggle)
    data[task].completed = !data[task].completed;

    // set data
    this.setData(data);

    // list
    this.list();
  }

  deleteTask(task: number) {
    let data = this.getData();
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
  }

  deleteAllTask(mode = Task.ALL) {
    const data = this.getData();
    const d = [];

    for (let i = 0; i < data.length; i++) {
      if (mode === Task.ALL) { break; }

      if (mode === Task.INCOMPLETE) {
        if (!data[i].completed) {
          d.push(data[i]);
        }
      }
      if (mode === Task.COMPLETE) {
        if (data[i].completed) {
          d.push(data[i]);
        }
      }
    }

    if (data.length > 0 || d.length > 0) {
      if (mode === Task.ALL && d.length === 0) {
        this.printSuccess('Cleared all tasks.\n');
      } else if (mode === Task.COMPLETE && d.length > 0) {
        this.printSuccess('Cleared all completed tasks.\n');
      } else if (mode === Task.INCOMPLETE && d.length > 0) {
        this.printSuccess('Cleared all pending tasks.\n');
      }
    }
    // console.log({data,d})
    this.setData(d);

    this.list();
  }

  reorderTask(data: DATA_OBJECT[]) {
    for (let i = 0; i < data.length; i++) {
      data[i].id = i + 1;
    }
    return data;
  }

  list(taskList = Task.ALL) {
    const data = this.getData();
    let spaces = ' ';

    if (data.length >= 10 && data.length < 100) {
      spaces = '  ';
    } else if (data.length >= 100 && data.length < 1000) {
      spaces = '   ';
    }

    if (data.length > 0) {
      // print the list. using ANSI colors and formating
      console.log(`${Color.skyblue}${Format.bold}${Format.underline}Task list:${Format.reset}${Color.yellow}`);

      let s = spaces;
      data.forEach((task, index) => {
        if (
          (index + 1) / 10 === 1
          || (index + 1) / 10 === 10
          || (index + 1) / 10 === 100) {
          s = s.slice(1);
        }

        const template = `${Color.blue} ${task.id}.${s}${Color.purple}[${task.completed ? `${Color.green}${symbol.success}${Color.yellow}` : ' '}${Color.purple}] ${Color.yellow}`;
        if (taskList === Task.COMPLETE) {
          if (task.completed) {
            console.log(template, task.task);
          }
        } else if (taskList === Task.INCOMPLETE) {
          if (!task.completed) {
            console.log(template, task.task);
          }
        } else {
          console.log(template, task.task);
        }
      });

      console.log(`${Color.reset}`);
    } else {
      console.log(`${Color.red}No tasks found!!\n`);
      console.log(`${Color.yellow}Add tasks to get started!${Color.reset}`);
    }
  }

  processArgs() {
    let args = '';
    let i = 3;
    while (process.argv[i] != null || process.argv[i] !== undefined) {
      args += `${process.argv[i]} `;
      i++;
    }

    return args;
  }

  run() {
    const command = process.argv[2];
    const argument: any = process.argv[3];

    // this.init();
    clear();
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
        console.log(`${Color.red}Command not found..!${Color.reset}`);
        this.usage();
        break;
    }
  }
}

const i = new GetStuffDone();
i.run();
