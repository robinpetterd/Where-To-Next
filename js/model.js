
/* Work the model data that is just used in both authoring and browsing
 * works closely with the global_currentQuestJSON;    
 * actual incldues some controller code. 
*/



/* point data is string so need some work getting and out. 
 * 
 */


function addPoint(){
    
    //TODO - NEXT add contents CreatePointForm to the points JSON .. which has been setup yet.
    
   
}

function removePoint(){
    
   
}


function savePoint(){
    
   
}

function ChangeCurrent(CurrentID) {
   global_currentQuest = CurrentID; 
   
}


function getLocation() {
    
    //alert('looing for location');
    
    var lookup = jQT.updateLocation(function(coords){
                    if (coords) {
                         global_currentCoords = coords;
                         $('.latitude').empty().val(coords.latitude);
                         $('.longitude').empty().val(coords.longitude);
                       
                    } else {
                        alert('Device not capable of geo-location.');
                    }
    });
    
    return false;

    
}

function showQuest(template,target) {
 
 
  RPCcall({
      funct:'showQuest', 
      paramaters:{key:global_currentQuest},
      //url:'/rpcedit',
      template:template,
      target:target,
      success: function(result) {
       
     
  },
});

  return false;
  
  
}








