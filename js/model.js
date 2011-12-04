
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

function addPoint(){
    
          var inobj=$("#CreatePointForm").serializeObject();
          
         //now get the points as JSON 
         
         var points = getPoints();
         //console.log(points);

         //alert(points.length);
         //inobj.ID = points.length;
         var clength =  points.length;
         if (clength == null) { clength = 0 };
         //points.[clength] = clength;
         
         points[clength] = inobj;
        //console.log(global_currentQuestJSON);
         
         global_currentQuestJSON.points = JSON.stringify(points);         
         console.log(global_currentQuestJSON);
         savePoints();
     

       
}

function editPoint(id){
    
   
    var points = getPoints();
    console.log(points); 
     

    
   // $( "#editPointsTemplate" ).tmpl(points).appendTo( "#editPointForm" );

   
}



function removePoint(){
    
   
}


function savePoints(){
    
     //save that point 
          RPCcall({
              funct:'addeditQuest', 
              paramaters:{params:global_currentQuestJSON},
              url:'/rpcedit',
              //template:'#boovt_template',
              //target:'#boot_div',
              success: function(result) {
                //alert(result);
                   listPoints();
                   jQT.goTo('#Points', 'flip');
              },
          });
   
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
      
      global_currentQuestJSON = result;
      if (nexttask) {
        nexttask();
      }
      
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









