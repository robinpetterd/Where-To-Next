    
var global_current_point;


//tell the client where to connect
RPCconnect('/rpc');

// pull down the list of quests this user owns
listMyQuests();

function CreateQuest() {
      var inobj=$("#CreateQuestForm").serializeJSON();

      //window.console.log(inobj);
      global_currentQuestJSON = inobj;
      
      RPCcall({
      funct:'addeditQuest', 
      paramaters:{params:inobj},
      url:'/rpcedit',
      //template:'#boovt_template',
      //target:'#boot_div',
      success: function(result) {
        //alert(result);
         
         listMyQuests();
         //listPoints();
         jQT.goTo('#Points', '');

        //  $('#boot_div').dialog({modal:true,  title:'an alert', width:'460', height:'320' });
      },
          
  
  
});

  return false;
}


function EditQuest() {
      var inobj=$("#editQuestForm").serializeJSON();
      //window.console.log(inobj);
      
      RPCcall({
      funct:'addeditQuest', 
      paramaters:{params:inobj},
      url:'/rpcedit',
      //template:'#boovt_template',
      //target:'#boot_div',
      success: function(result) {
        //alert(result);
        listMyQuests();

        jQT.goTo('#author', '');


        //  $('#boot_div').dialog({modal:true,  title:'an alert', width:'460', height:'320' });
      },
      
    
     
  
  
});

  return false;
}

function DeleteQuest(key) {

      
      RPCcall({
      funct:'deleteQuest', 
      paramaters:{key:key},
      url:'/rpcedit',
      //template:'#boovt_template',
      //target:'#boot_div',
      success: function(result) {
        //alert(result);
        listMyQuests();
        jQT.goTo('#author', '');

      },
});
  return false;
}

function listMyQuests() {
  //var inobj=$("#CreateQuestForm").serializeJSON()
  
  RPCcall({
      funct:'listMyQuests', 
      //paramaters:{params:inobj},
      url:'/rpcedit',
      template:'#questLists_template',
      target:'#questLists',
});

  return false; 
}


function listPoints(key){
     
     //console.log('-------- in points -------');
     
     global_currentQuest = key;
    
     var points = getPoints();
     //console.log(points);
     
     //Some debug stuff
     /*     $.each(points, function(key, value) { 
            console.log(key + ': ' + value); 
               $.each(value, function(key, value) { 
                    console.log(key + ': ' + value); 
                 });

      });*/
       
       $('#pointsList').empty();
       
       $.each(points, function(i,point) { 
                //console.log(point.latitude); 
              
                $('#pointsList').append('<li class="arrow"><a href="#editPoint"  onClick="editPoint('+ i +')" >' + point.Feedback  + '</a></li>');
                
       });

 

}



function addPoint(){
    
          var inobj=$("#CreatePointForm").serializeObject();
          //console.log(global_currentQuestJSON);
         //now get the points as JSON 
         
        //$('"#CreatePointForm"').not(':button, :submit, :reset, :hidden').val('');


         var points = getPoints();
         //console.log(points);
         var clength = 0;
         
         for (p in points) {
             clength ++;
         }
         
         //inobj.ID = points.length;
        // var clength =  points.length;
         //points.[clength] = clength;
         
         points[clength] = inobj;
        //console.log(global_currentQuestJSON);
         global_currentQuestJSON.points = JSON.stringify(points);         
         //console.log(global_currentQuestJSON);
         savePoints();
     

       
}




function savePoint(){
    
          var inobj=$("#editPointForm").serializeObject();
          //alert(global_current_point);
          
          
         //now get the points as JSON 
         
         var points = getPoints();
         //console.log(points);
        
         //console.log(points[global_current_point]);
         
         points[global_current_point] = inobj;
         
         global_currentQuestJSON.points = JSON.stringify(points);         
         //console.log(global_currentQuestJSON);
         savePoints();
     

       
}


function deletePoint(){
  
         var points = getPoints();
         //console.log(points);
        
         //console.log(points[global_current_point]);
         
         delete  points[global_current_point];
         
         global_currentQuestJSON.points = JSON.stringify(points);         
         //console.log(global_currentQuestJSON);
         savePoints();
  
       
}

function editPoint(id){
    
    var points = getPoints();
    ///console.log(points[id]); 
     global_current_point = id;
    $("#editPointForm").empty();
    
    $("#editPointsTemplate" ).tmpl(points[id]).appendTo( "#editPointForm" );

   
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
                   jQT.goTo('#Points', '');
              },
          });
   
}


