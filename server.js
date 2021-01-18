const express = require('express');
var exphbs  = require('express-handlebars');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const passport = require('passport');
const cookiedParser = require('cookie-parser');
const session = require('express-session');

// load models
const Message = require('./models/message');
const User = require('./models/user');
const app = express();

// load keys files
const keys = require('./config/keys');

// Load helpers
const {requireLogin, ensureGuest} = require('./helpers/auth');

// use body parser middleware

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configuration for authentication
app.use(cookiedParser());
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Make user global object

app.use((req,res, next) => {
    res.locals.user = req.user || null;
    next();
});

// load facebook strategy
require('./passport/facebook');

// Load google strategy
require('./passport/google');

// connect mLab mongoDB
mongoose.connect(keys.MongoDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected')
}).catch((err) => {
    console.log(err);
})

// port
const port = process.env.PORT || 3000;

// Set up view engine

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', ensureGuest, (req, res) => { // access the route of express module
    res.render('home', {
        title:'Home'
    });

});

// about route
// takes two argument and the secont is optional and it is an object

app.get('/about', ensureGuest,(req, res) => { 
    res.render('about', {
        title:'About'
    });

});

app.get('/contact', ensureGuest,(req, res) => { 
    res.render('contact', {
        title:'Contact'
    });

});

// facebook route
app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
}));

// google routes
app.get('/auth/google', passport.authenticate('google'));
app.get('auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
}));

app.get('/profile', requireLogin, (req, res) => {
    User.findById({id:req.user._id}).then((user) => {
        if (user) {
           user.online = true;
           user.save((err,user) => {
               if(err) {
                   throw err;
               } else {
                res.render('profile', {
                    title: 'profile',
                    user: user
                });
               }
           })
        }
    })
})
// log out route
app.get('/logout', (req, res) => {
    User.findById({id:req.user._id})
    .then((user) => {
        user.online = false;
        user.save((err,user) => {
            if(err) {
                throw err;
            } if(user) {
                req.logout();
                res.redirect('/');
            }
        })

    })
   
});
// access post method
app.post('/contactUs', (req, res) => {
    console.log(req.body);
    const newMessage = {
        fullname: req.body.fullname,
        email: req.body.email,
        message: req.body.message,
        date: new Date()
    }
    new Message(newMessage).save((err, message) => {
        if (err) {
            throw err;
        } else {
           Message.find({}).then((messages) => {
               if(messages) {
                   res.render('newmessage', {
                       tittle: 'Sent',
                       messages:messages
                   });
               } else{
                   res.render('noMessage', {
                       title: 'Not Found'
                   })
               }
           })
        }
    })
});

// access the listen method
app.listen(port,() => {
    console.log(`Server is conneted on port ${port}`);
});