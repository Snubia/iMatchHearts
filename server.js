const express = require('express');
var exphbs  = require('express-handlebars');
const app = express();
const port = 3000;

// Set up view engine

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => { // access the route of express module
    res.render('home');

});

// about route

app.get('/about', (req, res) => { 
    res.render('about');

});

app.get('/contact', (req, res) => { 
    res.render('contact');

});

// access the listen method
app.listen(port,() => {
    console.log(`Server is conneted on port ${port}`);
});