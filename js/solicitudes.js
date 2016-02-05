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
				if(resp.tipo==1){
					listarSolicitudesCreadasMatDiv("listarsols");
				}
				else if(resp.tipo==2){
					listarSolicitudesAsignadasMatDiv("listarsols");
				}
			}
		},
		error: function(e) {
			alert('Error: ' + e.message);
		}
	});
}

function listarSolicitudesAsignadasMatDiv(id){
	$("#"+id).html('');
	var n = window.localStorage.getItem("nickname");
	$.ajax({
		type: "post",
		url: waooserver+"/solicitudes/solicitudesPorMateriaAsistente",
		dataType: "json",
		data: {nickname:n},
		success: function(resp) {
			if(resp.error) $("#"+id).html("<div class='alert alert-danger'>"+resp.error+"</div>");
			else{
				var lista = (resp.msg).split("|");
				for(var i=0;i<lista.length;i++){
					var el = lista[i].split(";");
					$("#"+id).append("<div class='alert alert-info'>"+el[0]+"</div>");
					if(el[1]=="[No hay solicitudes]"){
						$("#"+id).append("<div class='alert'>"+el[1]+"</div>");
					}
					else{
						$("#"+id).append("<div class='alert table-responsive'>"
							+"<table id='tblmat_"+i+"' class='table table-condensed'>"
								+"<tr><th>T&iacute;tulo</th><th>Descripci&oacute;n</th><th>Fecha creado</th><th>Estado</th><th>&nbsp;</th></tr>"
							+"</table>"
							+"<div id='detsols_"+el[0]+"' class='alert alert-dismissable'></div>"
						+"</div>");
						var json = JSON.parse(el[1]);
						$.each(json,function(i2,v){
							$("#tblmat_"+i).append("<tr>"
								+"<td>"+v.titulo+"</td>"
								+"<td>"+(v.descripcion==''?'':(v.descripcion.substring(0,20))+"...")+"</td>"
								+"<td>"+v.fecharegistro+"</td>"
								+"<td>"+v.estado+"</td>"
								+"<td>"
									+"<img style='margin:0;cursor:pointer;' src='images/icons/blue/plus.png' onclick='verDetalleSolicitud("+v.id+",\"detsols_"+el[0]+"\");'>"
								+"</td>"
							+"</tr>");
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
	var n = window.localStorage.getItem("nickname");
	$("#"+id).html('');
	$("#pages_maincontent .page_title").html('Solicitudes disponibles');
	$.ajax({
		type: "post",
		url: waooserver+"/solicitudes/solicitudesSinAsignarAsistente",
		dataType: "json",
		data: {nickname:n},
		success: function(resp) {
			if(resp.error) $("#"+id).html("<div class='alert alert-danger'>"+resp.error+"</div>");
			else{
				var lista = (resp.msg).split("|");
				for(var i=0;i<lista.length;i++){
					var el = lista[i].split(";");
					$("#"+id).append("<div class='alert alert-info'>"+el[0]+"</div>");
					if(el[1]=="[No hay solicitudes]"){
						$("#"+id).append("<div class='alert'>"+el[1]+"</div>");
					}
					else{
						$("#"+id).append("<div class='alert table-responsive'>"
							+"<table id='tblmat_"+i+"' class='table table-condensed'>"
								+"<tr><th>T&iacute;tulo</th><th>Descripci&oacute;n</th><th>Fecha creado</th><th>&nbsp;</th></tr>"
							+"</table>"
							+"<div id='detsols_"+el[0]+"' class='alert alert-dismissable'></div>"
						+"</div>");
						var json = JSON.parse(el[1]);
						$.each(json,function(i2,v){
							$("#tblmat_"+i).append("<tr>"
								+"<td>"+v.titulo+"</td>"
								+"<td>"+(v.descripcion==''?'':(v.descripcion.substring(0,20))+"...")+"</td>"
								+"<td>"+v.fecharegistro+"</td>"
								+"<td>"
									+"<img style='margin:0;cursor:pointer;' src='images/icons/blue/plus.png' onclick='verDetalleSolicitud("+v.id+",\"detsols_"+el[0]+"\",1);'>"
								+"</td>"
							+"</tr>");
						});
					}
					//$("#"+id).append();
				}
			}
		},
		error: function(e) {
			$("#"+id).html("<div class='alert alert-danger'>"+e.message+"</div>");
		}
	});
}

function listarSolicitudesCreadasMatDiv(id){
	$("#"+id).html('');
	var n = window.localStorage.getItem("nickname");
	$.ajax({
		type: "post",
		url: waooserver+"/solicitudes/solicitudesCreadasUsuario",
		dataType: "json",
		data: {nickname:n},
		success: function(resp) {
			if(resp.error) $("#"+id).html("<div class='alert alert-danger'>"+resp.error+"</div>");
			else{
				if(resp.msg=="[No hay solicitudes]"){
					$("#"+id).html("<div class='alert'>"+(resp.msg)+"</div>");
				}
				else{
					$("#"+id).html("<div class='alert table-responsive'>"
						+"<table id='tblmat_"+id+"' class='table table-condensed'>"
							+"<tr><th>T&iacute;tulo</th><th>Descripci&oacute;n</th><th>Fecha creado</th><th>Estado</th><th>&nbsp;</th></tr>"
						+"</table>"
						+"<div id='detsols_"+id+"' class='alert alert-dismissable'></div>"
					+"</div>");
					var json = JSON.parse(resp.msg);
					$.each(json,function(i2,v){
						$("#tblmat_"+id).append("<tr>"
							+"<td>"+v.titulo+"</td>"
							+"<td>"+(v.descripcion==''?'':(v.descripcion.substring(0,20))+"...")+"</td>"
							+"<td>"+v.fecharegistro+"</td>"
							+"<td>"+v.estado+"</td>"
							+"<td>"
								+"<img style='margin:0;cursor:pointer;' src='images/icons/blue/plus.png' onclick='verDetalleSolicitud("+v.id+",\"detsols_"+id+"\");'>"
							+"</td>"
						+"</tr>");
					});
				}
			}
		},
		error: function(e) {
			$("#"+id).html("<div class='alert alert-danger'>"+e.message+"</div>");
		}
	});
}

function verDetalleSolicitud(id,iddiv,oferta){
	$("#"+iddiv).html('');
	$("#"+iddiv).show();
	oferta = typeof oferta !== 'undefined' ? oferta : 0;
	$.ajax({
		type: "post",
		url: waooserver+"/solicitudes/detallesSolicitud",
		dataType: "json",
		data: {id:id},
		success: function(resp) {
			if(resp.error) $("#"+iddiv).html('Error: ' + resp.error);
			else{
				var json = JSON.parse('['+resp.msg+']');
				$("#"+iddiv).html("<button type='button' class='close' aria-label='close' onclick='$(\"#"+iddiv+"\").hide();'>&times;</button>");
				$.each(json,function(i2,v){
					var tbl = "<table class='table table-condensed'>"
						+"<caption><b>Detalles solicitud</b></caption>"
						+"<tr>"+"<th>T&iacute;tulo</th>"+"<td>"+v.titulo+"</td>"+"</tr>"
						+"<tr>"+"<th>Fecha creado</th>"+"<td>"+v.fecharegistro+"</td>"+"</tr>"
						+"<tr>"+"<th>Materia</th>"+"<td>"+v.materia+"</td>"+"</tr>"
						+"<tr>"+"<th>Usuario</th>"+"<td>"+v.usuario+"</td>"+"</tr>"
						+"<tr>"+"<th>Descripcion</th>"+"<td>"+v.descripcion+"</td>"+"</tr>"
						+"<tr>"
							+"<td colspan='2'>"
								+"<div id='listfiles'></div>"
							+"</td>"
						+"</tr>"
						+"<tr>"
							+"<td colspan='2'>"
								+(oferta==0 ? 
									""
									:"<input id='voferta' type='number' class='form-control' placeholder='¿Cu&aacute;nto cobrar&iacute;as por hacer este trabajo? (solo n&uacute;meros)'>"
									+"<button type='button' class='btn btn-default btn-lg btn-block' onclick='ofertar("+v.id+",this);'>Hacer oferta</button>")
							+"</td>"
						+"</tr>"
					+"</table>";
					$("#"+iddiv).append(tbl);
					listarArchivosSolicitud(v.id,"listfiles");
					if(oferta==0) verOfertas(v.id,"ofertas");
				});
			}
		},
		error: function(e) {
			$("#"+iddiv).html("<div class='alert alert-danger'>"+e.message+"</div>");
		}
	});
}

function listarArchivosSolicitud(id,iddiv){
	$.ajax({
		type: "post",
		url: waooserver+"/solicitudes/listaArchivosTrabajo",
		dataType: "json",
		data: {idtrabajo:id},
		success: function(resp) {
			if(resp.error) $("#"+iddiv).html("<div class='alert alert-danger'>"+resp.error+"</div>");
			else{
				if(resp.msg==""){
					$("#"+iddiv).html(resp.msg);
				}
				else{
					$("#"+iddiv).html("<table class='table table-condensed'><caption><b>Archivos solicitud</b></caption></table>");
					if(resp.msg=="No hay resultados"){
						$("#"+iddiv+" table").append("<tr><td>"+resp.msg+"</td></tr>");
					}
					else{
						var json = JSON.parse('['+resp.msg+']');
						$.each(json,function(i2,v){
							$("#"+iddiv+" table").append(
								"<tr>"
									+"<td style='vertical-align:bottom !important;'>"
										+"Archivo "+i2+" por "+v.usuario+" ("+v.tipoarchivo+") "
										+"<img style='display:inline !important; cursor:pointer;' src='images/icons/blue/plus.png' onclick='verArchivoSolicitud("+v.id+");'>"
									+"</td>"
								+"</tr>");
						});
					}
					
				}
				
			}
		},
		error: function(e) {
			$("#"+iddiv).html("<div class='alert alert-danger'>"+e.message+"</div>");
		}
	});
}

function verArchivoSolicitud(id){
	var rfpg = window.open(waooserver+"/solicitudes/verArchivoSolicitud/"+id,"_system","location=yes");
}

function ofertar(id,elem){
	var valor = $.trim($("#voferta").val());
	var n = window.localStorage.getItem("nickname");
	$(elem).closest("div").hide();
	$.ajax({
		type : 'post',
		url : waooserver+"/solicitudes/enviarPrecioTrabajo",
		dataType: "json",
		data : {nickname:n,idtrabajo:id,valor:valor},
		success : function(data) {
			alert(data.msg);
		},
		error: function(e) {
			alert(e.message);
		}
	});
}

function verOfertas(id,iddiv){
	$.ajax({
		type : 'post',
		url : waooserver+"/solicitudes/ofertasParaTrabajo",
		dataType: "json",
		data : {idtrabajo:id},
		success : function(resp) {
			if(resp.error) $("#"+iddiv).html("<div class='alert alert-danger'>"+resp.error+"</div>");
			else{
				$("#"+iddiv).html("<table class='table table-condensed'><caption><b>Ofertas recibidas</b></caption></table>");
				if(resp.msg=="No hay ofertas"){
					$("#"+iddiv+" table").append("<tr><td>"+resp.msg+"</td></tr>");
				}
				else{
					var json = JSON.parse('['+resp.msg+']');
					$.each(json,function(i2,v){
						$("#"+iddiv+" table").append("<tr>"
							+"<td><img src='images/icons/blue/love.png'></td>"
							+"<td>"+v.asistente+"</td>"
							+"<td>"+v.valor+"</td>"
							+"<td><a href='#' class='open-panel'>Aceptar</a></td>"
						+"</tr>");
					});
				}
			}
		},
		error: function(e) {
			$("#"+iddiv).html(e.message);
		}
	});
}