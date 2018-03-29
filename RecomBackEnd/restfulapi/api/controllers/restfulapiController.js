'use strict';

var removePunctuation = require('remove-punctuation');

var neo4j = require('neo4j-driver').v1;

var TfIdf = require('node-tfidf');

var mongoose = require('mongoose'),
  User = mongoose.model('Users');

var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j','password'));
var session = driver.session();

exports.list_all_tasks = function(req, res) {
  Task.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};




exports.test_function = function(req, res){
    var newUser = new User();
    var tfidf = new TfIdf();
    var allDocument = [];
    var allWords = []
    

    var posts  = req.body.posts.data
    var likes = req.body.likes.data;

    
    
   for(var i = 0; i <likes.length; i++){
   
     var currentWords = []
     currentWords = removePunctuation(likes[i]['name'].toLowerCase()).split(" ");
     allWords = allWords.concat(currentWords)


   }

    for(var i = 0; i < posts.length; i ++){
      var currentWords = []
      currentWords = removePunctuation(posts[i]['message'].toLowerCase()).split(" ")
      
      //split(" ");
      allWords = allWords.concat(currentWords)
      
    }    

    
    var allWordsJoined;
    allWordsJoined = allWords.join();
    tfidf.addDocument(allWordsJoined);
    var isFound;
    //console.log(allWords);

       

    console.log("ALL DOCUMENTS ^^^^^^^^^")

    console.log("===========ufc=============")

    
    var allWordsSet = new Set();
    var allWordsArray = [];


    for(var x = 0 ; x < allWords.length; x++){
      tfidf.tfidfs(allWords[x], function(i, measure) {
        //console.log(allWords[x] +' ' + measure);
        allWordsArray.push(allWords[x])
        allWordsArray.push(measure)
        //console.log(allWordsArray)
        allWordsSet.add(allWordsArray);
        allWordsArray = [];

    });

    console.log(allWordsSet);

    }
  
    

   // console.log("length");
    
    var person = 'x';
    
   

    /*addPersonToNeo4j(person);

    for (var i = 0; i < likes.length; i++){
      addHobbyToNeo4j(likes[i]['name']);
      createRelationship(person,likes[i]['name']);
    }
    */

    //addUserToNeo4j('a')
    //createRelationship('a', '0.23124', 'comedy')

/*
    createRelationship("Arthur", "Xmen")
    newUser.save(function(err,user){
        if(err)
        {
            res.send(err);
            res.status(400);
        }
        else
        {
            console.log('made POST');
            //console.log(req.body.data);
        }

    })
    */
}


exports.create_a_task = function(req, res) {
  var new_task = new Task(req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};




exports.delete_a_task = function(req, res) {
  Task.remove({
    _id: req.params.taskId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};

function addUserToNeo4j(name){
  var str = 'CREATE(a:User{name:"Name"}) RETURN a'
  var newStr = str.replace("Name",name)
  console.log(newStr);
  session
  .run(newStr)
  .then(function(results){
      results.records.forEach(function(record){
          console.log(record._fields[0].properties)
      }) 
  })
  .catch(function(err){
      console.log(err)
  })
}

function addHobbyToNeo4j(name){
    var str = 'CREATE(a:Hobby{id:"name"}) RETURN a'
    var newStr = str.replace("name",name)
    console.log(newStr);
    session
    .run(newStr)
    .then(function(results){
        results.records.forEach(function(record){
            console.log(record._fields[0].properties)
        }) 
    })
    .catch(function(err){
        console.log(err)
    })
  }


function createRelationship(name, weight, tag){
  var str = "MATCH (a:User { name: 'Name' }),(b:Tag { name: 'TagInput' }) MERGE (a)-[r:usertag{weight:Weight}]->(b) RETURN a"
  var str = str.replace("Name", name)
  var str = str.replace("Weight", weight)
  var newStr = str.replace("TagInput", tag)
  console.log(newStr);
  session
  .run(newStr)
  .then(function(results){
      results.records.forEach(function(record){
          console.log(record._fields[0].properties)
      }) 
  })
  .catch(function(err){
      console.log(err)
  })

}

function checkIfAlreadyExists(catergory, itemName){
  var str = "MATCH (a:catergory {name:'itemName'}) return a.name";
  var str = str.replace("catergory", catergory);
  var newStr = str.replace("itemName", itemName);
  console.log(newStr);
  session
  .run(newStr)
  .then(function(results){
      console.log(results.records.length)
      return results.records.length
  })
  .catch(function(err){
      console.log(err)
  })

}


