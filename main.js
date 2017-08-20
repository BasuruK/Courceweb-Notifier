/**
 * Created by Basuru Kusal on 8/10/2016.
 */

const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
var db = require('./database.js');

app.on('ready', function () {

   let window = new BrowserWindow({
       width: 600,
       height:350,
       resizable: false,
       frame: false,
       show: false
   });

    let mainWindow = new BrowserWindow({
        width: 1300,
        height: 730,
        show: false
    });

    var loginWindow = new BrowserWindow({
        width:900,
        height:800,
        show: false,
    });

    //Load the database
    db.prototype= db.loadDatabase();
    //check if the user is already existing in the database
    if(db.countUsers() == 1)
    {
        mainWindow.loadURL('file://' + __dirname + '/app/mainWindow.html');
        mainWindow.show();
    }
    else
    {
        window.loadURL('file://' + __dirname + '/app/index.html');
       //window.webContents.openDevTools();
        window.show();
    }

    //ipc calls
    ipcMain.on('close-main-window', (event,arg) => {
        window.close();
        app.exit(0);
    });


    //when user logs in first time
    ipcMain.on('login-to-site', (event,arg) => {

        //Save info to database
        db.addNewUser(arg.UserID,arg.Password);
        db.save();

        loginWindow.loadURL("http://courseweb.sliit.lk/login/index.php");
        loginWindow.webContents.openDevTools();

        //Login to course web using the login details provided
        loginWindow.webContents.executeJavaScript('document.getElementById("username").value ="'+ arg.UserID +'"');
        loginWindow.webContents.executeJavaScript('document.getElementById("password").value = "'+ arg.Password +'"');
        loginWindow.webContents.executeJavaScript('document.getElementById("login").submit()');

        window.hide();
        mainWindow.loadURL('file://' + __dirname + '/app/mainWindow.html');
        mainWindow.show();


        // Load the windows here
        //loginWindow.webContents.loadURL('http://courseweb.sliit.lk/course/view.php?id=67');
        //loginWindow.show();
    });

    //Exit upon closing the login window { delete this when product is complete }
    loginWindow.on('close', (event) => {
        event.preventDefault();
        app.exit(0);
    });

    //Exit upon closing the main window
    mainWindow.on('close', (event) => {
        //event.preventDefault();
        app.exit(0);
    });

    //Exit upon main Window logout
    ipcMain.on('logout-on-mainWindow', function (event,arg) {
        mainWindow.close();
        app.exit(0);
    });

    //MainWindow Button Clicks
    //My Courses button click
    ipcMain.on('myCourses-click', function (event,arg) {
        mainWindow.loadURL('file://' + __dirname + '/app/myCourses.html');
    });

});

