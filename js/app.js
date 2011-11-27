// tell the rpc client where to connect
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
  if (oArgs.error) {
    err=oArgs.error;
  } else {
    err=function(result) {
      // Result is an RPC 2.0 compatible response object
      alert(JSON.stringify(result));
    }
  }
  var url;
  if (oArgs.url) {
    url=oArgs.url;
  }
  alert(JSON.stringify(oArgs));  
  $.jsonRPC.request(oArgs.funct, {
    params: oArgs.paramaters, 
    success: function(returned) {
      // It comes back as an RPC 2.0 compatible response object
      if (oArgs.target && oArgs.template) {
        $(oArgs.target).html($(oArgs.template).tmpl(returned.result));
      }
      if (oArgs.success) {
        oArgs.success(returned.result);
      }
    },
    error: err,
  });
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
