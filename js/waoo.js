'use strict';
var waoo = (function () {
  var modulos = {
    navegacion: {},
    mensajeria: {},
    usuarios: {},
    materias: {},
    solicitudes: {},
    pagos: {},
    clicks: {},
    general: {}
  };
  var waooserver = 'http://waoo.herokuapp.com';
  var init = function () {
    waoo.modulos.usuarios.verifcarga();
  	$('#LoginForm').on('submit', function(e) {
      e.preventDefault();
  		waoo.modulos.usuarios.login();
  		return false;
    });
  	$('#RegisterForm').on('submit', function(e) {
      e.preventDefault();
  		waoo.modulos.usuarios.register();
  		return false;
    });
  	$('#RegisterForm2').on('submit', function(e) {
      e.preventDefault();
    	waoo.modulos.usuarios.register2();
    	return false;
    });
  	waoo.modulos.general.cargarBancoSelect("#banco");
  	waoo.modulos.general.listaChecksMateria("#matsreg");
    $.fn.raty.defaults.path = './images';
  };
  return {init:init,modulos:modulos,waooserver:waooserver};
})();

waoo.modulos.general = (function () {
  var waooserver = waoo.waooserver;
  return{
    cargarBancoSelect: function (div) {
      var $div = $(div);
      $div.html('');
      var ajx = $.ajax({
    		type: "post",
    		url: waooserver+"/bancos/listaBancos",
    		dataType: "json",
    		data: ""
      });
      ajx.done(function(resp) {
  			if(resp.error) $div.append("<option value='0'>"+resp.error+"</option>");
  			else{
  				$.each(resp.bancos,function(i,v){
  					$div.append("<option value='"+v.id+"'>"+v.nombre+"</option>");
  				});
  			}
  		})
      .fail(function(e){alert('Error: ' + e.message);});
    },
    llenarSelectMes: function (id) {
      var str = "";
      for (var i = 1; i <= 12; i++) str += "<option value='"+i+"'>"+i+"</option>";
      $(id).html(str);
    },
    llenarSelectAnio: function (id) {
      var fd = new Date();
      var miny = fd.getFullYear();
      var maxy = miny + 20;
      var str = "";
      for (var i = miny; i < maxy; i++) str += "<option value='"+i+"'>"+i+"</option>";
      $(id).html(str);
    },
    closeModals: function () {
      myApp.closeModal('.popup-signup');
      myApp.closeModal('.popup-signup2');
      myApp.closeModal('.popup-login');
    },
    listaChecksMateria: function (id) {
      var $div = $(div);
      $div.html('Buscando');
    	var ajx = $.ajax({
    		type: "post",
    		url: waooserver+"/materias/listarMaterias",
    		dataType: "json",
    		data: ""
      });
      ajx.done(function(resp) {
  			if(resp.error) $div.html("<div class='alert alert-danger'>"+resp.error+"</div>");
  			else{
  				$div.html("<table id='tmatsreg' class='table table-condensed'><caption><b>Materias en las que participar&aacute;s</b></caption></table>");
  				var colrwn = "";
  				var regs = resp.materias.length;
  				var regsf = 3;
  				$.each(resp.materias,function(i,v){
  					if(i==0 || i%regsf==0){
  						if(i>0) colrwn += "</tr>";
  						colrwn += "<tr>";
  					}
  					colrwn += "<td><label class='label-checkbox item-content' style='display:inline;'>"
  						+"<input type='checkbox' id='mat_"+i+"' name='mat_"+i+"' value='"+v.id+"'> "
  						+"<div class='item-media'><i class='icon icon-form-checkbox'></i></div>"
  						+"<div class='item-inner'><div class='item-title'> "+v.nombre+"</div></div>"
  					+"</label></td>";
  					if(i>=(resp.materias.length-1)){
  						if(regs%regsf>0){
  							var fil = Math.round(regs/regsf);
  							var rest = (fil*regsf) - regs;
  							for(var i1=0;i1 < rest;i1++) colrwn += "<td></td>";
  						}
  						colrwn += "</tr>";
  					}
  				});
  				$("#cantmatsreg").val(regs);
  				$("#tmatsreg").append(colrwn);
  			}
  		})
      .fail(function(e){alert('Error: ' + e.message);});
    }
  };
})();

waoo.modulos.navegacion = (function () {
  var waooserver = waoo.waooserver;
  return{
    verificaRedirect: function (n) {
      var ajx = $.ajax({
    		type: "post",
    		url: waooserver+"/usuarios/tipoUsuario",
    		dataType: "json",
    		data: {nickname:n}
      });
      ajx.done(function(resp) {
  			if(resp.error) alert('Error: ' + resp.error);
  			else if(resp.tipo==1) cargaPagina('data/crearsolicitud.html',2);
      })
      .fail(function(e){alert('Error: ' + e.message);});
    }
  };
})();

