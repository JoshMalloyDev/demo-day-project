const mongoose = require('mongoose')
const passport = require('passport')
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
require('dotenv').config();

module.exports = function (app, passport, db) {

    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        res.render('home.ejs');
    });

    app.get('/profile', isLoggedIn, function (req, res) {
        console.log(req.user)
        res.render('profile.ejs', {
            email: req.user.local.email

        });
    });
    // app.get('/profile', isLoggedIn, function(req, res) {
    //        console.log(db)
    //         db.collection('messages').find().toArray((err, result) => {
    //           if (err) return console.log(err)
    //           res.render('profile.ejs', {
    //             user : req.user,
    //             messages: result
    //           })
    //         })
    //     });

    app.get('/dashboard', isLoggedIn, function (req, res) {
         db.collection('tasks').find({ // these values are not being set by the code
            user: req.user.local.email
        }).toArray((err, tasks) => {
            console.log("get little task", tasks)
               
             db.collection('completedTask').find({
                userEmail: req.user.local.email
            }).toArray((err, completedTasks) => {
                console.log("the big task", completedTasks)
                res.render('dashboard.ejs', {
                    tasks: tasks,
                    completedTask: completedTasks
                });  
            });  
        });   
    });

    app.get('/recipe', isLoggedIn, function (req, res) {
        db.collection('recipeSelectionHistory').find().toArray((err, randomSelection) => {
            console.log(randomSelection, "test")
            const randomIndex = Math.floor(Math.random() * randomSelection.length) 

            res.render('recipe.ejs', {
                randomMeal: randomSelection[randomIndex].randomMeal
                // logic is broken somewhere. 
            });
        })
    });
    app.get('/task', isLoggedIn, function (req, res) {
        res.render('task.ejs');
    });




    app.get('/music', isLoggedIn, function (req, res) {
        db.collection('tasks').find({
            user: req.user.local.email
        }).toArray((err, tasks) => {
            console.log("get music", tasks)

            res.render('music.ejs', {
                tasks: tasks
            });
        });
    });
    app.get('/features', isLoggedIn, function (req, res) {
        res.render('features.ejs')

    });




    // PROFILE SECTION =========================
    // app.get('/profile', isLoggedIn, function(req, res) {
    //   // console.log(db)
    //     db.collection('messages').find().toArray((err, result) => {
    //       if (err) return console.log(err)
    //       res.render('profile.ejs', {
    //         user : req.user,
    //         messages: result
    //       })
    //     })
    // });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // message board routes ===============================================================

    app.post('/submitRecipes', isLoggedIn, (req, res) => {

        db.collection('recipes').insertOne({ recipeDataForServer: req.body.recipeDataForServer }, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('/recipe')
        })
    })
    app.post('/postTask', isLoggedIn, (req, res) => {
        console.log({completedTask: req.body, userEmail: req.user.local.email})
        db.collection('completedTask').insertOne({userEmail: req.user.local.email, timerAmount: req.body.timerAmount, task:req.body.task }, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to completed task')
            // res.redirect('/recipe')
        })
    })
    app.post('/recordTask', isLoggedIn, (req, res) => {

        db.collection('tasks').insertOne({
            user: req.user.local.email,
            task: req.body.task,
            dateSubmited: new Date().toLocaleDateString(),
            selfCareData: {
                didSelfCare: req.body.didSelfCare,
                selfCareTask: req.body.selfCareTask,
                newSelfCare: req.body.newSelfCare
            }
        }, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('/task')
        })
    })
    app.post('/getMeal', (req, res) => {

        db.collection('recipes').find().toArray((err, recipes) => {
            if (err) return console.log(err)
            console.log('saved to database')
            let breakfastHours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            let lunchHours = [12, 13, 14, 15, 16, 17]; // breaking up the hours of the day
            let dinnerHours = [18, 19, 20, 21, 22, 23, 24];
            let whatTimeIsIt = ""
            if (breakfastHours.includes(req.body.currentHour)) whatTimeIsIt += "breakfast";
            if (lunchHours.includes(req.body.currentHour)) whatTimeIsIt += "lunch";
            if (dinnerHours.includes(req.body.currentHour)) whatTimeIsIt += "dinner";
            let potentialMeals = recipes.filter(recipe => whatTimeIsIt === recipe.recipeDataForServer.whatTimeIsIt)
            let randomNum = Math.floor(Math.random() * potentialMeals.length)
            let randomMeal = potentialMeals[randomNum]
            console.log(randomMeal, 'is this right')
            db.collection('recipeSelectionHistory').insertOne({
                randomMeal: randomMeal.recipeDataForServer
            })
            res.send({

            })
        })
    })

    // app.put('/messages', (req, res) => {
    //   db.collection('messages')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbUp:req.body.likes + 1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    // app.put('/thumbsDown', (req, res) => {
    //   console.log(req.body)
    //   db.collection('messages')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbUp:req.body.likes - 1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    // app.delete('/messages', (req, res) => {
    //   db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('signUp.ejs', { message: req.flash('loginMessage') });

    });

    // process the login form
    app.post('/signUp', passport.authenticate('local-signup', {

        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureMessage: true,
        failureFlash: true // allow flash messages
    }));

    // process the signup form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
