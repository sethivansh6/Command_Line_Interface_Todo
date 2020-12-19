#!/usr/bin/env node

const fs = require("fs");
const program = require("commander");

program.action(() => {
    console.log(`Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`);
});

program.command("help").action(() => {
    console.log(`Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`);
});

program
    .command("add [todo_item]")
    .description("# Add a new todo")
    .action((todo_item) => {
        if (!todo_item) {
            console.log("Error: Missing todo string. Nothing added!");
        } else {
            addTasks(todo_item);
        }
    });

program
    .command("ls")
    .description("# Show remaining todos")
    .action(() => {
        showTasks();
    });

program
    .command("del [NUMBER]")
    .description("# Delete a todo")
    .action((NUMBER) => {
        if (!NUMBER) {
            console.log("Error: Missing NUMBER for deleting todo.");
        } else {
            deleteTasks(NUMBER);
        }
    });

program
    .command("done [NUMBER]")
    .description("# Delete a todo")
    .action((NUMBER) => {
        if (!NUMBER) {
            console.log("Error: Missing NUMBER for marking todo as done.");
        } else {
            doneTasks(NUMBER);
        }
    });

program
    .command("report")
    .description("# Delete a todo")
    .action(() => {
        showReport();
    });

program.parse(process.argv);

function showTasks() {
    fs.readFile("todo.txt", "utf8", function(err, data) {
        if (err) {
            console.log("There are no pending todos!");
        } else {
            let ar = data.split("\n");
            if (data == "") {
                console.log("There are no pending todos!");
            }
            for (let i = ar.length - 2; i >= 0; i--) {
                console.log(`[${i + 1}] ${ar[i]}`);
            }
        }
    });
}

function addTasks(task) {
    fs.appendFile("todo.txt", task + "\n", (err) => {
        if (err) {
            console.error(err);
            return;
        } else {
            console.log(`Added todo: "${task}"`);
        }
    });
}

function deleteTasks(number) {
    if (isNaN(number) == true) {
        console.log("Wrong Input");
        return;
    }
    let num = Number(number);
    if (num < 1) {
        console.log(`Error: todo #${num} does not exist. Nothing deleted.`);
        return;
    }

    fs.readFile("todo.txt", function(err, data) {
        if (err) {
            console.log(`Error: todo #${num} does not exist. Nothing deleted.`);
        } else {
            let todoAr = data.toString().split("\n");
            if (num > todoAr.length - 1) {
                console.log(`Error: todo #${num} does not exist. Nothing deleted.`);
                return;
            }
            todoAr.splice(num - 1, 1);
            let content = "";
            for (let i = 0; i < todoAr.length - 1; i++) {
                content = content + todoAr[i] + "\n";
            }
            fs.writeFileSync("todo.txt", content);
            console.log(`Deleted todo #${num}`);
        }
    });
}

function doneTasks(number) {
    if (isNaN(number) == true) {
        console.log("Wrong Input");
        return;
    }
    let num = Number(number);
    if (num < 1) {
        console.log(`Error: todo #${num} does not exist.`);
        return;
    }

    fs.readFile("todo.txt", function(err, data) {
        if (err) {
            console.log(`Error: todo #${num} does not exist.`);
        } else {
            let todoAr = data.toString().split("\n");

            if (num > todoAr.length - 1) {
                console.log(`Error: todo #${num} does not exist.`);
                return;
            }
            let task = todoAr[num - 1];
            todoAr.splice(num - 1, 1);
            let date = getTime();
            let doneContent = `x ${date} ${task}`;
            let content = "";
            for (let i = 0; i < todoAr.length - 1; i++) {
                content = content + todoAr[i] + "\n";
            }
            fs.writeFileSync("todo.txt", content);
            fs.appendFile("done.txt", doneContent + "\n", (err) => {
                if (err) {
                    console.error(err);
                    return;
                } else {
                    console.log(`Marked todo #${num} as done.`);
                }
            });
        }
    });
}

function showReport() {
    let date = getTime();
    let pending;
    let data;
    try {
        data = fs.readFileSync("todo.txt");
        let k = data.toString().split("\n");
        pending = k.length - 1;
    } catch (err) {
        pending = 0;
        console.log(err);
    }
    let done;
    try {
        data = fs.readFileSync("done.txt");
        let k = data.toString().split("\n");
        done = k.length - 1;
    } catch (err) {
        done = 0;
    }
    console.log(`${date} Pending : ${pending} Completed : ${done}`);
}

function getTime() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    return year + "-" + month + "-" + date;
}