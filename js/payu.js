'use strict';
var mipayu = (function () {
  //var urlApi = 'https://api.payulatam.com/payments-api/4.0/service.cgi';//prod
  var urlApi = 'https://stg.api.payulatam.com/payments-api/4.0/service.cgi';//test
  var apiLogin = '11959c415b33d0c';
  var apiKey = '6u39nqhq8ftd0hlvnjfs66eh8c';
  var getUrlApi = function () {
    return urlApi;
  };
  var setApiLogin = function (k) {
    apiLogin = k;
  };
  var setApiKey = function (k) {
    apiKey = k;
  };
  var pingConnection = function () {
  	$.ajax({
  		type : 'get',
  		url : urlApi,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      },
  		dataType: 'jsonp',
  		data: {
  		   'test': false,
  		   'language': 'es',
  		   'command': 'PING',
  		   'merchant': {'apiLogin': apiLogin,'apiKey': apiKey}
  		},
  		success : function(resp) {
  			console.log(resp);
  		},
  		error: function(e) {
  			console.log(e);
  		}
  	});
  };
  return{
    urlApi: getUrlApi,
    pingConnection: pingConnection,
    setApiLogin: setApiLogin,
    setApiKey: setApiKey
  };
})();
