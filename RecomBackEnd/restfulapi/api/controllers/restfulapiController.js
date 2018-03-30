'use strict';

var removePunctuation = require('remove-punctuation');

var neo4j = require('neo4j-driver').v1;

var TfIdf = require('node-tfidf');

var mongoose = require('mongoose'),
  User = mongoose.model('Users');

var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j','password'));
var session = driver.session();




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
      allWords = allWords.concat(currentWords)
      
    }    

    
    var allWordsJoined;
    allWordsJoined = allWords.join();
    tfidf.addDocument(allWordsJoined);
    
    var allWordsSet = new Set();
    var allWordsArray = [];


    for(var x = 0 ; x < allWords.length; x++){
      tfidf.tfidfs(allWords[x], function(i, measure) {
        allWordsArray.push(allWords[x])
        allWordsArray.push(measure)
        allWordsSet.add(allWordsArray);
        allWordsArray = [];

    });

    

    }

    let sortedArray = [];
    allWordsSet.forEach(v => sortedArray.push(v))
    sortedArray = sortedArray.sort(sortFunction2);
  
    var noDupArray = [];

   
    for(var x = 0; x < sortedArray.length-1; x ++){
      if(sortedArray[x+1][0] != sortedArray[x][0]){
        noDupArray.push(sortedArray[x])
      }
    }

    
    noDupArray = noDupArray.sort(sortFunction);
    
    var allSoc = [];




    makeAMatch(noDupArray).then(function(resolve){
      console.log('________________________');
      console.log(resolve + ' resolve')
      var newArr = []
      for(var m = 0; m < resolve.length; m++ ){
        if(resolve[m] == null){
          resolve[m] = 0;
        }
      }

      while(resolve.length) newArr.push(resolve.splice(0,2));
      console.log(newArr + ' newArr')

      res.send(newArr)
      
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

function makeAMatch(noDupArray){
  return new Promise(function(resolve, reject){
  var itemArray = [];
  var finalArr = []
  var newArr = []
  var count = 0;
  
  for( var x = 0; x < noDupArray.length ; x++ ){
  
  var str = "MATCH (a:Tag {name:'Name'})-[r]-(m:Activity) return r.weight, m.name;";
  var newStr = str.replace("Name", noDupArray[x][0]);
  //var x = 1

  
  console.log(newStr);
  session
  .run(newStr)
  .then(function(results){
    
    results.records.forEach(function(record){
      
      itemArray.push(record.get('m.name'))
      itemArray.push(record.get('r.weight'))
      //return(itemArray);
      
      

  })
  count ++;
  finalArr = finalArr.concat(itemArray)
  itemArray = []
  console.log(count + ' count')

  if(count == noDupArray.length){
    console.log(finalArr)
  resolve(finalArr);
  }
})
}
  })
.catch(function(err){
  console.log(err)
})
}
  


function sortFunction(a, b) {
  if (a[1] === b[1]) {
      return 0;
  }
  else {
      return (a[1] > b[1]) ? -1 : 1;
  }
}

function sortFunction2(a, b) {
  if (a[0] === b[0]) {
      return 0;
  }
  else {
      return (a[0] > b[0]) ? -1 : 1;
  }
}
