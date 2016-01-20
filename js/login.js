//remember to use var 'waooserver' for getting server ip
function login(){
	var datos = $("LoginForm").serialize();
	$.ajax({
		type: "post",
		url: "http://"+waooserver+"/waoobackend/sesiones/login",
		dataType: "json",
		data: datos,
		success: function(data) {
			obj = JSON.parse(data);
			console.log(obj);
			alert("algo");
		},
		error: function(e) {
			alert('Error: ' + e.message);
		}
	});
	//maybe crossDomain true
}

function logout(){
	window.localStorage.removeItem("nickname");
}

function register(){
	var datos = $("RegisterForm").serialize();
	$.ajax({
		type: "post",
		url: "http://"+waooserver+"/waoobackend/usuarios/crearUsuario",
		dataType: "json",
		data: datos,
		success: function(data) {
			obj = JSON.parse(data);
			console.log(obj);
			alert("algo");
		},
		error: function(e) {
			alert('Error: ' + e.message);
		}
	});
}

function register2(){
	var datos = $("RegisterForm2").serialize();
	$.ajax({
		type: "post",
		url: "http://"+waooserver+"/waoobackend/usuarios/crearUsuario",
		dataType: "json",
		data: datos,
		success: function(data) {
			obj = JSON.parse(data);
			console.log(obj);
			alert("algo");
		},
		error: function(e) {
			alert('Error: ' + e.message);
		}
	});
}