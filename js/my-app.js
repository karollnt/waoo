// Initialize your app
var myApp = new Framework7({
  animateNavBackIcon: true,
  precompileTemplates: true,
	swipeBackPage: false,
	swipeBackPageThreshold: 1,
	pushState: false,
  template7Pages: true,
	cache: false
});

//backend server address
var waooserver = "http://waoo.herokuapp.com";
// var waooserver = "http://localhost/waoobackend";
//para notificaciones
var tareanotificaciones = null;

// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
  // Enable dynamic Navbar
  dynamicNavbar: false
});

function cargaPagina(url,num,params){
	var loggedin = window.localStorage.getItem("nickname");
  params = typeof params !== 'undefined' ? params : {};
	if(!loggedin) myApp.popup(".popup-login");
	else{
		mainView.router.loadPage(url+"?"+(Math.floor((Math.random() * 1000) + 1)));
    switch (num) {
      case 0:
        setTimeout(function(){verifcarga();},1000);
        break;
      case 2:
        $.ajax({
          type: "post",
          url: waooserver+"/usuarios/tipoUsuario",
          dataType: "json",
          data: {nickname:loggedin},
          success: function(resp) {
            if(resp.error) alert('Error: ' + resp.error);
            else{
              if(resp.tipo==2) listarSolicitudesSinAsignarDiv("dirpc");
              else if(resp.tipo==1){
                setTimeout(function(){
                 // cargarMateriaSelect("materia");
                  obtener_datos("materia");
                  llenarSelectAnio('#anio');
                  llenarSelectMes2('#mes');
                  llenarSelectDias('#dia');
                  llenarSelectHoras('#hora');
                  llenarSelectMinutos('#minutos');
                  $('#creasolicitud').on('submit', function(e) {
                    e.preventDefault();
                    creasolicitud();
                    return false;
                  });
                  $("#lista_tareas").click(function () {
                    var id = $('input:radio[name=idmateria]:checked').val();
                    buscar_nombre_seleccionado(id);
                    $("#lista_tareas").hide('fast');
                  });
                  $( "#lista").keyup(function() {
                    dato = $("#lista").val().trim();
                    if (dato.trim().length!=0) {
                      validar_existe(dato);
                      return false;
                    }
                    else{
                      $("#lista_tareas").html('');
                      $("#lista_tareas").hide('fast');
                      return false;
                    }
                  });
                },1000);
              }
            }
          },
          error: function(e) {
            alert('Error: ' + e.message);
          }
        });
        break;
      case 3:
        setTimeout(function(){
          if (params.id) {
            if (params.isAssistant) {
              listarSolicitudesSinAsignarDiv('dirpc');
            }
            else {
              cargaSolicitudesUsuario(loggedin);
            }
            setTimeout(function () {
              if (params.isAssistant) {
                verDetalleSolicitud(params.id,'detsols_'+params.id,1);
              }
              else if (params.viewSolution) {
                verDetalleSolicitud(params.id,'detsols_'+params.id,1);
              }
              else {
                verDetalleSolicitud(params.id,'detsols_'+params.id);
              }
            },1000);
          }
          else {
            cargaSolicitudesUsuario(loggedin);
          }
        },1000);
        break;
      case 4:
        setTimeout(function(){cargarDatosUsuario();},1000);
        break;
      case 5:
        setTimeout(function(){listarNotificacionesSinLeer();},1000);
        break;
      case 6:
        misendbird.setAssistant(window.localStorage.getItem("nickname"));
        misendbird.obtenerDireccionCanalChat();
        break;
      case 7:
        misendbird.init(1);
        break;
      case 8:
        setTimeout(function(){historialTrabajosAceptados();},1000);
        break;
      case 9:
        setTimeout(function(){consultarTokens();},1000);
        break;
      case 10:
        setTimeout(function(){
          /*mercpagoui.initEvents();
          llenarSelectMes('.js-expirationMonth');
          llenarSelectAnio('.js-expirationYear');
          mercpagoui.initEvents();*/
          consultarTokens();
          initBraintree();
          $('.js-id-solicitud').val(params.idpreciotrabajo);
          $('.js-checkout-total').val(params.valor);
          $('.js-nickname').val(window.localStorage.getItem('nickname'));
          $('.js-client-token').val(window.localStorage.getItem('bt_token'));
          /*if (params.tokens) {
            var ajax = $.ajax({
              type : 'post',
              url : waooserver+"/usuarios/cantidadTokens",
              dataType: "json",
              data : {nickname:window.localStorage.getItem("nickname")}
            });
            (function (extraParams) {
              ajax.done(function (resp) {
                var actual = resp.msg * 1;
                var required = extraParams.tokens - actual;
                var totalValue = required * 1000;
                $('.js-tokens-default').val(required);
                $('.js-checkout-total').html('$ '+totalValue);
                $('.js-id-solicitud').val(extraParams.idpreciotrabajo);
              });
            })(params);
          }*/
        },1000);
        break;
      default:
        break;
    }
	}
}

