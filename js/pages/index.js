    
//tell the client where to connect
RPCconnect('/rpc');

/*call a jsonrpc function and hand it an object
  render the restult with a template and insert it into a html element
  make the element a modal dialog
*/

;


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
  
  RPCcall({
      funct:'listQuests', 
      //paramaters:{params:inobj},
      template:'#questLists_template',
      target:'#questLists',
});

  return false; 
}


function startQuest() {
  
  //where the code of score 

  return false; 
}








