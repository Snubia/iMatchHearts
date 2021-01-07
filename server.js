const express = require('express');
var exphbs  = require('express-handlebars');
const app = express();
const port = 3000;

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

// access the listen method
app.listen(port,() => {
    console.log(`Server is conneted on port ${port}`);
});