function verifcarga(){
	var loggedin = window.localStorage.getItem("nickname");
	if(!loggedin){
		myApp.popup(".popup-login");//formulario de login
		$("#loginimg").prop("src","images/icons/blue/user.png");
		$("#loginsp").html("Iniciar sesi&oacute;n");
		//$("#loginimg").parent().addClass("open-popup");
		$("#loginimg").parent().bind('click',function(){myApp.popup(".popup-login");});
		if(tareanotificaciones!=null) clearInterval(tareanotificaciones);
		tareanotificaciones = null;
    $("#snck").html(loggedin);
	}
	else{
		$("#loginimg").prop("src","images/icons/blue/logout.png");
		$("#loginsp").html("Cerrar sesi&oacute;n");
		//$("#loginimg").parent().removeClass("open-popup");
		$("#loginimg").parent().unbind('click');
		$("#loginimg").parent().bind('click',function(){logout();});
		cambiaIconosAsesor(loggedin);
    verificaRedirect2(loggedin);
    $("#snck").html("-");
		if(tareanotificaciones==null){
			contarNotificacionesSinLeer();
			tareanotificaciones = setInterval(function(){contarNotificacionesSinLeer();},60000);
		}
	}
}

function llenarSelectMes(id) {
  var str = "";
  for (var i = 1; i <= 12; i++) {
    str += "<option value='"+i+"'>"+i+"</option>";
  }
  $(id).html(str);
}

function llenarSelect2(inicio,final,seleccionado) {
  seleccionado = typeof seleccionado !== 'undefined' ? seleccionado : 0;
  var str = "";
  for (var i = inicio; i <= final; i++) {
    str += "<option value='"+(i<10?'0':'')+i+"'"+(seleccionado==i ? " selected":"")+">"+(i<10?'0':'')+i+"</option>";
  }
  return str;
}

function llenarSelectMes2(id) {
  var fd = new Date();
  var str = llenarSelect2(1,12,fd.getMonth()+1);
  $(id).html(str);
}

function llenarSelectDias(id) {
  var fd = new Date();
  var str = llenarSelect2(1,31,fd.getDate());
  $(id).html(str);
}

function llenarSelectHoras(id) {
  var str = llenarSelect2(0,23);
  $(id).html(str);
}

function llenarSelectMinutos(id) {
  var str = llenarSelect2(0,59);
  $(id).html(str);
}

function llenarSelectAnio(id) {
  var fd = new Date();
  var miny = fd.getFullYear();
  var maxy = miny + 30;
  var str = "";
  for (var i = miny; i < maxy; i++) {
    str += "<option value='"+i+"'>"+i+"</option>";
  }
  $(id).html(str);
}

function closeModals() {
  myApp.closeModal('.popup-signup');
  myApp.closeModal('.popup-signup2');
  myApp.closeModal('.popup-login');
}

