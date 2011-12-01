    
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
         listPoints();

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
      funct:'deleteQuest',//TODO change this to a delete backend call 
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
    
   //  jQT.goTo('#Points', 'flip');

    // alert('about to list the points');
     
     var movies = [
        { Name: "The Red Violin", ReleaseYear: "1998" },
        { Name: "Eyes Wide Shut", ReleaseYear: "1999" },
        { Name: "The Inheritance", ReleaseYear: "1976" }
    ];
    
    $( "#movieTemplate" ).tmpl( movies).appendTo( "#movieList" );

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







