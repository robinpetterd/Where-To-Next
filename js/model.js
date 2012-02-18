
/* Work the model data that is just used in both authoring and browsing
 * works closely with the global_currentQuestJSON;    
 * actual incldues some controller code. 
*/


/* point data is string so need some work getting and out. 
 * 
 */
function getPoints(){
     
      if(global_currentQuestJSON.points != ''){
              var points = JSON.parse(global_currentQuestJSON.points);
         } else {
             var points = {};
         }
         
         return points;
}



function ChangeCurrent(CurrentID) {
   global_currentQuest = CurrentID; 
   
}



function getLocation() {
    
    //alert('looking for location');
    
    var lookup = jQT.updateLocation(function(coords){
                    if (coords) {
                       
                         global_currentCoords = coords;
                        // console.log(coords);
                         $('.latitude').empty().val(coords.latitude);
                         $('.longitude').empty().val(coords.longitude);
                       
                    } else {
                        alert('Device not capable of geo-location.');
                    }
    });
    
    return false;

    
}

function showQuest(template,target,nextDiv) {
 
  RPCcall({
      funct:'showQuest', 
      paramaters:{key:global_currentQuest},
      //url:'/rpcedit',
      template:template,
      target:target,
      success: function(result) {
      
      global_currentQuestJSON = result;
      jQT.goTo(nextDiv,'slideleft');
      
  },
});

  return false;
  
  
}

/* 
* Util to convert the form to nice JSON 
*/

$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};