jQuery(document).ready(function() {
	"use strict";
	verifcarga();
	$('#LoginForm').on('submit', function(e) { //use on if jQuery 1.7+
    e.preventDefault();  //prevent form from submitting
		login();
		return false;
  });
	$('#RegisterForm').on('submit', function(e) {
    e.preventDefault();
		register();
		return false;
  });
	$('#RegisterForm2').on('submit', function(e) {
    e.preventDefault();
  	register2();
  	return false;
  });

	cargarBancoSelect("banco");
	listaChecksMateria("matsreg");
  $(document).off('submit','.js-pago-efectivo').on('submit','.js-pago-efectivo',procesaPagoEfectivo);
  //lib raty
  $.fn.raty.defaults.path = './images';
  cargarNivelesSelect('nivel');

	$(".logo").animate({'top': '20px'},'slow',"easeInOutCirc");
	$(".cartitems").delay(1000).animate({'width': '30px', 'height': '30px', 'top':'10px', 'right':'10px', 'opacity':1},1000,"easeOutBounce");
	$(".main-nav ul > li")
		.css('opacity', '0')
		.each(function(index, item) {
			setTimeout(function() {
				$(item).fadeTo('slow',1,"easeInOutCirc");
			}, index*175);
	});

	$(".main-nav ul > li span")
    .css('opacity', '0')
		.each(function(index, item) {
			setTimeout(function() {
				$(item).animate({'left': '0px', 'opacity':1},500,"easeInOutCirc");
			}, index*175);
	});

  $('.item_delete').click(function(e){
    e.preventDefault();
    var currentVal = $(this).attr('id');
    $('div#'+currentVal).fadeOut('slow');
  });

  $('.qntyplus').click(function(e){

    e.preventDefault();
    var fieldName = $(this).attr('field');
    var currentVal = parseInt($('input[name='+fieldName+']').val());
    if (!isNaN(currentVal)) {
      $('input[name='+fieldName+']').val(currentVal + 1);
    }
    else {
      $('input[name='+fieldName+']').val(0);
    }

  });
  $(".qntyminus").click(function(e) {
    e.preventDefault();
    var fieldName = $(this).attr('field');
    var currentVal = parseInt($('input[name='+fieldName+']').val());
    if (!isNaN(currentVal) && currentVal > 0) {
      $('input[name='+fieldName+']').val(currentVal - 1);
    }
    else {
      $('input[name='+fieldName+']').val(0);
    }
  });

});

$$(document).on('ajaxStart',function(e){myApp.showIndicator();});
$$(document).on('ajaxComplete',function(){myApp.hideIndicator();});

$$('.popup').on('opened', function () {
  $(".close_loginpopup_button a").animate({'right':'10px', 'opacity':1},'slow',"easeInOutCirc");
});
$$('.popup').on('closed', function () {
  $(".close_loginpopup_button a").animate({'right':'0px', 'opacity':0},'slow',"easeInOutCirc");
});

myApp.onPageInit('index', function (page) {

	$(".logo").animate({'top': '20px'},'slow',"easeInOutCirc");
	$(".cartitems").delay(1000).animate({'width': '30px', 'height': '30px', 'top':'10px', 'right':'10px', 'opacity':1},1000,"easeOutBounce");
	$(".main-nav ul > li")
		.css('opacity', '0')
		.each(function(index, item) {
			setTimeout(function() {
				$(item).fadeTo('slow',1,"easeInOutCirc");
			}, index*175);
	});
	$(".main-nav ul > li span")
	    .css('opacity', '0')
		.each(function(index, item) {
			setTimeout(function() {
				$(item).animate({'left': '0px', 'opacity':1},500,"easeInOutCirc");
			}, index*175);
	});

})

