//try to send facebook data in the ajax call 

$(document).ready(function ()
{ 
    console.log('player one ready');
    $("#button").click( function()
	{

        FB.api('/me?fields=name,email,posts,likes', function(response){
            if(response && !response.error){
                //console.log(response);
                
                console.log('called fbAPIFromWithinClick');
                sendToServer(response);
            
            }
        });
        
        console.log('Clicked button');
 
            
    });
});
    
function checkLoginState() {
FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
});
}

function logout(){
    FB.logout(function(response){
        setElements(false);
    });
}


function setElements(isLoggedIn){
    if(isLoggedIn)
    {
        document.getElementById('logout').style.display = 'block';
        document.getElementById('profile').style.display = 'block';
        document.getElementById('fb-btn').style.display = 'none';
        document.getElementById('heading').style.display = 'none';

    }
    else
    {
        document.getElementById('logout').style.display = 'none';
        document.getElementById('profile').style.display = 'none';
        document.getElementById('fb-btn').style.display = 'block';
        document.getElementById('heading').style.display = 'block';


    }

}

//API GET REQUEST
function getInfo(){
    //pass more values here to get them (see graph explorer)
    FB.api('/me?fields=name,email,posts,likes', function(response){
        if(response && !response.error){
            console.log(response);
            var data = response;
            storeInfo(response);
            console.log('called fbAPINew');
            return response;
        }
    });
}

function storeInfo(user){
    var posts = user.posts.data;

    for(i = 0; i <posts.length ; i++){
        console.log(posts[i]['message']);
        console.log('Done');
    }
    console.log(posts);

}



function sendToServer(data){
    
        $.ajax({
            type: "POST",
            crossDomain: true,
            url: "http://localhost:3000/test",
            contentType: "application/json",
            data: JSON.stringify(data),
        }).then(
               console.log('made post'),
               console.log(data)
        ).fail(
                function() {
        console.log('error');
    }
    ) 
}


res.paging.next

