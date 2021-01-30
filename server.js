// const express = require('express');
// var exphbs  = require('express-handlebars');
// const bodyParser = require('body-parser')
// const mongoose = require('mongoose');
// const passport = require('passport');
// const cookiedParser = require('cookie-parser');
// const session = require('express-session');

// // load models
// const Message = require('./models/message');
// const User = require('./models/user');
// const app = express();

// // load keys files
// const keys = require('./config/keys');

// // Load helpers
// const {requireLogin, ensureGuest} = require('./helpers/auth');

// // use body parser middleware

// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());

// // configuration for authentication
// app.use(cookiedParser());
// app.use(session({
//     secret: 'mysecret',
//     resave: true,
//     saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// //Make user global object

// app.use((req,res, next) => {
//     res.locals.user = req.user || null;
//     next();
// });

// // load facebook strategy
// require('./passport/facebook');

// // Load google strategy
// require('./passport/google');

// // connect mongoDB
// mongoose.connect(keys.MongoDb, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('MongoDB connected')
// }).catch((err) => {
//     console.log(err);
// })

// // port
// const port = process.env.PORT || 3000;

// // Set up view engine

// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

// app.get('/', ensureGuest, (req, res) => { // access the route of express module
//     res.render('home', {
//         title:'Home'
//     });

// });

// // about route
// // takes two argument and the secont is optional and it is an object

// app.get('/about', ensureGuest,(req, res) => { 
//     res.render('about', {
//         title:'About'
//     });

// });

// app.get('/contact', ensureGuest,(req, res) => { 
//     res.render('contact', {
//         title:'Contact'
//     });

// });

// // facebook route ..
// app.get('/auth/facebook', passport.authenticate('facebook', {
//     scope: ['email']
// }));
// app.get('/auth/facebook/callback', passport.authenticate('facebook', {
//     successRedirect: '/profile',
//     failureRedirect: '/'
// }));

// // google routes
// app.get('/auth/google', passport.authenticate('google', {
//     scope: ['profile']
// }));

// app.get('/auth/google/callback', passport.authenticate('google', {
//     successRedirect: '/profile',
//     failureRedirect: '/'
// }));

// app.get('/profile', requireLogin, (req, res) => {
//     User.findById({id:req.user._id}).then((user) => {
//         if (user) {
//            user.online = true;
//            user.save((err,user) => {
//                if(err) {
//                    throw err;
//                } else {
//                 res.render('profile', {
//                     title: 'profile',
//                     user: user
//                 });
//                }
//            })
//         }
//     })
// })
// // log out route
// app.get('/logout', (req, res) => {
//     User.findById({id:req.user._id})
//     .then((user) => {
//         user.online = false;
//         user.save((err,user) => {
//             if(err) {
//                 throw err;
//             } if(user) {
//                 req.logout();
//                 res.redirect('/');
//             }
//         })

//     })
   
// });
// // access post method
// app.post('/contactUs', (req, res) => {
//     console.log(req.body);
//     const newMessage = {
//         fullname: req.body.fullname,
//         email: req.body.email,
//         message: req.body.message,
//         date: new Date()
//     }
//     new Message(newMessage).save((err, message) => {
//         if (err) {
//             throw err;
//         } else {
//            Message.find({}).then((messages) => {
//                if(messages) {
//                    res.render('newmessage', {
//                        tittle: 'Sent',
//                        messages:messages
//                    });
//                } else{
//                    res.render('noMessage', {
//                        title: 'Not Found'
//                    })
//                }
//            })
//         }
//     })
// });

// // access the listen method
// app.listen(port,() => {
//     console.log(`Server is conneted on port ${port}`);
// });

const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');

// Load models
const Message = require('./models/message');
const User = require('./models/user');
const app = express();

// load keys file
const Keys = require('./config/keys');

// Load Helpers
const {requireLogin,ensureGuest} = require('./helpers/auth');

// use body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// confirguration for authentication
app.use(cookieParser());
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}));

// connect flash
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
// setup express static folder to serve js, css files
app.use(express.static('public'));

// Make user global object
app.use((req,res, next) => {
    res.locals.user = req.user || null;
    next();
});
// load passport
require('./passport/facebook');
require('./passport/google');
require('./passport/local');
//connect to mLab MongoDB
// connect mongoDB
mongoose.connect(Keys.MongoDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected')
}).catch((err) => {
    console.log(err);
})

