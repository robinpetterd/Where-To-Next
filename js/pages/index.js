var watchid;
var currentcoords;
var howclosedoineedtobe=5;
var currentscore=0;
var plist;
var poorgpssignal=100; // If accuracy is more than 100 meters it's a poor signal
var minimumaccuracy=10; // if you're within 10 meters that's close enough.
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
  watchid=navigator.geolocation.getCurrentPosition(positionupdated, gpserror,  {enableHighAccuracy:true});
  var t=setTimeout("startwatching();",5000)
}

function positionupdated(position) {
   //console.log(JSON.stringify(position.coords));
   currentcoords=position.coords;
   try {
    Pointsloop();
  } catch(e) {
    console.log(e);
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
        console.log(global_currentQuestJSON);
        plist=getPoints();
        addPoints();
        jQT.goTo('#play');
        Pointsloop();
        currentscore=0;
    },
}); 
  return false; 
}

function addPoints() {
  for (i in plist) {

    $('#pointlist').append($('#pointlist_template').tmpl(plist[i]));
    if (global_currentQuestJSON.optmap=="checked") {
      plist[i].showmap=true;  
    } 
  }  
}

function displayfeedback(i) {
 // alert(plist[i].Feedback);
   $('#FeedbackDisplay').empty().html(plist[i].Feedback);
   jQT.goTo('#Feedback', '');

}

function Pointsloop() {
	

    if (currentcoords) {
			//global_currentCoords = coords; 
			//$('.latitude').empty().val(coords.latitude);
			//$('.longitude').empty().val(coords.longitude);
			//var plist=getPoints();
			//alert(JSON.stringify(coords.latitude));
			var p1from = new LatLon(currentcoords.latitude, currentcoords.longitude);
			if (currentcoords.accuracy>poorgpssignal) {
        //alert('crap');
        $("#gpssignal").attr("alt","poor (" + currentcoords.accuracy.toString() + ")");
        $("#gpssignal").attr( "src", "/pages/themes/wheretonext/img/signal_poor.png" );  
      } else {
        $("#gpssignal").attr("alt","good (" + currentcoords.accuracy.toString() + ")");
        $("#gpssignal").attr( "src", "/pages/themes/wheretonext/img/signal_good.png" );
      }
      
      //$('#pointlist').html('');
      for (i in plist) {
				//alert(JSON.stringify(i));
				//alert(JSON.stringify(plist[i].latitude));
				var p2to = new LatLon(plist[i].latitude, plist[i].longitude);
				plist[i].distance = p1from.distanceTo(p2to);
        
        if (plist[i].distance<0.8) {
          plist[i].distancedesc=Math.round(plist[i].distance*1000) + " m";  
        } else {
          plist[i].distancedesc=parseFloat(plist[i].distancedesc=plist[i].distance).toFixed(1) + " km";
        }
        if (plist[i].distance<=minimumaccuracy) {
          plist[i].distancedesc="Here";
          if (plist[i].done=="false") {
             plist[i].done="found";
             currentscore++;
             $("#score").html(currentscore);
             displayfeedback(i);
          }
        }
        if (global_currentQuestJSON.opthotcold=="" && plist[i].done=="false") {
          plist[i].distance=null;  
        }
        if (global_currentQuestJSON.optarrows=="") {
          plist[i].heading=null; 
        } else {
				  plist[i].heading=parseInt(p1from.bearingTo(p2to));
          plist[i].shortbearing=Math.round((plist[i].heading-22.5)/45);
          plist[i].bearingdesc=bearingarray[plist[i].shortbearing];        
        } 
        

        
				$('#point' + i).replaceWith($('#pointlist_template').tmpl(plist[i]));
        
			}
      // $('#pointlist').append(currentcoords.accuracy);
		  //console.log(plist); 
		} else {
      $("#gpssignal").attr("alt","no location");
      $("#gpssignal").attr( "src", "/pages/themes/wheretonext/img/signal_none.png" ); 
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





