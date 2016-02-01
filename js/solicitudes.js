function creasolicitud(){
	var n = window.localStorage.getItem("nickname");
	$("#nck").val(n);
	var formData = new FormData( $("#creasolicitud")[0] );
	$.ajax({
		url : waooserver+"/solicitudes/crearSolicitud",
		type : 'POST',
		data : formData,
		async : false,
		cache : false,
		contentType : false,
		processData : false,
		success : function(data) {
			alert(data.msg);
		}
	});
}

function cargarMateriaSelect(id){
	$("#"+id).html('');
	$.ajax({
		type: "post",
		url: waooserver+"/materias/listarMaterias",
		dataType: "json",
		data: "",
		success: function(resp) {
			if(resp.error) $("#"+id).append("<option value='0'>"+resp.error+"</option>");
			else{
				$.each(resp.materias,function(i,v){
					$("#"+id).append("<option value='"+v.id+"'>"+v.nombre+"</option>");
				});
			}
		},
		error: function(e) {
			alert('Error: ' + e.message);
		}
	});
}

function cargaSolicitudesUsuario(nickname){
	$.ajax({
		type: "post",
		url: waooserver+"/usuarios/tipoUsuario",
		dataType: "json",
		data: {nickname:nickname},
		success: function(resp) {
			if(resp.error) alert('Error: ' + resp.error);
			else{
				if(resp.tipo==2){
					listarSolicitudesSinAsignarMatDiv("listarsols",nickname);
				}
			}
		},
		error: function(e) {
			alert('Error: ' + e.message);
		}
	});
}

function listarSolicitudesSinAsignarMatDiv(id,nickname){
	$("#"+id).html('');
	$.ajax({
		type: "post",
		url: waooserver+"/solicitudes/solicitudesPorMateriaAsistente",
		dataType: "json",
		data: {nickname:nickname},
		success: function(resp) {
			if(resp.error) $("#"+id).html("<div class='alert alert-danger'>"+resp.error+"</div>");
			else{
				//$("#"+id).html("<div class='alert alert-info'>"+resp.msg+"</div>");
				var lista = (resp.msg).split("|");
				for(var i=0;i<lista.length;i++){
					var el = lista[i].split(";");
					$("#"+id).append("<div class='alert alert-info'>"+el[0]+"</div>");
					if(el[1]=="No hay solicitudes"){
						$("#"+id).append("<div class='alert'>"+el[1]+"</div>");
					}
					else{
						var json = JSON.parse(el[1]);
						$.each(json,function(i,v){
							$("#"+id).append("<div class='alert'><b>"+v.titulo+"</b>"+(v.descripcion==''?'':' - '+(v.descripcion.substring(0,20)))+"</div>");
						});
					}
				}
			}
		},
		error: function(e) {
			$("#"+id).html("<div class='alert alert-danger'>"+e.message+"</div>");
		}
	});
}

function listarSolicitudesSinAsignarDiv(id){
	$("#"+id).html('');
	$.ajax({
		type: "post",
		url: waooserver+"/solicitudes/solicitudesSinAsignar",
		dataType: "json",
		data: "",
		success: function(resp) {
			if(resp.error) $("#"+id).append("<option value='0'>"+resp.error+"</option>");
			else{
				$.each(resp.materias,function(i,v){
					$("#"+id).append("<option value='"+v.id+"'>"+v.nombre+"</option>");
				});
			}
		},
		error: function(e) {
			$("#"+id).html("<div class='alert alert-danger'>"+e.message+"</div>");
		}
	});
}