var watchid;
var currentcoords;
var howclosedoineedtobe=5;
var currentscore=0;
var plist;
startwatching();


    
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
      success: function() {jQT.goTo('#View');}
  });
  
  return false; 
}

function startwatching() {
  watchid=navigator.geolocation.watchPosition(positionupdated, gpserror,  {enableHighAccuracy:true});
}

function positionupdated(position) {
   console.log(JSON.stringify(position.coords));
   currentcoords=position.coords;
   try {
    Pointsloop();
  } catch(e) {
    
  }
}

function gpserror(err) {
  console.log(JSON.stringify(err));
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
        plist=getPoints();
        Pointsloop();
        jQT.goTo('#play');
    },
}); 
  return false; 
}

function Pointsloop() {
	

    if (currentcoords) {
			//global_currentCoords = coords; 
			//$('.latitude').empty().val(coords.latitude);
			//$('.longitude').empty().val(coords.longitude);
			//var plist=getPoints();
			//alert(JSON.stringify(coords.latitude));
			var p1from = new LatLon(currentcoords.latitude, currentcoords.longitude);
			for (i in plist) {
				//alert(JSON.stringify(i));
				//alert(JSON.stringify(plist[i].latitude));
				var p2to = new LatLon(plist[i].latitude, plist[i].longitude);
				plist[i].distance = p1from.distanceTo(p2to);
        if (plist[i].distance<0.8) {
          plist[i].distancedesc=Math.round(plist[i].distance*1000) + " m";  
        } else {
          parseFloat(plist[i].distancedesc=plist[i].distance).toFixed(1) + " km";
        }
				plist[i].heading=parseInt(p1from.bearingTo(p2to));
        plist[i].shortbearing=Math.round((plist[i].heading-22.5)/45);
        plist[i].bearingdesc=bearingarray[plist[i].shortbearing];
        
				$('#pointlist').append($('#pointlist_template').tmpl(plist[i]));
        if (plist[i].distance<(currentcoords.accuracy+howclosedoineedtobe)/1000) {
          plist[i].done="true";
          //alert('yay');
        }
        
			}
		  console.log(plist); 
		} else {
			alert('Device not capable of geo-location.');
		}
    
    return false;

  //alert(JSON.stringify(getPoints()));
  
}


function show_pointdetails(id) {
  var plist=getPoints();
  $('#pointdetails').html($('#pointdetails_template').tmpl(plist[i]));
  //alert(id+','+plist[id].latitude+','+plist[id].longitude);
	var myOptions = {
	  center: new google.maps.LatLng(plist[id].latitude, plist[id].longitude),
	  zoom: 12,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
	// note: this is not displaying maps correctly for multiple calls to show_pointdetails
	// http://stackoverflow.com/questions/4837611/google-maps-api-3-jqtouch discusses a workaround
}





