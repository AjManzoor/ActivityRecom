var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var expressValidator = require('express-validator');
var cors = require('cors');
var path = require('path');
var querystring = require('querystring');
var url = require('url');
var mainController = require('controllers');

//var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var apiRoutes = express.Router();


var bcrypt = require('bcrypt');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('config'); // get our config file




app.set('superSecret', config.secret);
var salt = bcrypt.genSaltSync(10);

//connected it to mongodb
var mongodbUri = 'monogodb://localhost/customerapp'
var db=mongoose.connect("mongodb://localhost/customerapp",{ useMongoClient: true });

//var db = mongoose.connection;
//checks if we're connected
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connected');
});

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressValidator());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.use(cors());



    //send from the mongo to the route(users) page as JSON
apiRoutes.get('/recipes', mainController.recipeController.getRecipes);
apiRoutes.post('/AddRecipe', mainController.recipeController.addRecipe)
apiRoutes.get('/checkUser', mainController.userController.checkIfExists);
apiRoutes.post('/user/login', mainController.userController.userLogin);
apiRoutes.post('/user/add', mainController.userController.addUser);
apiRoutes.get('/users', mainController.userController.getUsers);
apiRoutes.patch('/addLike', mainController.recipeController.addLike);
apiRoutes.get('/user', mainController.userController.getUser)

apiRoutes.delete('/deleteRecipe', mainController.recipeController.deleteRecipe);
apiRoutes.get('/recipe',mainController.recipeController.getSingleRecipe);


app.listen(3000, function(){
    console.log('API started on 3000');
});



//middleware for authorization all api routes that need authorization go under here
apiRoutes.use(function(req, res, next) {
    
      // check header or url parameters or post parameters for token
      var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
      // decode token
      if (token) {
    
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;    
            next();
          }
        });
    
      } else {
    
        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    
      }
    });


apiRoutes.delete('/deleteUser', mainController.userController.deleteUser);

apiRoutes.patch('/updateUsers', function(req,res){
    Users.findOneAndUpdate({
        _id:"59fddaba571de12ba81ffb07"
    },
    {$set: {first_name : "Joe"}},
    {upsert:true},
    function(err,newUser){
        if(err){
            console.log("Error");
        } else{
            console.log(newUser);
            var statusCode = 204;
            res.status(statusCode);
        }
    });
});

apiRoutes.patch('/addDislike', mainController.recipeController.addDislike);


//app.use('/api',apiRoutes);
app.use(apiRoutes);