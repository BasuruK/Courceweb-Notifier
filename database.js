var fs =  require('fs');
var sql = require('sql.js');
var fileBuffer = fs.readFileSync('./database/database.sqlite');

//Load the db
var db = new sql.Database(fileBuffer);

module.exports = {
    save: save,
    addNewUser: addNewUser,
    countUsers: countUsers,
    createUserTable: createUserTable,
    getUserID: getUserID,
    deleteUser: deleteUser,
    closeDatabase: closeDatabase,
    loadDatabase: loadDatabase,
};


//create a new database
function createUserTable()
{
    console.log("Creating users table");
    db.run("CREATE TABLE user (userID String, password String)");
}

//count the user table
function countUsers()
{
    var stmt = db.prepare("SELECT COUNT(*) as 'count' FROM user");
    while (stmt.step())
    {
        return parseInt(stmt.get());
    }
}

//Save the database to sqlite file
function save()
{
    console.log("Saving Data");
    var data = db.export();
    var buffer = new Buffer(data);
    fs.writeFileSync("./database/database.sqlite",buffer);
    closeDatabase();
    loadDatabase();
}

//Close the database
function closeDatabase() {
    db.close();
}

//Load the database
function loadDatabase() {
    fileBuffer = fs.readFileSync('./database/database.sqlite');
    db = new sql.Database(fileBuffer);
    return db
}

//Insert a new user
function addNewUser(userID, password)
{
    db.run("INSERT INTO user VALUES('"+ userID +"', '"+ password +"');");
}

//Extracts the username
function getUserID()
{
    var stmt = db.prepare("SELECT userID FROM user");
    while (stmt.step())
    {
        return stmt.get().toString();
    }
}

//delete user
function deleteUser() {
    db.run("DELETE FROM user");
    save();
}