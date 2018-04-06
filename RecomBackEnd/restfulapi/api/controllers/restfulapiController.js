'use strict';

var removePunctuation = require('remove-punctuation');

var bayes = require('bayes')

var classifier = bayes()

var neo4j = require('neo4j-driver').v1;

var TfIdf = require('node-tfidf');

var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j','password'));

var session = driver.session();

exports.wiki_tags = function(req, res){
    var tfidf = new TfIdf();
    var allDocument = [];
    var allWords = [];
    
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

    //console.log(allWordsSet)

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
   // console.log(noDupArray[1][1] + 'no dup')
    
    var allSoc = [];


    makeAMatch(noDupArray).then(function(resolve){
      //console.log('________________________');
      //console.log(resolve + ' resolve')
      var newArr = []
      for(var m = 0; m < resolve.length; m++ ){
        if(resolve[m] == null){
          resolve[m] = 1;
        }
      }

      while(resolve.length) newArr.push(resolve.splice(0,2));
      
      newArr = checkDuplicate(newArr)
      newArr = newArr.sort(sortFunction)
      //console.log(newArr);
      res.send(newArr)
      
    })

  
}

exports.news_tags = function(req, res){
  var tfidf = new TfIdf();
  var allDocument = [];
  var allWords = [];
  
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

  })
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

  makeAMatchNewsTags(noDupArray).then(function(resolve){
    var newArr = []

    while(resolve.length) newArr.push(resolve.splice(0,2));
    
    newArr = checkDuplicate(newArr)
    newArr = newArr.sort(sortFunction)
    res.send(newArr)    
  })
}

exports.hybrid_tags = function(req, res){
  var tfidf = new TfIdf();
  var allDocument = [];
  var allWords = [];
  
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

  })
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

  makeAMatch(noDupArray).then(function(resolve){
    var newArr = []

    while(resolve.length) newArr.push(resolve.splice(0,2));
    
    newArr = checkDuplicate(newArr)
    newArr = newArr.sort(sortFunction)

    return makeAMatchHybrid(noDupArray, newArr).then(function(resolve){
      //check the array from resolve
      resolve = checkDuplicate(resolve)
      resolve = resolve.sort(sortFunction)
      res.send(resolve)
      


    })


    //res.send(newArr)    
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
  
  
  //console.log(newStr);
  session
  .run(newStr)
  .then(function(results){
      results.records.forEach(function(record){
          var tempWeight = record.get('r.weight');
          //tempWeight = (tempWeight + noDupArray[x][1])/2
          itemArray.push(record.get('m.name'));
          itemArray.push(tempWeight);
  })
  count ++;
  finalArr = finalArr.concat(itemArray)
  
  itemArray = [];
  //console.log(count + ' count');

  if(count == noDupArray.length){
    //console.log(finalArr);
    resolve(finalArr);
  }
})
}
  })
.catch(function(err){
  console.log(err);
})
}
  
function makeAMatchNewsTags(noDupArray){
  return new Promise(function(resolve, reject){
  var itemArray = [];
  var finalArr = []
  var newArr = []
  var count = 0;
  
  for( var x = 0; x < noDupArray.length ; x++ ){
  
  var str = "MATCH (a:NewsTag {name:'Name'})-[r]-(m:Activity) return r.weight, m.name;";
  var newStr = str.replace("Name", noDupArray[x][0]);

  session
  .run(newStr)
  .then(function(results){
      results.records.forEach(function(record){
          itemArray.push(record.get('m.name'));
          itemArray.push(record.get('r.weight'));
  })
  count ++;
  finalArr = finalArr.concat(itemArray)
  itemArray = [];
  if(count == noDupArray.length){
    resolve(finalArr);
  }
})
}
  })
.catch(function(err){
  console.log(err);
})
}


function makeAMatchHybrid(noDupArray, activityList){
  return new Promise(function(resolve, reject){
  var itemArray = [];
  var finalArr = []
  var newArr = []
  var count = 0;
  
  for( var x = 0; x < noDupArray.length ; x++ ){
  
  var str = "MATCH (a:NewsTag {name:'Name'})-[r]-(m:Activity) return r.weight, m.name;";
  var newStr = str.replace("Name", noDupArray[x][0]);

  session
  .run(newStr)
  .then(function(results){
      results.records.forEach(function(record){
          itemArray.push(record.get('m.name'));
          itemArray.push(record.get('r.weight'));
  })
  count ++;
  finalArr = finalArr.concat(itemArray)
  itemArray = [];
  if(count == noDupArray.length){
    finalArr = finalArr.concat(activityList);
    resolve(finalArr);
  }
})
}
  })
.catch(function(err){
  console.log(err);
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
  //sorts it by the first element alphabetically for my array
  if (a[0] === b[0]) {
      return 0;
  }
  else {
      return (a[0] < b[0]) ? -1 : 1;
  }
}

function checkDuplicate(array){
  var combinedArr =[];
  var length = array.length;
  //sort the array so all the elements are alphabetical
  array.sort(sortFunction2)
  for(var x = 0; x < length; x++){
    if(array.length == 1){
      //if there's only one item left push it to combined array
      combinedArr.push(array[0])

    }
    else{
      //if the elements are the same add up their tfidf value and get rid of one them
    if(array[0][0] == array[1][0]){
      array[1][1] = array[0][1]+ array[1][1]
      array.shift();


    }
    else{
      //otherwise if there aren't any more copies get add it to combined array
      combinedArr.push(array[0])
      array.shift();
    }
  }
  }
  return combinedArr;
}