    
//tell the client where to connect
RPCconnect('/rpc');

/*call a jsonrpc function and hand it an object
  render the restult with a template and insert it into a html element
  make the element a modal dialog
*/



function listPublishedQuests() {
  
  
  //TODO need a backend request just show 
  
  RPCcall({
      funct:'listMyQuests', 
      //paramaters:{params:inobj},
      //url:'/rpcedit',
      template:'#questLists_template',
      target:'#questLists',
      success: function(result) {
          
  },
});

  return false; 
}






