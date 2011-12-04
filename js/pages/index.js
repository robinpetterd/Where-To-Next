var watchid;
var currentcoords;
    
//tell the client where to connect
RPCconnect('/rpc');

/*call a jsonrpc function and hand it an object
  render the restult with a template and insert it into a html element
  make the element a modal dialog
*/

;

$(function(){
               
               //the url has ?4 then directed to the quest with the key 
               if(window.location.href.indexOf('?') != -1) {
                                //alert('yes there is url para');
				
                                var parArray = getUrlVars();
                                //alert(parArray[0]);
                                startQuest(parArray[0]);

                                
			} 
                        
                        /*
		* Get the URL var and takes the user to the current form for that performance.    
		* 
		*/ 			
		
		
                
});
            
function getUrlVars()
				{
					var pairs;
					var pairs = window.location.href.slice(window.location.href.indexOf('?') + 1);

					//the url might be ?p=4#Home so we make sure we just dealing bit before the #
					if (pairs.indexOf("#") != -1) {
						var firstArray = pairs.split('#'); //make that into array rid of it.
						var UrlVars = firstArray[0];    
					} else {
						var UrlVars = pairs[0];
					
						//just return the first param 
					}
					
					//window.console.log("url variables = " + UrlVars);					
						
					 var vars = [], hash;
					 var hashes = UrlVars.split('&');
					 
					 for(var i = 0; i < hashes.length; i++)
						{
							hash = hashes[i].split('=');
							vars.push(hash[0]);
							vars[hash[0]] = hash[1];
					}
					
					return vars;
					
			
			
		}
                
function listQuests() {
  //var inobj=$("#CreateQuestForm").serializeJSON()
  console.log('listQuests');
  RPCcall({
      funct:'listQuests', 
      //paramaters:{params:inobj},
      template:'#questLists_template',
      target:'#questLists',
  });

  return true; 
}

function startwatching() {
  watchid=navigator.geolocation.watchPosition(positionupdated, gpserror,  {enableHighAccuracy:true});
}

function positionupdated(position) {
   //alert(JSON.stringify(position.coords));
   currentcoords=position.coords;
   Pointsloop();
}

function gpserror(err) {
  alert(JSON.stringify(err));
}

function stopwatching() {
  navigator.geolocation.clearWatch(watchid);
}

function startQuest(key) {
  
  //where the code of score 
  ChangeCurrent(key);
  RPCcall({
      funct:'showQuest', 
      paramaters:{key:global_currentQuest},
      //url:'/rpcedit',
      template:'#playQuest_template',
      target:'#play',
      success: function(result) {
      
        global_currentQuestJSON = result;
        startwatching();
        jQT.goTo('#play');
    },
}); 
  return false; 
}

function Pointsloop() {
  //alert(JSON.stringify(getPoints()));
  var plist=getPoints();
  $('#pointlist').html('');
  for (i in plist) {
    //alert(JSON.stringify(i));
    //alert(JSON.stringify(plist[i]));
    plist[i].id=i;
    plist[i].distance=20;
    plist[i].heading=20;
    //alert(JSON.stringify(plist[i]));
    $('#pointlist').append($('#pointlist_template').tmpl(plist[i]));
  }
}

function show_pointdetails(id) {
  var plist=getPoints();
  $('#pointdetails').html($('#pointdetails_template').tmpl(plist[id]));
  
} 