myApp.onPageInit('blog', function (page) {

	$(".posts li").hide();
	size_li = $(".posts li").size();
	x=4;
	$('.posts li:lt('+x+')').show();
	$('#loadMore').click(function () {
		x= (x+1 <= size_li) ? x+1 : size_li;
		$('.posts li:lt('+x+')').show();
		if(x == size_li){
			$('#loadMore').hide();
			$('#showLess').show();
		}
	});

	$("ul.posts > li div.post_date")
		.css('opacity', '0')
		.each(function(index, item) {
			setTimeout(function() {
				$(item).animate({'left':'0px', 'opacity':1},800,"easeInOutCirc");
			}, index*175);
	});
	$("ul.posts > li div.post_title")
		.css('opacity', '0')
		.each(function(index, item) {
			setTimeout(function() {
				$(item).animate({'right':'0px', 'opacity':1},800,"easeInOutCirc");
			}, index*175);
	});
})

myApp.onPageInit('blogsingle', function (page) {
		$(".backto").animate({'left': '0px'},'slow',"easeInOutCirc");
		$(".nextto").delay(500).animate({'opacity':1, 'width': '10%',},500,"easeOutBounce");
		$(".post_title_single").animate({'right': '0px'},'slow',"easeInOutCirc");
})

myApp.onPageInit('shop', function (page) {

	$("ul.shop_items > li")
		.css('opacity', '0')
		.each(function(index, item) {
			setTimeout(function() {
				$(item).fadeTo('slow',1,"easeInOutCirc");
			}, index*175);
	});

	$("ul.shop_items > li .shopfav")
		.css('opacity', '0')
		.each(function(index, item) {
			setTimeout(function() {
				$(item).animate({'width':'8%', 'opacity':1},2000,"easeOutBounce");
			}, index*175);
	});

	$("ul.shop_items > li h4")
		.css('opacity', '0')
		.each(function(index, item) {
			setTimeout(function() {
				$(item).animate({'right':'0px', 'opacity':1},800,"easeInOutCirc");
			}, index*175);
	});

	$("ul.shop_items > li div.shop_thumb")
		.css('opacity', '0')
		.each(function(index, item) {
			setTimeout(function() {
				$(item).animate({'left':'0px', 'opacity':1},800,"easeInOutCirc");
			}, index*175);
	});

	$('.qntyplusshop').click(function(e){

		e.preventDefault();
		var fieldName = $(this).attr('field');
		var currentVal = parseInt($('input[name='+fieldName+']').val());
		if (!isNaN(currentVal)) {
			$('input[name='+fieldName+']').val(currentVal + 1);
		} else {
			$('input[name='+fieldName+']').val(0);
		}

	});
	$(".qntyminusshop").click(function(e) {
		e.preventDefault();
		var fieldName = $(this).attr('field');
		var currentVal = parseInt($('input[name='+fieldName+']').val());
		if (!isNaN(currentVal) && currentVal > 0) {
			$('input[name='+fieldName+']').val(currentVal - 1);
		} else {
			$('input[name='+fieldName+']').val(0);
		}
	});

})

myApp.onPageInit('shopitem', function (page) {

	$(".shop_item .shop_thumb").animate({'left': '0px', 'opacity':1},'slow',"easeInOutCirc");
	$(".shop_item .shop_item_price").delay(500).animate({'right':'10px', 'opacity':1},500,"easeInOutCirc");
	$(".shop_item a.shopfav").delay(500).animate({'opacity':1, 'width': '10%',},500,"easeOutBounce");
	$(".shop_item a.shopfriend").delay(800).animate({'opacity':1, 'width': '10%',},500,"easeOutBounce");


		$('.qntyplusshop').click(function(e){

			e.preventDefault();
			var fieldName = $(this).attr('field');
			var currentVal = parseInt($('input[name='+fieldName+']').val());
			if (!isNaN(currentVal)) {
				$('input[name='+fieldName+']').val(currentVal + 1);
			} else {
				$('input[name='+fieldName+']').val(0);
			}

		});
		$(".qntyminusshop").click(function(e) {
			e.preventDefault();
			var fieldName = $(this).attr('field');
			var currentVal = parseInt($('input[name='+fieldName+']').val());
			if (!isNaN(currentVal) && currentVal > 0) {
				$('input[name='+fieldName+']').val(currentVal - 1);
			} else {
				$('input[name='+fieldName+']').val(0);
			}
		});

})


