//remember to use var 'waooserver' for getting server ip
var tareanotificaciones = null;
function login(){
	var datos = $("#LoginForm").serialize();
	$.ajax({
		type: "post",
		url: "http://"+waooserver+"/waoobackend/sesiones/login",
		dataType: "json",
		data: datos,
		success: function(resp) {
			if(resp.msg == "ok"){
				$("#loginimg").prop("src","images/icons/blue/logout.png");
				$("#loginsp").html("Cerrar sesi&oacute;n");
				myApp.closeModal('.popup-login');
				var nck = $("#LoginForm input[name='nickname']").val();
				$("#LoginForm")[0].reset();
				window.localStorage.setItem("nickname",nck);
				$("#loginimg").parent().unbind('click');
				$("#loginimg").parent().bind('click',function(){logout();});
			}
			else alert(resp.msg);
		},
		error: function(e) {
			alert('Error: ' + e.message);
		}
	});
	//maybe crossDomain true
}

function logout(){
	window.localStorage.removeItem("nickname");
	$("#loginimg").prop("src","images/icons/blue/user.png");
	$("#loginsp").html("Iniciar sesi&oacute;n");
	myApp.popup(".popup-login");
	$("#loginimg").parent().bind('click',function(){myApp.popup(".popup-login");});
	console.log(window.localStorage.getItem("nickname"));
}

function register(){
	var datos = $("#RegisterForm").serialize();
	$.ajax({
		type: "post",
		url: "http://"+waooserver+"/waoobackend/usuarios/crearUsuario",
		dataType: "json",
		data: datos,
		success: function(resp) {
			alert(resp.msg);
		},
		error: function(e) {
			alert('Error: ' + e.message);
		}
	});
}

function register2(){
	var datos = $("#RegisterForm2").serialize();
	$.ajax({
		type: "post",
		url: "http://"+waooserver+"/waoobackend/usuarios/crearUsuario",
		dataType: "json",
		data: datos,
		success: function(resp) {
			alert(resp.msg);
		},
		error: function(e) {
			alert('Error: ' + e.message);
		}
	});
}

function verificarLog(){
	var loggedin = window.localStorage.getItem("nickname");
	if(loggedin) return true;
	else return false;
}