// port
 const port = process.env.PORT || 3000;
// mongoose.connect(Keys.MongoDB,{useNewUrlParser:true}).then(() => {
//     console.log('Server is connected to MongoDB');
// }).catch((err) => {
//     console.log(err);
// });
// // environment var for port
// const port = process.env.PORT || 3000;
// setup view engine
app.engine('handlebars',exphbs({
    defaultLayout:'main',
handlebars: allowInsecurePrototypeAccess(Handlebars) // handlebars runtime
}));
app.set('view engine','handlebars');

app.get('/',ensureGuest,(req,res) => {
    res.render('home', {
        title: 'Home'
    });
});

app.get('/about',ensureGuest,(req,res) => {
    res.render('about',{
        title:'About'
    });
});

app.get('/contact',ensureGuest,(req,res) => {
    res.render('contact',{
        title: 'Contact'
    });
});

app.get('/auth/facebook',passport.authenticate('facebook',{
    scope: ['email']
}));
app.get('/auth/facebook/callback',passport.authenticate('facebook',{
    successRedirect: '/profile',
    failureRedirect: '/'
}));

app.get('/auth/google',passport.authenticate('google',{
    scope: ['profile']
}));
app.get('/auth/google/callback',passport.authenticate('google',{
    successRedirect: '/profile',
    failureRedirect: '/'
}));
app.get('/profile',requireLogin,(req,res) => {
    User.findById({_id:req.user._id}).then((user) => {
        if (user) {
            user.online = true;
            user.save((err,user) => {
                if (err) {
                    throw err;
                }else{
                    res.render('profile', {
                        title: 'Profile',
                        user: user
                    });
                }
            })
        }
    });
});

// new Account
app.get('/newAccount',(req,res) => {
    res.render('newAccount',{
        title: 'Signup'
    });
});

// from signup page
app.post('/signup',(req,res) => {
    //console.log(req.body);
    let errors = [];

    if (req.body.password !== req.body.password2) {
        errors.push({text:'Password does Not match'});
    }
    if (req.body.password.length < 5) {
        errors.push({text:'Password must be at least 5 characters'});
    }
    if (errors.length > 0) {
        res.render('newAccount',{ // allows user to only type password in case of a mistake
            errors: errors,
            title: 'Error',
            fullname: req.body.username,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }else{
        User.findOne({email:req.body.email})
        .then((user) => {
            if (user) {
                let errors = [];
                errors.push({text:'Email already exist'});
                res.render('newAccount',{
                    title:'Signup',
                    errors:errors
                })
            }else{
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.password, salt);

                const newUser = {
                    fullname: req.body.username,
                    email: req.body.email,
                    password: hash
                }
                new User(newUser).save((err,user) => {
                    if (err) {
                        throw err;
                    }
                    if (user) {
                        let success = [];
                        success.push({text:'You successfully created account. You can login now'});
                        res.render('home',{
                            success: success
                        });
                    }
                });
                
            }
        });
    }
});
// email login
app.post('/login',passport.authenticate('local',{
    successRedirect:'/profile',
    failureRedirect: '/loginErrors'
}));
app.get('/loginErrors', (req,res) => {
    let errors = [];
    errors.push({text:'Incorrect user or password'});
    res.render('home',{
        errors:errors
    });
});
app.get('/logout',(req,res) => {
    User.findById({_id:req.user._id})
    .then((user) => {
        user.online = false;
        user.save((err,user) => {
            if (err) {
                throw err;
            }
            if (user) {
                req.logout();
                res.redirect('/');
            }
        })
    })
});

app.post('/contactUs',(req,res) => {
    console.log(req.body);
    const newMessage = {
        fullname: req.body.fullname,
        email: req.body.email,
        message: req.body.message,
        date: new Date()
    }
    new Message(newMessage).save((err,message) => {
        if (err) {
            throw err;
        }else{
            Message.find({}).then((messages) => {
                if (messages) {
                    res.render('newmessage', {
                        title: 'Sent',
                        messages:messages
                    });
                }else{
                    res.render('noMessage',{
                        title: 'Not Found'
                    });
                }
            });
        }
    });
});

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});
