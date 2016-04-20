'use strict';
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
		success : function(resp) {
			var json = JSON.parse(resp);
			if(json.msg=='ok') cargaPagina('data/success.html');
			else alert(json.msg);
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
								+"<tr><th>T&iacute;tulo</th><th>Estado</th><th>&nbsp;</th></tr>"
							+"</table>"
							+"<div id='detsols_"+el[0]+"' class='alert alert-dismissable'></div>"
						+"</div>");
						var json = JSON.parse(el[1]);
						$.each(json,function(i2,v){
							$("#tblmat_"+i).append("<tr>"
								+"<td>"+((v.titulo).substring(0,10)+"...")+"</td>"
								+"<td>"+v.estado+"</td>"
								+"<td>"
									+"<img style='margin:0;cursor:pointer;' src='images/icons/blue/plus.png' onclick='verDetalleSolicitud("+v.id+",\"detsols_"+el[0]+"\",1);'>"
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
								+"<tr><th>T&iacute;tulo</th><th>&nbsp;</th></tr>"
							+"</table>"
							+"<div id='detsols_"+el[0]+"' class='alert'></div>"
						+"</div>");
						var json = JSON.parse(el[1]);
						$.each(json,function(i2,v){
							$("#tblmat_"+i).append("<tr>"
								+"<td>"+((v.titulo).substring(0,10)+"...")+"</td>"
								+"<td>"
									+"<img style='margin:0;cursor:pointer;' src='images/icons/blue/plus.png' onclick='verDetalleSolicitud("+v.id+",\"detsols_"+el[0]+"\",1);'>"
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
				if(resp.msg=="[No hay solicitudes]") $("#"+id).html("<div class='alert'>"+(resp.msg)+"</div>");
				else{
					$("#"+id).html("<div class='alert table-responsive'>"
						+"<table id='tblmat_"+id+"' class='table table-condensed'>"
							+"<tr><th>T&iacute;tulo</th><th>Estado</th></tr>"
						+"</table>"
						+"<div id='detsols_"+id+"' class='alert'></div>"
					+"</div>");
					var json = JSON.parse(resp.msg);
					$.each(json,function(i2,v){
						$("#tblmat_"+id).append("<tr>"
							+"<td>"+((v.titulo).substring(0,10)+"...")+"</td>"
							+"<td style='vertical-align: bottom;'>"
								+v.estado
								+"<img style='margin:0;cursor:pointer;display:inline;' src='images/icons/blue/plus.png' onclick='verDetalleSolicitud("+v.id+",\"detsols_"+id+"\""+(v.asistente!='nousr'?',1':'')+");'>"
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
						+"<tr>"
							+"<th>T&iacute;tulo</th>"
							+"<td>"+((v.titulo).length>15?"<button class='btn' onclick='alertDetail(\""+(v.titulo).replace(/'/g, "")+"\");'>Ver</button>":v.titulo)+"</td>"
						+"</tr>"
						+"<tr>"+"<th>Fecha creado</th>"+"<td>"+v.fecharegistro+"</td>"+"</tr>"
						+"<tr>"+"<th>Materia</th>"+"<td>"+v.materia+"</td>"+"</tr>"
						+"<tr>"+"<th>Usuario</th>"+"<td>"+v.usuario+"</td>"+"</tr>"
						+"<tr>"
							+"<th>Descripcion</th>"
							+"<td>"
								+((v.descripcion).length>15?"<button class='btn' onclick='alertDetail(\""+(v.descripcion).replace(/'/g, "")+"\");'>Ver</button>":v.descripcion)
							+"</td>"
						+"</tr>"
						+"<tr>"
							+"<td colspan='2'>"
								+"<div id='listfiles'></div>"
							+"</td>"
						+"</tr>"
						+"<tr>"
							+"<td colspan='2'>"
								+(oferta==0 ?
									"<button type='button' class='btn btn-primary btn-lg btn-block' onclick='ventanaOfertas("+v.id+");'>Ver ofertas</button>"
									:(v.idestado==1 ?
										"<input id='voferta' type='number' class='form-control' placeholder='¿Cu&aacute;nto cobrar&iacute;as por hacer este trabajo? (solo n&uacute;meros)'>"
										+"<button type='button' class='btn btn-primary btn-lg btn-block' onclick='ofertar("+v.id+",this);'>Hacer oferta</button>"
										:(v.idestado==2?
											"<button type='button' class='btn btn-primary btn-lg btn-block' onclick='abrirSolucion("+v.id+",this);'>Enviar soluci&oacute;n</button>"
											:"<button type='button' class='btn btn-primary btn-lg btn-block' onclick='verSolucion("+v.id+",this);'>Ver soluci&oacute;n</button>"
										)
									)
								)
							+"</td>"
						+"</tr>"
					+"</table>";
					$("#"+iddiv).append(tbl);
					listarArchivosSolicitud(v.id,"listfiles");
				});
				if(oferta==1){
					$.ajax({
						type : 'post',
						url : waooserver+"/usuarios/marcarLeida",
						dataType: "json",
						data : {id:id},
						success : function(resp) {
							//ventanaOfertas(idtrabajo);
						},
						error: function(e) {
							alert("Error al conectar: "+e.message);
						}
					});
				}
			}
		},
		error: function(e) {
			$("#"+iddiv).html("<div class='alert alert-danger'>"+e.message+"</div>");
		}
	});
}

function verModalSolicitud(id,oferta){
	$("#detalleoferta").show();
	verDetalleSolicitud(id,'detalleoferta-cnt',oferta);
}

function alertDetail(txt){
	$("#detalletext-cnt").html("");
	$("#detalletext").show();
	$("#detalletext-cnt").html(txt);
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
				if(resp.msg=="") $("#"+iddiv).html(resp.msg);
				else{
					$("#"+iddiv).html("<table class='table table-condensed'><caption><b>Archivos solicitud</b></caption></table>");
					if(resp.msg=="No hay resultados") $("#"+iddiv+" table").append("<tr><td>"+resp.msg+"</td></tr>");
					else{
						var json = JSON.parse('['+resp.msg+']');
						$.each(json,function(i2,v){
							$("#"+iddiv+" table").append(
								"<tr>"
									+"<td style='vertical-align:bottom !important;'>"
										+"Archivo "+(i2+1)+" por "+v.usuario+" ("+v.tipoarchivo+") "
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
	$.ajax({
		type : 'get',
		url : waooserver+"/solicitudes/verArchivoSolicitud/"+id,
		dataType: "json",
		success : function(data) {
			var rfpg = window.open(data.msg,"_system","location=yes");
		},
		error: function(e) {
			alert(e.message);
		}
	});
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
	$("#"+iddiv).html("");
	$.ajax({
		type : 'post',
		url : waooserver+"/solicitudes/ofertasParaTrabajo",
		dataType: "json",
		data : {idtrabajo:id},
		success : function(resp) {
			if(resp.error) $("#"+iddiv).html("<div class='alert alert-danger'>"+resp.error+"</div>");
			else{
				$("#"+iddiv).html("<ul class='shop_items'></ul>");
				if(resp.msg=="No hay ofertas") $("#"+iddiv).html("<div class='alert alert-danger'>"+resp.msg+"</div>");
				else{
					var json = JSON.parse('['+resp.msg+']');
					$.each(json,function(i2,v){
						$("#"+iddiv+" ul").append("<li>"
							+"<div class='shop_thumb' style='position:initial !important;'><img src='images/shop_thumb1.jpg'></div>"
							+"<div class='shop_item_details'>"
								+"<h4 style='position:initial !important;'><a href='#'>"+v.asistente+"</a> <span class='stars'>"+v.calificacion+"</span></h4>"
								+"<div class='shop_item_price'>$ "+v.valor+"</div>"
							+"</div>"
							+"<a id='addtocart' style='cursor:pointer;' onclick='aceptarOferta("+v.id+","+v.valor+");'>ACEPTAR</a>"
						+"</li>");
					});
					$('.stars').stars();
				}
			}
		},
		error: function(e) {
			$("#"+iddiv).html(e.message);
		}
	});
}

function ventanaOfertas(id){
	cargaPagina("data/ofertas.html?id="+id);
	setTimeout(function(){
		verOfertas(id,"listaofertas");
	},1000);
}

function abrirSolucion(id){
	cargaPagina("data/formsolucion.html?id="+id+"&"+(Math.floor((Math.random() * 1000) + 1)));
	setTimeout(function(){
		verOfertas(id,"listaofertas");
		$('#formsolucion').on('submit', function(e) {
			e.preventDefault();
			enviarSolucion();
			return false;
		});
	},1000);
}

function enviarSolucion(){
	var n = window.localStorage.getItem("nickname");
	$("#nickasistente").val(n);
	var formData = new FormData( $("#formsolucion")[0] );
	$.ajax({
		url : waooserver+"/solicitudes/enviarSolucion",
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

function verSolucion(id){
	cargaPagina("data/versolucion.html?id="+id+"&"+(Math.floor((Math.random() * 1000) + 1)));
	var iddiv = "solucionfiles";
	setTimeout(function(){
		$.ajax({
			type : 'post',
			url : waooserver+"/solicitudes/verSolucion",
			dataType: "json",
			data : {idtrabajo:id},
			success : function(resp) {
				if(resp.error) $("#"+iddiv).html("<div class='alert alert-danger'>"+resp.error+"</div>");
				else{
					if(resp.msg=="No hay ofertas") $("#"+iddiv).html("<div class='alert alert-danger'>"+resp.msg+"</div>");
					else{
						$("#solucionfiles").html('');
						$("#solucionnotas").val('');
						$("#idtrabajo").val(0);
						var json = JSON.parse('['+resp.msg+']');
						$.each(json,function(i2,v){
							$("#solucionfiles").append(+"Archivo "+(i2+1)+" por "+v.usuario+" ("+v.tipoarchivo+") "
								+"<img style='display:inline !important; cursor:pointer;' src='images/icons/blue/plus.png' onclick='verArchivoSolicitud("+v.id+");'>");
							$("#solucionnotas").val(v.notas);
							$("#idtrabajo").val(id);
						});
					}
				}
			},
			error: function(e) {
				$("#"+iddiv).html(e.message);
			}
		});
		$('.raty').raty({
			click: function(score, evt){$('#calificacion').val(score);},
			hints: ['malo','regular','bueno','muy bueno','excelente']
		});
	},1000);
}

function aceptarSolucion(id){
	var califica = $("#calificacion option:selected").val();
	$.ajax({
		type : 'post',
		url : waooserver+"/solicitudes/aceptarSolucion",
		dataType: "json",
		data : {idtrabajo:id},
		success : function(resp) {
			alert(resp.msg);
		},
		error: function(e) {
			alert(e.message);
		}
	});
}

function aceptarOferta(id,valor){
	cargaPagina('data/pasarela.html',10);
	setTimeout(function () {
		$('.js-idSolicitud').val(id);
		$('.js-valorOferta').val(valor);
	},600);
}

function agregarFilaArchivo(){
	var cfiles = $("#cantfiles");
	var cant = (cfiles.val()*1) + 1;
	$(".uploadfiles").append('<input type="file" name="uploadfile'+cant+'">');
	cfiles.val(cant);
}
