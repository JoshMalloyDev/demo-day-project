
const ObjectId = require("mongodb").ObjectId;

module.exports = function (app, passport, db) {

    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        res.render('home.ejs');
    });

    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            email: req.user.local.email

        });
    });

    app.get('/manage', isLoggedIn, function (req, res) {
        db.collection('tasks').find({ user: req.user.local.email }).toArray((err, tasks) => {


            res.render('manage.ejs', {
                email: req.user.local.email,
                tasks
            })
        });
    });

    app.delete('/deleteTask', (req, res) => {
        console.log(req.body.id, req.user.local.email)
        db.collection('tasks').deleteOne({ _id: ObjectId(req.body.id) }, (err, result) => {
            if (err) return res.send(500, err)
            res.send('task deleted!')
        })
    })

    app.get('/dashboard', isLoggedIn, function (req, res) {
        db.collection('tasks').find({ // these values are not being set by the code
            user: req.user.local.email
        }).toArray((err, tasks) => {

            db.collection('completedTask').find({
                userEmail: req.user.local.email
            }).toArray((err, completedTasks) => {

                let selfCareCount = 0
                tasks.forEach((task) => {
                    selfCareCount += task.selfCareData.amountOfTimesDone
                })

                res.render('dashboard.ejs', {
                    tasks: tasks,
                    completedTask: completedTasks,
                    user: req.user,
                    selfCareCount: selfCareCount
                });
            });
        });
    });

    app.get('/recipe', isLoggedIn, function (req, res) {
        console.log(req.user.local.email)
        db.collection('recipeSelectionHistory').find({ email: req.user.local.email }).toArray((err, randomSelection) => { //getting the current hour 
            const currentHour = new Date().getHours()
            const filteredArr = randomSelection.filter((recipe) => {
                if (currentHour <= 11 && currentHour >= 1) {
                    if (recipe.randomMeal.whatTimeIsIt === 'breakfast') {
                        return recipe
                    }
                } else if (currentHour >= 12 && currentHour < 17) {
                    if (recipe.randomMeal.whatTimeIsIt === 'lunch') {
                        return recipe
                    }
                } else if (currentHour >= 17 && currentHour <= 24) {
                    if (recipe.randomMeal.whatTimeIsIt === 'dinner') {
                        return recipe

                    }

                }
            })
            console.log("looking for filteredArr", filteredArr)
            const randomIndex = Math.floor(Math.random() * filteredArr.length)


            res.render('recipe.ejs', {
                randomMeal:filteredArr[randomIndex] ? filteredArr[randomIndex].randomMeal : null

            });
        })
    });
    app.get('/task', isLoggedIn, function (req, res) {
        db.collection('tasks').find({ user: req.user.local.email }).toArray((err, tasks) => {
           let selfCareTasks = tasks.map((task)=>{ 
                let test= task.selfCareData.selfCareTask
                return test  
            })

           
            res.render('task.ejs', {
                tasks:new Set(selfCareTasks)

            })
        });
    });

    app.get('/music', isLoggedIn, function (req, res) {
        db.collection('tasks').find({
            user: req.user.local.email
        }).toArray((err, tasks) => {

            res.render('music.ejs', {
                tasks: tasks
            });
        });
    });
    app.get('/features', function (req, res) {
        res.render('features.ejs')

    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // message board routes ===============================================================

    app.post('/submitRecipes', isLoggedIn, (req, res) => {

        db.collection('recipes').insertOne({ recipeDataForServer: req.body.recipeDataForServer, email: req.user.local.email }, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('/recipe')
        })
    })
    app.put('/postTask', isLoggedIn, (req, res) => {
        let minutes = Number(req.body.timerAmount)
        db.collection('tasks').findOneAndUpdate({ user: req.user.local.email, task: req.body.task },
            {
                $inc: {
                    timesCompleted: 1,
                    totalMinutesIttook: minutes,
                    'selfCareData.amountOfTimesDone': 1
                },
            },
        )
        console.log('saved to completed task')
    })
    app.post('/recordTask', isLoggedIn, (req, res) => { 
        let selfCareTask = req.body.newSelfCareTask
        
        db.collection('tasks').insertOne({
            user: req.user.local.email,
            task: req.body.task,
            dateSubmited: new Date().toLocaleDateString(),
            selfCareData: {
                didSelfCare: req.body.didSelfCare,
                selfCareTask: (req.body.selfCareTask=== "none")? selfCareTask:req.body.selfCareTask,
                amountOfTimesDone: 0,
            },
            timesCompleted: 0,
            totalMinutesIttook: 0

        }, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('/task')
        })
    })
    app.post('/getMeal', isLoggedIn, (req, res) => {
        db.collection('recipes').find().toArray((err, recipes) => {
            if (err) return console.log(err)

            let breakfastHours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            let lunchHours = [12, 13, 14, 15, 16]; // breaking up the hours of the day
            let dinnerHours = [17,18, 19, 20, 21, 22, 23, 24];
            let whatTimeIsIt = ""

            if (breakfastHours.includes(req.body.currentHour)) whatTimeIsIt += "breakfast";
            if (lunchHours.includes(req.body.currentHour)) whatTimeIsIt += "lunch";
            if (dinnerHours.includes(req.body.currentHour)) whatTimeIsIt += "dinner";

            let potentialMeals = recipes.filter(recipe => whatTimeIsIt === recipe.recipeDataForServer.whatTimeIsIt)
            let randomNum = Math.floor(Math.random() * potentialMeals.length)
            let randomMeal = potentialMeals[randomNum]
            console.log(randomMeal, 'random')

            db.collection('recipeSelectionHistory').insertOne({
                randomMeal: randomMeal.recipeDataForServer,
                email: req.user.local.email
            })
        })
    })

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
