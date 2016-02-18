//remember to use var 'waooserver' for getting server ip
function login(){
	var datos = $("#LoginForm").serialize();
	$.ajax({
		type: "post",
		url: waooserver+"/sesiones/login",
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
				cambiaIconosAsesor(nck);
				contarNotificacionesSinLeer();
				tareanotificaciones = setInterval(function(){contarNotificacionesSinLeer();},60000);
				conexionChat();
			}
			else alert(resp.msg);
		},
		error: function(e) {
			alert('Error: ' + e.message);
		}
	});
}

function logout(){
	window.localStorage.removeItem("nickname");
	$("#loginimg").prop("src","images/icons/blue/user.png");
	$("#loginsp").html("Iniciar sesi&oacute;n");
	myApp.popup(".popup-login");
	$("#loginimg").parent().bind('click',function(){myApp.popup(".popup-login");});
	clearInterval(tareanotificaciones);
	tareanotificaciones = null;
	logoutQuickblox();
}

function register(){
	var datos = $("#RegisterForm").serialize();
	$.ajax({
		type: "post",
		url: waooserver+"/usuarios/crearUsuario",
		dataType: "json",
		data: datos,
		success: function(resp) {
			alert(resp.msg);
			$("#RegisterForm")[0].reset();
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
		url: waooserver+"/usuarios/crearUsuario",
		dataType: "json",
		data: datos,
		success: function(resp) {
			alert(resp.msg);
			$("#RegisterForm2")[0].reset();
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

function cambiaIconosAsesor(nickname){
	if(nickname){
		$.ajax({
			type: "post",
			url: waooserver+"/usuarios/tipoUsuario",
			dataType: "json",
			data: {nickname:nickname},
			success: function(resp) {
				if(resp.error) alert('Error: ' + resp.error);
				else{
					if(resp.tipo==2){
						$("#crsolspn").html("Solicitudes libres");
					}
					else if(resp.tipo==1){
						$("#crsolspn").html("Crear solicitud");
					}
				}
			},
			error: function(e) {
				alert('Error: ' + e.message);
			}
		});
	}
	else{
		verifcarga();
	}
}

function cargarBancoSelect(id){
	$("#"+id).html('');
	$.ajax({
		type: "post",
		url: waooserver+"/bancos/listaBancos",
		dataType: "json",
		data: "",
		success: function(resp) {
			if(resp.error) $("#"+id).append("<option value='0'>"+resp.error+"</option>");
			else{
				$.each(resp.bancos,function(i,v){
					$("#"+id).append("<option value='"+v.id+"'>"+v.nombre+"</option>");
				});
			}
		},
		error: function(e) {
			alert('Error al conectar: ' + e.message);
		}
	});
}

function listaChecksMateria(id){
	$("#"+id).html('Buscando');
	$.ajax({
		type: "post",
		url: waooserver+"/materias/listarMaterias",
		dataType: "json",
		data: "",
		success: function(resp) {
			if(resp.error) $("#"+id).html("<div class='alert alert-danger'>"+resp.error+"</div>");
			else{
				$("#"+id).html("<table id='tmatsreg' class='table table-condensed'><caption><b>Materias en las que participar&aacute;s</b></caption></table>");
				var colrwn = "";
				var regs = resp.materias.length;
				var regsf = 3;
				$.each(resp.materias,function(i,v){
					if(i==0 || i%regsf==0){
						if(i>0) colrwn += "</tr>";
						colrwn += "<tr>";
					}
					colrwn += "<td><label style='display:inline;'><input type='checkbox' id='mat_"+i+"' name='mat_"+i+"' value='"+v.id+"'> "+v.nombre+"</label></td>";
					if(i>=(resp.materias.length-1)){
						if(regs%regsf>0){
							var fil = Math.round(regs/regsf);
							var rest = (fil*regsf) - regs;
							for(var i1=0;i1<rest;i1++){
								colrwn += "<td></td>";
							}
						}
						colrwn += "</tr>";
					}
				});
				$("#cantmatsreg").val(regs);
				$("#tmatsreg").append(colrwn);
			}
		},
		error: function(e) {
			$("#"+id).html("<div class='alert alert-danger'>Error al conectar: "+e.message+"</div>");
		}
	});
}

function contarNotificacionesSinLeer(){
	var nickname = window.localStorage.getItem("nickname");
	$.ajax({
		type: "post",
		url: waooserver+"/usuarios/notificacionesNoLeidasCant",
		dataType: "json",
		data: {nickname:nickname},
		success: function(resp) {
			if(resp.error) alert('Error: ' + resp.error);
			else{
				$("#notifcounter").html(resp.msg);
			}
		},
		error: function(e) {
			alert('Error al conectar: ' + e.message);
		}
	});
}

function listarNotificacionesSinLeer(){
	var nickname = window.localStorage.getItem("nickname");
	var iddiv = "listanotificaciones";
	$("#"+iddiv).html("");
	$.ajax({
		type: "post",
		url: waooserver+"/usuarios/notificacionesNoLeidas",
		dataType: "json",
		data: {nickname:nickname},
		success: function(resp) {
			if(resp.error) alert('Error: ' + resp.error);
			else{
				$("#"+iddiv).html("<ul class='posts'></ul>");
				if(resp.msg=="No se encontraron resultados"){
					$("#"+iddiv).html("<div class='alert alert-danger'>"+resp.msg+"</div>");
				}
				var json = JSON.parse('['+resp.msg+']');
				$.each(json,function(i2,v){
					var spl1 = (v.fecha).split(" ");
					var spl2 = spl1[0].split("-");
					$("#"+iddiv+" ul").append("<li>"
						+"<div class='post_entry' style='position:initial !important;'>"
							+"<div class='post_date' style='position:initial !important;'>"
								+"<br><span class='month'>"+spl2[0]+"-"+spl2[1]+"<span>"
								+"<span class='day'>"+spl2[2]+"<span>"
							+"</div>"
							+"<div class='post_title' style='position:initial !important;'>"
								+"<h2>"+v.titulo+"</h2>"
								+""+v.mensaje+"<br><br>"
								+"<button class='btn btn-primary btn-block' onclick='marcarLeida("+v.id+","+v.idtrabajo+");'>Ver ofertas</button>"
							+"</div>"
						+"</div>"
					+"</li>");
				});
			}
		},
		error: function(e) {
			$("#"+iddiv).html("Error al conectar: "+e.message);
		}
	});
}

function marcarLeida(id,idtrabajo){
	$.ajax({
		type : 'post',
		url : waooserver+"/usuarios/marcarLeida",
		dataType: "json",
		data : {id:id},
		success : function(data) {
			ventanaOfertas(idtrabajo);
		},
		error: function(e) {
			alert("Error al conectar: "+e.message);
		}
	});
}
