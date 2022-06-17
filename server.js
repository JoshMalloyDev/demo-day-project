require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const passport = require('passport')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const session = require('express-session')
const configDB = require('./config/database.js')
const cors = require('cors');

var db

const dbName = "demo";


mongoose.connect(configDB.url, (err, database)=>{
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db)
})

require('./config/passport')(passport)
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use(session({
  secret: 'rcbootcamp2022a',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

let PORT = 3000
app.listen(PORT);
console.log(`server is running on ${PORT}`)


app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('home.ejs', {messages: result})
  })
})

app.get('/login', function(req, res) {
  res.render('signUp.ejs');
  
});


// app.post('/createBudget', (req, res) => {
//    console.log(req.body, 'post')
//     db.collection('messages').insertOne({ 
//         budgetName: req.body.budgetName, 
//         totalBudget: req.body.totalBudget, 
//         moneySpent: req.body.moneySpent, 
//         remainingBalance: req.body.remainingBalance,
//     }, (err, result) => {
//     if (err) return console.log(err)
//      console.log(req.body)
//      res.redirect('/')
//    })
//   })
//   app.put('/checkItem', (req, res) => {
//  console.log(req.body)
 
//     db.collection('messages')
//     .findOneAndUpdate({ budgetName: req.body.budgetName}, {
//       $set: {
//         remainingBalance:req.body.remainingBalance
//       }
//     }, {
//       sort: {_id: -1},
//       upsert: true
//     }, (err, result) => {
//       if (err) return res.send(err)
//       res.send(result)
//     })
//   })
//   app.delete('/deleteBudget', (req, res) => {
//     db.collection('messages').findOneAndDelete({ budgetName: req.body.budgetName}, (err, result) => {
     
//       if (err) return res.send(500, err)
//       res.send('Message deleted!')
//     })
//   })