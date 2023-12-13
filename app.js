if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

//mongo sanitize
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());

//helmet
// const helmet = require('helmet');
// app.use(helmet({ contentSecurityPolicy: false }));
// const scriptSrcUrls = [
//     "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );


app.use(express.urlencoded({ extended: true }));

//setting up public directory
app.use(express.static(path.join(__dirname, 'public')));

//requires for error(both are in 'utils' folder)
const ExpressError = require('./utils/ExpressError')
// const catchAsync = require('./utils/catchAsync')   ->>> used in routes folder

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Database connected!!")
    })
    .catch(err => {
        console.log(" MOngo Error!!");
        console.log(err);
    });

//for using templates for ejs which named as boilerplate in views/layouts
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//session setup
const session = require('express-session');
const sessionConfig = {
    name: 'berntalz',
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,     //this is used for security
        // secure: true,        
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

//      <--------------------------   SECTION   -----------------------------> 

//For using PASSPORT (npm i passport passport-local passport-local-mongoose) (user.js in /models)
const passport = require('passport');
const localStrategy = require('passport-local');
app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/user');
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//      <--------------------------   SECTION END  --------------------------> 

//flash
const flash = require('connect-flash');
app.use(flash());
app.use((req, res, next) => {
    //check if logged in
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;

    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//home
app.get('/', (req, res) => {
    res.render('home.ejs');
})

//      <--------------------------   SECTION   -----------------------------> 

//setting up router folder (restructuring)
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
const users = require('./routes/user')

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use('/', users);

//      <--------------------------   SECTION END  --------------------------> 

//error handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

//async error handler
//error template is in 'views/error.js'
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong!'
    res.status(statusCode).render('error', { err });  //'error' is the name of our ejs file
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})


