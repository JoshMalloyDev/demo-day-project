const mongoose = require('mongoose')
const passport = require('passport')


module.exports = function(app, passport, db) {

    // normal routes ===============================================================
    
        // show the home page (will also have our login links)
        app.get('/', function(req, res) {
            res.render('home.ejs');
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
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
    
    // message board routes ===============================================================
    
        // app.post('/createAccount', (req, res) => {
        //     console.log(req.body)
        //   db.collection('messages').insertOne({userName: req.body.userName, password: req.body.password}, (err, result) => {
        //     if (err) return console.log(err)
        //     console.log('saved to database')
        //     res.redirect('/profile')
        //   })
        // })
    
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
            app.get('/login', function(req, res) {
                res.render('signUp.ejs', { message: req.flash('loginMessage') });
                
            });
    
            // process the login form
            app.post('/signUp', passport.authenticate('local-signup', {
                
                successRedirect : '/apple', // redirect to the secure profile section
                failureRedirect : '/', // redirect back to the signup page if there is an error
                failureMessage:true,
                failureFlash : true // allow flash messages
            }));
    
            // process the signup form
            app.post('/login', passport.authenticate('local-login', {
                successRedirect : '/testing', // redirect to the secure profile section
                failureRedirect : '/', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }));
    
    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future
    
        // local -----------------------------------
        app.get('/unlink/local', isLoggedIn, function(req, res) {
            var user            = req.user;
            user.local.email    = undefined;
            user.local.password = undefined;
            user.save(function(err) {
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
    