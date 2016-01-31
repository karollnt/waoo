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