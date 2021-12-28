const path = require('path')

const express = require('express')

const mongoose = require('mongoose')

const dotenv = require('dotenv')

const morgan = require('morgan')

const exphbs = require('express-handlebars')

const methodOverride = require('method-override')
const passport = require('passport')

const session = require('express-session')
// if we refresh in dashboard page we get logged out so we have to store the session sin our databse for that we need this package
const MongoStore = require('connect-mongo') //we need sa sesion so passing this session here and keeping in mind that it is just below the session
const connectDB = require('./config/db')

// Load config

dotenv.config({ path: './config/config.env'})

// Passport config

require('./config/passport')(passport)


connectDB()

const app =  express()

// Body Praser

app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Method override

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))


// Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars Helpers

const { formatDate, stripTags, truncate , select, editIcon, } = require('./helpers/hbs')

// Handlebars (middleware)
app.engine('.hbs', exphbs({helpers: {
   formatDate, stripTags, truncate , select, editIcon
}, defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

// Sessions Middleware

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store:  MongoStore.create({mongoUrl: 'mongodb+srv://skbanubony387:skbanubony387@cluster0.k6xgm.mongodb.net/storyBooks?retryWrites=true&w=majority'})
    
  }))




//  Passport Middleware

app.use(passport.initialize())
app.use(passport.session())

// Set global var kind of a middleware to access the global user (especially for edit icon)

app.use(function (req, res, next){
    res.locals.user = req.user || null
    next()
})


// Static folder

app.use(express.static(path.join(__dirname, 'public')))

// Routes

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
const PORT = process.env.PORT || 3000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)