$$(document).on('pageInit', function (e) {

		$("ul.features_list_detailed > li")
			.css('opacity', '0')
			.each(function(index, item) {
				setTimeout(function() {
					$(item).fadeTo('slow',1,"easeInOutCirc");
				}, index*175);
		});

		$("ul.features_list_detailed > li span")
			.css('opacity', '0')
			.each(function(index, item) {
				setTimeout(function() {
					$(item).animate({'bottom':'0px', 'right':'0px', 'opacity':1},800,"easeInOutCirc");
				}, index*175);
		});

		$("ul.features_list_detailed > li h4")
			.css('opacity', '0')
			.each(function(index, item) {
				setTimeout(function() {
					$(item).animate({'right':'0px', 'opacity':1},800,"easeInOutCirc");
				}, index*175);
		});

		$("ul.features_list_detailed > li div.feat_small_icon")
			.css('opacity', '0')
			.each(function(index, item) {
				setTimeout(function() {
					$(item).animate({'left':'0px', 'opacity':1},800,"easeInOutCirc");
				}, index*175);
		});

  		$(".swipebox").swipebox();
		$("#ContactForm").validate({
		submitHandler: function(form) {
		ajaxContact(form);
		return false;
		}
		});

		$("#RegisterForm").validate();
		$("#LoginForm").validate();
		$("#ForgotForm").validate();

		$('a.backbutton').click(function(){
			parent.history.back();
			return false;
		});



	$("a.switcher").bind("click", function(e){
		e.preventDefault();

		var theid = $(this).attr("id");
		var theproducts = $("ul#photoslist");
		var classNames = $(this).attr('class').split(' ');


		if($(this).hasClass("active")) {
			// if currently clicked button has the active class
			// then we do nothing!
			return false;
		} else {
			// otherwise we are clicking on the inactive button
			// and in the process of switching views!

  			if(theid == "view13") {
				$(this).addClass("active");
				$("#view11").removeClass("active");
				$("#view11").children("img").attr("src","images/switch_11.png");

				$("#view12").removeClass("active");
				$("#view12").children("img").attr("src","images/switch_12.png");

				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_13_active.png");

				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_11");
				theproducts.removeClass("photo_gallery_12");
				theproducts.addClass("photo_gallery_13");

			}

			else if(theid == "view12") {
				$(this).addClass("active");
				$("#view11").removeClass("active");
				$("#view11").children("img").attr("src","images/switch_11.png");

				$("#view13").removeClass("active");
				$("#view13").children("img").attr("src","images/switch_13.png");

				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_12_active.png");

				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_11");
				theproducts.removeClass("photo_gallery_13");
				theproducts.addClass("photo_gallery_12");

			}
			else if(theid == "view11") {
				$("#view12").removeClass("active");
				$("#view12").children("img").attr("src","images/switch_12.png");

				$("#view13").removeClass("active");
				$("#view13").children("img").attr("src","images/switch_13.png");

				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_11_active.png");

				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_12");
				theproducts.removeClass("photo_gallery_13");
				theproducts.addClass("photo_gallery_11");

			}

		}

	});

	document.addEventListener('touchmove', function(event) {
	   if(event.target.parentNode.className.indexOf('navbarpages') != -1 || event.target.className.indexOf('navbarpages') != -1 ) {
		event.preventDefault(); }
	}, false);

	// Add ScrollFix
	/*var scrollingContent = document.getElementById("pages_maincontent");
	new ScrollFix(scrollingContent);*/


	var ScrollFix = function(elem) {
		// Variables to track inputs
		var startY = startTopScroll = deltaY = undefined,

		elem = elem || elem.querySelector(elem);

		// If there is no element, then do nothing
		if(!elem)
			return;

		// Handle the start of interactions
		elem.addEventListener('touchstart', function(event){
			startY = event.touches[0].pageY;
			startTopScroll = elem.scrollTop;

			if(startTopScroll <= 0)
				elem.scrollTop = 1;

			if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
				elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
		}, false);
	};



})
