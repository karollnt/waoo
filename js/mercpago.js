'use strict';
// https://www.mercadopago.com.co/developers/es/solutions/payments/custom-checkout/charge-with-creditcard/javascript/
// https://www.mercadopago.com.co/developers/es/tools/sdk/client/javascript/
var mercpago = (function () {
  var pubKey = '';
  var accToken = '';
  var paymentMethods;
  var idTypes;
  var infoNeeded;
  var init = function () {
    $.ajax({
      type : 'post',
  		url : waooserver+"/solicitudes/datosPasarela",
  		dataType: "json",
  		data : "",
  		success : function(resp) {
  			pubKey = resp.pubKey;
        accToken = resp.accToken;
        Mercadopago.setPublishableKey(pubKey);
        searchPaymentMethods();
        searchIdTypes();
  		},
  		error: function(e) {
  			alert(e.message);
  		}
  	});
  };
  var getPaymentMethods = function () {
    return paymentMethods;
  };
  var getIdTypes = function () {
    return idTypes;
  };
  var getInfoNeeded = function () {
    return infoNeeded;
  };
  var searchPaymentMethods = function () {
    Mercadopago.getAllPaymentMethods(function(st,resp){
      paymentMethods = resp;
    });
  };
  var searchIdTypes = function () {
    Mercadopago.getIdentificationTypes(function (st,resp) {
      idTypes = resp;
    });
  };
  var searchInfoNeeded = function (methodId) {
    Mercadopago.getPaymentMethod({'payment_method_id':methodId},function (st,resp) {
      infoNeeded = resp.additional_info_needed;
    });
  };
  return{
    init: init,
    getIdTypes: getIdTypes,
    getPaymentMethods: getPaymentMethods,
    getInfoNeeded: getInfoNeeded
  };
})();

//init mercpago
mercpago.init();

var mercpagoui = (function () {
  var typeTransl = {
    'ticket':'Factura impresa','atm':'Cajero electronico',
    'credit_card':'Tarjeta credito','debit_card':'Tarjeta debito','prepaid_card':'Tarjeta prepagada',
    'cardholder_name':'Nombre','cardholder_identification_type':'Tipo de identificacion','cardholder_identification_number':'Numero de identificacion'
  };
  var selectTipoId = function () {
    var idTypes = mercpago.getIdTypes();
    var html = "<select class='js-tipoId form-control'>";
    $.each(idTypes,function (ixd,obj) {
      html += "<option value='"+obj.id+"'>"+obj.name+"</option>";
    });
    html += "</select>";
    return html;
  };
  var selectTipoPago = function () {
    var paymentMethods = mercpago.getPaymentMethods();
    var html = "<select class='js-tipoPago form-control'>";
    $.each(paymentMethods,function (ixd,obj) {
      if(obj.status=='active') html += "<option value='"+obj.id+"' data-type='"+obj.payment_type_id+"'>"+obj.name+" ("+(typeTransl[obj.payment_type_id])+")</option>";
    });
    html += "</select>";
    return html;
  };
  var getBin = function () {
    var bin = '';
    var ccNumber = $.trim($('.js-cardNumber').val());
    if(ccNumber!=''){
      bin = ccNumber.replace(/[ .-]/g, '').slice(0, 6);
    }
    return bin;
  };
  var adivinarTipoTarjeta = function () {
    var bin = getBin();
    if(bin.length>5) Mercadopago.getPaymentMethod({"bin": bin}, function (st,resp) {
      if(st==200) $('.js-tipoPago').val(resp[0].id);
    });
  };
  var enviarPago = function () {
    var $datos = $('.js-enviarPago');
    Mercadopago.createToken($datos,function (st,resp) {
      if(st!=200 && st!=201) alert('No ha llenado todos los datos');
      else {
        var tipopago = $('.js-tipoPago option:selected').val();
        //guardaPago($('.js-idSolicitud').val(),resp.id);
        console.log(resp);
      }
    });
  };
  var guardaPago = function (idsol,ncomp) {
    $.ajax({
  		type : 'post',
  		url : waooserver+"/solicitudes/aceptarPrecio",
  		dataType: "json",
  		data : {idpreciotrabajo:idsol,numcomprobante:ncomp},
  		success : function(resp) {
  			alert(resp.msg);
        cargaPagina('index.html',0);
  		},
  		error: function(e) {
  			alert(e.message);
  		}
  	});
  };
  return{
    selectTipoId: selectTipoId,
    selectTipoPago: selectTipoPago,
    adivinarTipoTarjeta: adivinarTipoTarjeta,
    enviarPago: enviarPago
  };
})();
