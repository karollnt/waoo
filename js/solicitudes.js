function creasolicitud(){
	var n = window.localStorage.getItem("nickname");
	var datos = $("#creasolicitud").serialize()+"&nickname="+n;
	alert(datos);
	$.ajax({
		type: "post",
		url: "http://"+waooserver+"/waoobackend/solicitudes/crearSolicitud",
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

function cargarMateriaSelect(id){
	$("#"+id).html('');
	$.ajax({
		type: "post",
		url: "http://"+waooserver+"/waoobackend/materias/listarMaterias",
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