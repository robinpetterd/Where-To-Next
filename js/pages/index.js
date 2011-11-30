    
//tell the client where to connect
RPCconnect('/rpc');

/*call a jsonrpc function and hand it an object
  render the restult with a template and insert it into a html element
  make the element a modal dialog
*/

;



function listQuests() {
  //var inobj=$("#CreateQuestForm").serializeJSON()
  
  RPCcall({
      funct:'listQuests', 
      //paramaters:{params:inobj},
      template:'#questLists_template',
      target:'#questLists',
});

  return false; 
}







