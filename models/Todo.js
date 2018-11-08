const db = require('./db');

// declare a class named "Todo"
class Todo {
    //constructor(id, name, completed, user_id) {
    constructor(id, name, completed, user_id) {
        // define properties that are the names of the columns
        this.id = id;
        this.name = name;
        this.completed = completed;
        this.user_id = user_id;
    }

    //CREATE
    static add(name, completed, user_id) {
        return db.one(`insert into todos (name, completed, user_id)
            values ($1, $2, $3)
            returning id`,
            [name, completed, user_id])
        .then(data => {
            const t = new Todo(data.id, name, completed, user_id);
            return t;
        });
    }

    // RETRIEVE
    // example of grabbing all the rows 
    static getAll() {
        return db.any('select * from todos order by id')
        .then(todoArray => {
            // transform array of objects
            // into array of Todo instances
            const instanceArray = todoArray.map(todoObj => {
                const t = new Todo(todoObj.id, todoObj.name, todoObj.completed, todoObj.user_id);
                return t;
            });
            return instanceArray;
        });
    }

    // example of grabbing one row
    static getById(id){
        return db.one(`select * from todos where id = $1`, [id])
            .catch(err => {
                // Got nuthin'
                // console.log('you did not get a todo');
                return {
                    name: 'No todo found.'
                };   
            })
            .then(result => {
                const t = new Todo(result.id, result.name, result.completed, result.user_id);
                return t;
            })
    }

    static searchByName(name) {
        return db.any(`
            select * from todos
                where name ilike '%$1:raw%'
        `, [name])
    }
    
    //UDATE
    // Todo class method for updating the name of a todo
    static updateTodoName(id, name) {
        return db.result(`update todos
            set name=$2
        where id=$1`, [id, name]);
    }

    // Todo instance method for updating the name of the todo
    updateName(name) {
        this.name = name;
        return db.result(`
            update todos
                set name=$2
            where id=$1`,
            [this.id, name]);
    }

    // Todo class method for assigning a user to a todo
    static assignTodoToUser(todoId, userId) {
        return db.result(`
            update todos
                set user_id = $2
            where id = $1`,
            [todoId, userId]);
    }

    // Todo instance method for assigning a user to a todo
    assignUser(userId) {
        return db.result(`
            update todos
                set user_id = $2
            where id = $1`,
            [this.id, userId]
        );
    }

    // Todo class method for updating the completion status of a todo
    static updateCompleted(id, didComplete) {
        return db.result(`update todos 
            set completed=$2 
        where id=$1`, [id, didComplete]);
    }

    // Todo instance method for updating the completion status of a todo
    updateCompleted(didComplete) {
        return db.result(`update todos 
            set completed=$2 
        where id=$1`, [this.id, didComplete]);
    }
    
    // Todo class method for setting the completion status of a todo to true
    static markCompleted(id) {
        return db.result(`update todos 
            set completed=$2 
        where id=$1`, [id, true]);
    }

    // Todo instance method for setting the completion status of a todo to true
    markCompleted() {
        return db.result(`update todos 
            set completed=$2 
        where id=$1`, [this.id, true]);
    }
    
    // Todo class method for setting the completion status of a todo to false
    static markPending(id) {
        return db.result(`update todos 
            set completed=$2 
        where id=$1`, [id, false]);
    }

    // Todo instance method for setting the completion status of a todo to false
    markPending() {
        return db.result(`update todos 
        set completed=$2 
        where id=$1`, [this.id, false]);
    }
    
    
    // DELETE
    // Todo instance method for deleting the todo
    delete(){
        return db.result(`delete from todos
        where id = $1`, [this.id]);        
    }
    
    // Todo class method for deleting the specified todo
    static deleteById(id) {
        return db.result(`delete from todos
                        where id = $1`, [id]);
    }

}
    

module.exports = Todo;
// module.exports = {
//     add,
//     assignToUser,
//     deleteById,
//     getAll,
//     getById,
//     markCompleted,
//     markPending,
//     updateName,
// };



// CREATE
// function add(name, completed) {
//     return db.one(`insert into todos (name, completed)
//         values
//             ($1, $2)
//         returning id    
//     `, [name, completed])
// }


// RETRIEVE
// example of grabbing all the rows 
// function getAll() { 
//     return db.any('select * from todos');
// }

// // example of grabbing one row
// function getById(id){
//     return db.one(`select * from todos where id = $1`, [id])
//         .catch(err => {
//             // Got nuthin'
//             // console.log('you did not get a todo');
//             return {
//                 name: 'No todo found.'
//             };   
//         })
// }

//UDATE
// function assignToUser(todoId, userId) {
//     return db.result(`
//         update todos
//             set user_id = $2
//         where id = $1    
//     `, [todoId, userId]);
// }

// example of updating a row
// function updateName(id, name) {
//     return db.result(`update todos
//         set name=$2
//     where id=$1`, [id, name]);
// }

// function updateCompleted(id, didComplete) {
//     return db.result(`update todos 
//         set completed=$2 
//     where id=$1`, [id, didComplete])    
// }

// function markCompleted(id) {
//     // return updateCompleted(id, true);
//     return db.result(`update todos 
// 	                    set completed=$2 
// 	                where id=$1`, [id, true]);
// }

// function markPending(id) {
//     // return updateCompleted(id, false);
//     return db.result(`update todos 
// 	                    set completed=$2 
// 	                where id=$1`, [id, false]);
// }

// DELETE
// example of deleting a row
// function deleteById(id){
//     return db.result(`delete from todos where id = $1`, [id])
// }