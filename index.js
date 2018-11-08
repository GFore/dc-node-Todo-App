require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Configure body-parser to read data sent by HTML form tags
app.use(bodyParser.urlencoded({ extended: false }));

// Configure body-parser to read JSON bodies
app.use(bodyParser.json());

const Todo = require('./models/Todo');
const User = require('./models/User');

// Listen for a GET request
app.get('/users', (req, res) => {
    User.getAll()
        .then(allUsers => {
            res.send(allUsers);
        })
});

//Liset for a POST request
app.post('/users', (req, res) => {
    //console.log(req.body);
    //res.send('ok');
    const newUserName = req.body.name;
    User.add(newUserName)
        .then(theUser => {
            res.send(theUser);
        })
});

app.post('/users/:id(\\d+)', (req, res) => {
    const id = req.params.id;
    const newName = req.body.name;
    console.log(newName + " " + id);
    
    // get the user by their id
    User.getById(id)
        .then(theUser => {
            // call that user's updateName method
            theUser.updateName(newName)
                .then(result => {
                    if (result.rowCount === 1) {
                        res.send('nice');
                    } else {
                        res.send('oops');
                    }
                })
        })
});

// get individual user based on id from URL
app.get('/users/:id(\\d+)', (req, res) => {
    console.log(req.params.id);
    User.getById(req.params.id)
        .catch(err => {
            res.send({message: `no soup for you!`})
        })
        .then(userInfo => {
            userInfo.getTodos()
                .then(todoList => {
                    let todoUL = ``;
                    if (todoList.length > 0) {
                        todoList.forEach(t => {
                            todoUL += `<li>${t.name}</li>`;
                        });
                    } else {
                        todoUL = `<i>Nothing assigned yet!</i>`
                    }
                    res.send(`User ${userInfo.id}'s name is ${userInfo.name}. `
                        + `${userInfo.name}'s assigned todos:<br>`
                        + `<ul>${todoUL}</ul>`
                    );
                })
        })
});

// get all todos
app.get('/todos', (req, res) => {
    Todo.getAll()
        .then(allTodos => {
            let tbl = `<table border=1><tr><th style="width:20px">ID </th><th>TASK</th><th>OWNER ID</th><th>COMPLETED</th></tr>`;
            allTodos.forEach(todoList => {
                tbl += `<tr><td>${todoList.id}</td><td>${todoList.name}</td><td>${todoList.user_id}</td><td>${todoList.completed}</td></tr>`
            })
            tbl += `</table>`
            // res.send(allTodos);
            res.send(tbl);
        })
});

app.get('/todos/:id(\\d+)', (req, res) => {
    console.log(req.params.id);
    Todo.getById(req.params.id)
        .catch(err => {
            res.send({message: `bad format!`})
        })
        .then(todoInst => {
            res.send(`Todo # ${todoInst.id} is <b>${todoInst.name}</b>. It is assigned to `
                        + `User # ${todoInst.user_id} and <u>is `
                        + `${todoInst.completed ? "" : "<b>not</b> "}completed</u>.`
            );
        })
});

app.get('/todo/:id(\\d+)', (req, res) => {
    console.log(req.params.id);
    Todo.getById(req.params.id)
        .catch(err => {
            res.send({message: `bad format!`})
        })
        .then(todoInst => {
            User.getById(todoInst.user_id)
                .then(t => {
                    res.send(`Todo # ${todoInst.id} is <b>${todoInst.name}</b>. `
                                + `It is assigned to ${t.name} and <u>is `
                                + `${todoInst.completed ? "" : "<b>not</b> "}completed</u>.`
                    );
                })
        })
});


app.listen(3000, () => {
    console.log('Express app is ready');
})

