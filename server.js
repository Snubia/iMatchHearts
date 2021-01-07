const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => { // access the route of express module
    res.send('Hey daters!');

});

// access the listen method
app.listen(port,() => {
    console.log(`Server is conneted on port ${port}`);
});