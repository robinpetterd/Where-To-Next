    
//tell the client where to connect
RPCconnect('/rpc');

// pull down the list of quests this user owns
listMyQuests();


function CreateQuest() {
      var inobj=$("#CreateQuestForm").serializeJSON();

      //window.console.log(inobj);
      
      RPCcall({
      funct:'addeditQuest', 
      paramaters:{params:inobj},
      url:'/rpcedit',
      //template:'#boovt_template',
      //target:'#boot_div',
      success: function(result) {
        //alert(result);

         global_currentQuestJSON = result;
         listMyQuests();
         //listPoints();
         jQT.goTo('#Points', 'flip');

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


function listPoints(key){
    
     global_currentQuest = key;
    
     var points = getPoints();
     

    
    $( "#pointsTemplate" ).tmpl(points).appendTo( "#pointsList" );

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






