var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors')
//var expressValidator = require('express-validator');

var app = express();



//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));


//set static folders for things like css file has to be named index in said folder for my website
app.use(express.static(path.join(__dirname,'/../RecomCode/')));


app.listen(8000, function(){
    console.log('Server started on port 8000');
})


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../Recom/index.html'));
});