waoo.modulos.usuarios = (function () {
  var $regform = $("#RegisterForm");
  var $regform2 = $("#RegisterForm2");
  var waooserver = waoo.waooserver;
  return{
    login: function () {
      var ajx = $.ajax({
        type: "post",
    		url: waooserver+"/sesiones/login",
    		dataType: "json",
    		data: $("#LoginForm").serialize()
      });
      ajx.done(function(resp) {
        if(resp.error) alert('Error: ' + resp.error);
        else{
          if(resp.tipo==2) solicitudes.listarSolicitudesSinAsignarDiv("dirpc");
          else if(resp.tipo==1){
            setTimeout(function(){
              materias.cargarMateriaSelect("materia");
              solicitudes.eventoCreacion();
            },1000);
          }
        }
      })
      .fail(function(e){alert('Error: ' + e.message);});
    },
    logout: function () {
      window.localStorage.removeItem("nickname");
    	$("#loginsp").html("Iniciar sesi&oacute;n");
    	myApp.popup(".popup-login");
    	$("#loginimg").prop("src","images/icons/blue/user.png").parent().off('click').on('click',function(){myApp.popup(".popup-login");});
    	waoo.modulos.mensajeria.desactivaNotificaciones();
    	$("#snck").html("-");
    },
    register: function () {
      var ajx = $.ajax({
    		type: "post",
    		url: waooserver+"/usuarios/crearUsuario",
    		dataType: "json",
    		data: $regform.serialize()
      });
      ajx.done(function(resp) {
  			alert(resp.msg);
  			$regform[0].reset();
  		})
      .fail(function(e){alert('Error: ' + e.message);});
    },
    register2: function () {
      var ajx = $.ajax({
    		type: "post",
    		url: waooserver+"/usuarios/crearUsuario",
    		dataType: "json",
    		data: $regform2.serialize()
      });
      ajx.done(function(resp) {
  			alert(resp.msg);
  			$regform2[0].reset();
  		})
      .fail(function(e){alert('Error: ' + e.message);});
    },
    verificarLog: function () {
      var loggedin = window.localStorage.getItem("nickname");
    	if(loggedin) return true;
    	else return false;
    },
    cambiaIconosAsesor: function (n) {
      if(n){
        var $elem = $('.js-assistance-chat');
        var $elem2 = $("#crsolspn");
        var ajx = $.ajax({
    			type: "post",
    			url: waooserver+"/usuarios/tipoUsuario",
    			dataType: "json",
    			data: {nickname:nickname}
        });
        ajx.done(function(resp) {
  				if(resp.error) alert('Error: ' + resp.error);
  				else{
  					if(resp.tipo==2){
  						$elem.removeClass('hidden');
  						$elem2.html("Solicitudes libres");
  					}
  					else if(resp.tipo==1){
              $elem.addClass('hidden');
  						$elem2.html("Crear solicitud");
  					}
  				}
  			})
        .fail(function(e){alert('Error: ' + e.message);});
      }
      else verifcarga();
    },
    verifcarga: function () {
      var loggedin = window.localStorage.getItem("nickname");
      var $logimg = $("#loginimg");
      var $loginsp = $("#loginsp");
      var $snck = $("#snck");
    	if(!loggedin){
    		myApp.popup(".popup-login");
    		$logimg.prop("src","images/icons/blue/user.png");
    		$logimg.parent().off('click').on('click',function(){myApp.popup(".popup-login");});
        $loginsp.html("Iniciar sesi&oacute;n");
    		waoo.modulos.mensajeria.desactivaNotificaciones();
        $snck.html(loggedin);
    	}
    	else{
    		$logimg.prop("src","images/icons/blue/logout.png");
    		$logimg.parent().off('click').on('click',function(){logout();});
        $loginsp.html("Cerrar sesi&oacute;n");
    		cambiaIconosAsesor(loggedin);
        $snck.html("-");
    		if(waoo.modulos.mensajeria.tareanotificaciones==null) waoo.modulos.mensajeria.iniciaTarea();
    	}
    }
  };
})();

waoo.modulos.solicitudes = (function () {
  var waooserver = waoo.waooserver;
  return{
    eventoCreacion: function () {
      $('#creasolicitud').on('submit', function(e) {
        e.preventDefault();
        creasolicitud();
        return false;
      });
    }
  };
})();

waoo.modulos.mensajeria = (function () {
  var waooserver = waoo.waooserver;
  var tareanotificaciones = null;
  return{
    tareanotificaciones: tareanotificaciones,
    desactivaNotificaciones: function () {
      clearInterval(tareanotificaciones);
    	tareanotificaciones = null;
    },
    iniciaTarea: function () {
      contarNotificacionesSinLeer();
      tareanotificaciones = setInterval(function(){contarNotificacionesSinLeer();},60000);
    },
    contarNotificacionesSinLeer: function () {
      var nickname = window.localStorage.getItem("nickname");
    	var ajx = $.ajax({
    		type: "post",
    		url: waooserver+"/usuarios/notificacionesNoLeidasCant",
    		dataType: "json",
    		data: {nickname:nickname}
      });
      ajx.done(function(resp) {
  			if(resp.error) alert('Error: ' + resp.error);
  			else $("#notifcounter").html(resp.msg);
  		})
    	.fail(function(e){alert('Error: ' + e.message);});
    }
  };
})();
