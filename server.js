const express = require('express');
var exphbs  = require('express-handlebars');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

// load models
const Message = require('./models/message');
const app = express();

// load keys files
const keys = require('./config/keys');

// use body parser middleware

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// connect mLab mongoDB
mongoose.connect(keys.MongoDb).then(() => {
    console.log('MongoDB connected')
}).catch((err) => {
    console.log(err);
})
// port
const port = process.env.PORT || 3000;

// Set up view engine

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => { // access the route of express module
    res.render('home', {
        title:'Home'
    });

});

// about route
// takes two argument and the secont is optional and it is an object

app.get('/about', (req, res) => { 
    res.render('about', {
        title:'About'
    });

});

app.get('/contact', (req, res) => { 
    res.render('contact', {
        title:'Contact'
    });

});
// access post method
app.post('/contactUs', (req, res) => {
    console.log(req.body);
});

// access the listen method
app.listen(port,() => {
    console.log(`Server is conneted on port ${port}`);
});