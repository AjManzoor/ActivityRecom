'use strict';

var neo4j = require('neo4j-driver').v1;

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
    
    var posts  = req.body.posts.data
    var likes = req.body.likes.data;

    var person = 'x';
    
    console.log(likes[0]['name'])
    console.log(posts[0]['message'])

    addPersonToNeo4j(person);

    for (var i = 0; i < likes.length; i++){
      addHobbyToNeo4j(likes[i]['name']);
      createRelationship(person,likes[i]['name']);
    }


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

function addPersonToNeo4j(name){
  var str = 'CREATE(a:Person{name:"Name"}) RETURN a'
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


function createRelationship(name, title){
  var str = 'MATCH (a:Person{name:"Name"}),(b:Hobby{id:"Title"}) MERGE (a)-[r:likes]->(b)'
  var str = str.replace("Name", name)
  var newStr = str.replace("Title", title)
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