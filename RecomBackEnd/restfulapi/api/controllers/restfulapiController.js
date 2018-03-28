'use strict';

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
    
    var posts  = req.body.posts.data
    var likes = req.body.likes.data;

    console.log(posts.length);

    for(var i = 0; i < posts.length; i ++){
      tfidf.addDocument(posts[i]['message'])
    }

    console.log("===========ufc=============")

    tfidf.tfidfs('UFC', function(i, measure) {
      console.log('document #' + i + ' is ' + measure);
  });

    console.log("length");
    
    var person = 'x';
    
    console.log(likes[0]['name'])
    console.log(posts[0]['message'])

    /*addPersonToNeo4j(person);

    for (var i = 0; i < likes.length; i++){
      addHobbyToNeo4j(likes[i]['name']);
      createRelationship(person,likes[i]['name']);
    }
    */

    addUserToNeo4j('a')
    createRelationship('a', '0.23124', 'comedy')

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


exports.read_a_task = function(req, res) {
  Task.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.update_a_task = function(req, res) {
  Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
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