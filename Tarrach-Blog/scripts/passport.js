

// Only use this route if your adding a user functionality to the website
const User = require('./models/user'); // Ensure correct path to your User model

// Configure passport-local to use user model for authentication
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Express session setup
app.use(require('express-session')({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
