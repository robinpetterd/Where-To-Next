// tell the rpc client where to connect
//user https://github.com/datagraph/jquery-jsonrpc

function RPCconnect(url) {
  $.jsonRPC.setup({
    endPoint: url,
  });
}

function RPCcall(oArgs) {
  /*
  funct= the server fuction
  paramaters= server function parameters
  template=template in http://api.jquery.com/tmpl/ format
  target=html element to insert the rendered template
  success=function to perform when successfully done.
  error=error handler
  url=Listenning url such as /edit
  */
  var err;
  var req={};
  
  if (oArgs.error) {
    req["error"]=oArgs.error;
  } else {
    req["error"]=function(result) {
      // Result is an RPC 2.0 compatible response object
      alert(JSON.stringify(result));
    }
  }
    
  req["success"]=function(returned) {
      console.log(JSON.stringify(returned));
      // It comes back as an RPC 2.0 compatible response object
      if (oArgs.target && oArgs.template) {
        $(oArgs.target).html($(oArgs.template).tmpl(returned.result));
      }
      if (oArgs.success) {
        oArgs.success(returned.result);
      }
  }
  req["params"]=oArgs.paramaters
  if (oArgs.url) {
  
    $.jsonRPC.withOptions({
      endPoint: oArgs.url,
      }, function() {
        this.request(oArgs.funct, req);
      });
  } else {
    $.jsonRPC.request(oArgs.funct, req);
  }
}

(function( $ ){
  $.fn.serializeJSON=function() {
  var json = {};
  jQuery.map($(this).serializeArray(), function(n, i){
    json[n['name']] = n['value'];
  });
  return json;
  };
})( jQuery );