function hide() {
// Todo.searchByName('all')
//     .then(todos => {
//         console.log(todos);
//     });

// User.getById(1)
//     .then(u => {
//         u.assignTodo(2);
//         return u;
//     })
//     .then(u => {
//         u.getTodos()
//         .then(todos => {
//             console.log(`${u.name} has ${todos.length} things todo`);
//             console.log(todos);
//         })
//     });

//User.assignToUser(2, 3);


//     .then(u => {
//         u.delete();
//     });

// User.deleteById(8);

// User.getAll()
//     .then(allUsers => {
//         allUsers.forEach(user => {
//             console.log(user.name);
//         });

//     })

// User.getById(1)
//     .then(userFromDB => {
//         console.log(userFromDB);
//         userFromDB.getTodos()
//             .then(todos => {
//                 console.log(todos);
//             })
//     });

// const beth = new User(2, 'beth');
// beth.getTodos()
//     .then(result => { console.log(result); })

// let newUsers = [
//     'jeff',
//     'brandy',
//     'zack',
//     'tasha',
//     'jenn',
//     'cori'
// ];

// newUsers.forEach(u => {
//     User.add(u)
//         .then(aNewUser => {
//             aNewUser.addTodo('do the thing');
//         })
// });


// Todo.add('call for help', false, 1)
//     .then(newTodo => console.log(newTodo));

// Todo.getAll()
//     .then(todoArr => {
//         todoArr.forEach(todoItem => {
//             console.log(todoItem);
//         });
//     });

// Todo.getById(3)
// .then(t => {
//         console.log(`Task ${t.name} belongs to user ${t.user_id}!`);
// });

// User.add('jeff')
// User.add('jeff')
// User.add('jeff')
//     .then(theNewUser => {
//         theNewUser.getTodos()
//             .then(todos => {
//                 console.log(`${theNewUser.name} has ${todos.length} things todo`);
//             })
//     })


// const skyler = new User('Skyler the Dog');
// const ahjuma = new User('Ahjuma the Impressive');

// // debugger;

// skyler.greet(ahjuma);
// ahjuma.greet(skyler);

// let u = User.findById(1);
// u.name = 'eileeeeeeen';
// u.save();

// User.deleteById('asdfasdfasf')
//     .then(result => { console.log(result); })

// Todo.deleteById(1)
//     .then(result => { console.log(result); })
// Todo.deleteById(1)
//     .then(result => { console.log(result); })

// User.getTodosForUser(3)
//     .then(result => { console.log(result); })

// Todo.assignToUser(2, 2)
//     .then(() => {
//         User.getTodosForUser(2)
//         .then(result => { console.log(result); }) 
//     })      

// Todo.assignToUser(5, 2)
//     .then(() => {
//         User.getTodosForUser(2)
//         .then(result => { console.log(result); })
//     })       
// Todo.assignToUser(3, 2)
//     .then(() => {
//         User.getTodosForUser(2)
//         .then(result => { console.log(result); })    
//     })           
// Todo.assignToUser(4, 5)
//     .then(() => {
//         User.getTodosForUser(2)
//         .then(result => { console.log(result); })
//     })    
// Todo.assignToUser(1, 5)
//     .then(() => {
//         User.getTodosForUser(2)
//         .then(result => { console.log(result); })    
//     })

// User.getAll()
//     .then(result => { console.log(result); })



// User.getAll()
//     .then(results => {
//         console.log(results);
//         console.log(`yep those were the users. cool.`)
//     })

// User.getById('chris')
//     .then(result => { console.log(result); })

// Todo.getById(2000000)
//     .then(result => { console.log(result); })

// User.add('jeff')
//     .then(result => {
//         console.log(result);
//     })

// Todo.add('walk the chewbacca', false)
//     .catch(err => {
//         console.log(err);
//     })
//     .then(result => {
//         console.log(result);
//     })



// User.updateName(6, 'JEEEEEEEEEEEEEEEf')
//     .then(result => {
//         console.log(result);
//     })

// Todo.markCompleted(1)
//     .then(result => {
//         console.log(result);
//     })



// User.deleteById(6)
//     .then(result => {
//         console.log(result.rowCount);
//     })

}