function initBraintree() {
  var ajx = $.ajax({
    type: "post",
    url: waooserver+"/usuarios/initBrainTree",
    dataType: "json",
    data: {}
  });
  ajx.done(function(data) {
    braintree.dropin.create({
      authorization: data.msg,
      container: '.js-dropin-container'
    }, function (createErr, instance) {
      var form = document.querySelector('.js-payment-form');
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        instance.requestPaymentMethod(function (err, payload) {
          if (err) {
            console.log('Error', err);
            return;
          }
          // Add the nonce to the form and submit
          document.querySelector('#nonce').value = payload.nonce;
          efectuarPagoBT(".js-payment-form");
          //form.submit();
        });
      });
    });
  });
}
