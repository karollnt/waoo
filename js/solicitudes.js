'use strict';
function creasolicitud(){
  var n = window.localStorage.getItem("nickname");
  $("#nck").val(n);
  var titulo = $.trim($('.js-titulo').val());
  var desc = $.trim($('.js-descripcion').val());
  var arch = $.trim($('.js-upload-file').val());
  if(titulo!='' && desc!='' && arch!=''){
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
  else {
    alert("Por favor, proporciona un titulo, una descripcion y un archivo para tu solicitud, de esa forma podremos ayudarte mejor :)");
  }
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

function renderSolicitudesAsignacion(lista,div,asignada) {
  var $div = $(div);
  for(var i=0;i<lista.length;i++){
    var el = lista[i].split(";");
    $div.append("<div class='alert alert-info'>"+el[0]+"</div>");
    if(el[1]=="[No hay solicitudes]"){
      $div.append("<div class='alert'>"+el[1]+"</div>");
    }
    else{
      $div.append("<div class='alert table-responsive'>"
        +"<table id='tblmat_"+i+"' class='table table-condensed'>"
          +"<tr><th>T&iacute;tulo</th>"+(asignada==1 ? "<th class='al-right'>Estado</th>" : "")+"<th>&nbsp;</th></tr>"
        +"</table>"
        +"<div id='detsols_"+el[0]+"' class='alert alert-dismissable'></div>"
      +"</div>");
      var json = JSON.parse(el[1]);
      $.each(json,function(i2,v){
        $("#tblmat_"+i).append("<tr>"
          +"<td>"+((v.titulo).substring(0,10)+"...")+"</td>"
          +(v.estado ? "<td>"+v.estado+"</td>" : "")
          +"<td>"
            +"<img style='margin:0;cursor:pointer;' src='images/icons/blue/plus.png' onclick='verDetalleSolicitud("+v.id+",\"detsols_"+el[0]+"\",1);'>"
          +"</td>"
        +"</tr>");
      });
    }
  }
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
        renderSolicitudesAsignacion(lista,"#"+id,1);
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
        renderSolicitudesAsignacion(lista,"#"+id,0);
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
          $("#"+id).html(
            '<div id="detsols_'+id+'" class="alert"></div>'
            +'<ul id="tblmat_'+id+'" class="features_list_detailed"></ul>'
          );
          var json = JSON.parse(resp.msg);
          $.each(json,function(i2,v){
            $("#tblmat_"+id).append(
              '<li style="cursor:pointer;" onclick="verDetalleSolicitud(\''+v.id+'\',\'detsols_'+id+'\''+(v.asistente!='sinasistente'?',1':'')+');">'
                +'<div class="feat_small_icon"><img src="images/icons/blue/favorites.png" alt="" title="" /></div>'
                +'<div class="feat_small_details">'
                  +'<h4><a href="#">'+((v.titulo).length > 30 ? (v.titulo).substring(0,30)+'...' : v.titulo)+'</a></h4>'
                  +'<span><b>Tutor</b>: '+v.asistente+'</span><br/>'
                  +'<span><b>Estado</b>: '+v.estado+'</span>'
                +'</div>'
                +'<span class="plus_icon">'
                  +'<img style="margin:0;cursor:pointer;display:inline;" src="images/icons/blue/plus.png" />'
                +'</span>'
              +'</li>'
            );
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
  oferta = typeof oferta !== 'undefined' ? oferta : 0;
  $.ajax({
    type: "post",
    url: waooserver+"/solicitudes/detallesSolicitud",
    dataType: "json",
    data: {id:id},
    success: function(resp) {
      if(resp.error) alertDetail('Error: ' + resp.error);
      else{
        var json = JSON.parse('['+resp.msg+']');
        //$("#"+iddiv).html("<button type='button' class='close' aria-label='close' onclick='$(\"#"+iddiv+"\").hide();'>&times;</button>");
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
            +"<tr>"+"<th>Fecha entrega</th>"+"<td>"+v.fechaentrega+"</td>"+"</tr>"
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
                    :(v.idestado==2 && (v.asistente==window.localStorage.getItem("nickname"))
                      ?"<button type='button' class='btn btn-primary btn-lg btn-block' onclick='abrirSolucion("+v.id+",this);'>Enviar soluci&oacute;n</button>"
                      :(v.idestado==3 && (v.usuario==window.localStorage.getItem("nickname"))
                        ?"<button type='button' class='btn btn-primary btn-lg btn-block' onclick='verSolucion("+v.id+",this);'>Aceptar soluci&oacute;n</button>"
                        :""
                      )
                    )
                    +(v.idestado>1 && v.idestado<4 && (v.asistente==window.localStorage.getItem("nickname") || v.usuario==window.localStorage.getItem("nickname"))
                      ? "<button type='button' class='btn btn-primary btn-lg btn-block' onclick='ventanaSustentacion("+v.id+");''>Sustentaci&oacute;n</button>" : "")
                  )
                )
              +"</td>"
            +"</tr>"
          +"</table>";
          alertDetail(tbl);
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
  verDetalleSolicitud(id,'detalleoferta-cnt',oferta);
}

function alertDetail(txt){
  $("#detalletext-cnt").html("");
  $("#detalletext").show();
  // $("#detalletext").css({"position": "fixed", "z-index": "1", "width": "90%", "background-color": "white"});
  $("#detalletext-cnt").html(txt);
}

function listarArchivosSolicitud(id,iddiv){
  var filesUrl = "https://waoofiles.s3.amazonaws.com/";
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
                    // +"<img style='display:inline !important; cursor:pointer;' src='images/icons/blue/plus.png' onclick='window.open(\""+filesUrl+v.nombrearchivo+"\",\"_system\");'>"
                    +"<img style='display:inline !important; cursor:pointer;' src='images/icons/blue/plus.png' onclick='verArchivoSolicitud("+v.id+");'>" //web y android
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
      if (rfpg == null || typeof(rfpg)=='undefined'){
        alert("Desactiva tu pop-up blocker!\n\nTratamos de abrir la url:\n"+data.msg+"\n\nVe a Configuracion > Seguridad para desactivarlo");
      }
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
          var html = "";
          $.each(json,function(i2,v){
            var calificacion = formatRound(v.calificacion,2);
            html += ("<li>"
              +"<div class='shop_thumb' style='position:initial !important;'><img class='js-shop-thumb-"+v.asistente+"' src=''></div>"
              +"<div class='shop_item_details'>"
                +"<h4 style='position:initial !important;'>"
                  +"<a href='#'>"+v.asistente+"</a> "
                  +"<span class='stars' title='"+calificacion+"'>"+calificacion+"</span> "
                  +"<span>("+calificacion+")</span>"
                +"</h4>"
                +"<h4 class='shop_item_price' style='position:initial !important;'>Precio: <b>$ "+v.valor+"</b></h4>"
                +"<div class='custom-accordion accordion-list'>"
                  +"<div class='accordion-item'>"
                    +"<div class='accordion-item-toggle'>"
                      + "<i class='icon icon-plus'>+</i>"
                      + "<i class='icon icon-minus'>-</i>"
                      + "<span>Datos adicionales</span>"
                    +"</div>"
                    +"<div class='accordion-item-content'>"
                      +"<h4 class='shop_item_price' style='position:initial !important;'>Institucion: </h4><span>"+v.institucion+"</span>"
                      +"<h4 class='shop_item_price' style='position:initial !important;'>Nivel Educativo: </h4><span>"+v.nivel+"</span>"
                    +"</div>"
                  +"</div>"
                  +"<div class='accordion-item'>"
                    +"<div class='accordion-item-toggle'>"
                      + "<i class='icon icon-plus'>+</i>"
                      + "<i class='icon icon-minus'>-</i>"
                      + "<span>Experiencia</span>"
                    +"</div>"
                    +"<div class='accordion-item-content'>"
                      +"<p>"+v.descripcion+"</p>"
                    +"</div>"
                  +"</div>"
                  +"<div class='accordion-item'>"
                    +"<div class='accordion-item-toggle'>"
                      + "<i class='icon icon-plus'>+</i>"
                      + "<i class='icon icon-minus'>-</i>"
                      + "<span>Comentarios</span>"
                    +"</div>"
                    +"<div class='accordion-item-content'>"
                      +"<div id='com"+i2+"' class='assistant-comments'></div>"
                    +"</div>"
                  +"</div>"
                +"</div>"
              +"</div>"
              +"<div>"
                +"<a id='addtocart' style='cursor:pointer;' onclick='aceptarOferta("+v.id+","+v.valor+");'>ACEPTAR</a>"
              +"</div>"
            +"</li>");
            colocarAvatarOf(".js-shop-thumb-"+v.asistente,v.asistente);
            mostrarComentariosTutor(v.idasistente,i2);
          });
          $("#" + iddiv + " ul").html(html);
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
    $('#idtrabajo').val(id);
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
    success : function(resp) {
      var json = JSON.parse(resp);
      alert(json.msg);
      cargaPagina('index.html',0);
    }
  });
}

function verSolucion(id){
  cargaPagina("data/versolucion.html?id="+id+"&"+(Math.floor((Math.random() * 1000) + 1)));
  var iddiv = "solucionfiles";
  setTimeout(function(){
    $("#idtrabajo").val(id);
    $('.raty').raty({
      click: function(score, evt){ $('#calificacion').val(score); },
      hints: ['malo','regular','bueno','muy bueno','excelente']
    });
  },1000);
}

function aceptarSolucion(id){
  var califica = $("#calificacion").val();
  var comentario = $("#comentario").val();
  $.ajax({
    type : 'post',
    url : waooserver+"/solicitudes/aceptarSolucion",
    dataType: "json",
    data : {idtrabajo:id, calificacion:califica, comentario:comentario},
    success : function(resp) {
      alert(resp.msg);
    },
    error: function(e) {
      alert(e.message);
    }
  });
}

function aceptarOferta(id,valor) {

  $.ajax({
    type : 'post',
    url : waooserver+"/solicitudes/aceptarPrecio",
    dataType: "json",
    data : {idpreciotrabajo:id,valor:valor},
    success : function(resp) {
    
      if(resp.error){
        alert(resp.error);
      }
      else{
    
        if(valor>resp.msg){
          valor = valor - resp.msg; 
              cargaPagina('data/pasarelaCredito.html',10, {idpreciotrabajo:id, valor :valor});
         }
        else {
          cargaPagina('data/chats.html');
          setTimeout(function () {
            misendbird.setChannel('');
            misendbird.init(0,resp.nickasistente,id);
          },200);
        }
      }
    },
    error: function(e) {
      alert(e.message);
    }
  });
}


function aceptarOferta0(id, valor) {
  cargaPagina('data/pasarelaCredito.html', 10, { idpreciotrabajo: id, valor: valor });
}

function efectuarPagoBT(formSelector) {
  var formData = $(formSelector).serialize();
  var ajx = $.ajax({
    type: 'post',
    url: waooserver + '/solicitudes/procesarPagoBT',
    dataType: 'json',
    data: formData
  });
  ajx.done(function (resp) {
    if (resp.msg.indexOf('Pago recibido satisfactoriamente') > -1) {
      cargaPagina('data/chats.html');
      setTimeout(function () {
        misendbird.setChannel('');
        misendbird.init(0, resp.nickasistente, resp.id);
      }, 400);
    }
    else {
      alert(resp.msg);
    }
  })
  .fail(function (e) {
    alert('Error: ' + e.message);
  });
}

function notificarAperturaChatOfertaAceptada(idpreciotrabajo,nickasistente,urlChat) {
  var ajax = $.ajax({
    type: 'post',
    url: waooserver+'/solicitudes/notificarAperturaChatOfertaAceptada',
    dataType: 'json',
    data: {nickasistente: nickasistente, urlChat: urlChat, idpreciotrabajo: idpreciotrabajo}
  });
}

function agregarFilaArchivo(){
  var cfiles = $("#cantfiles");
  var cant = (cfiles.val()*1) + 1;
  $(".uploadfiles").append('<input type="file" name="uploadfile'+cant+'">');
  cfiles.val(cant);
}

function consultarTokens() {
  $.ajax({
    type : 'post',
    url : waooserver+"/usuarios/cantidadTokens",
    dataType: "json",
    data : {nickname:window.localStorage.getItem("nickname")},
    success : function(resp) {
      
      if(resp.error) alert(resp.error);
      else{
        if (resp.msg>0) {
        $('.js-cantidad-tokens').html(resp.msg);
        $('#cantidad-tokens').show("fast");  
      }else{
    
          $('#cantidad-tokens').hide("fast");  
      }
      }
    },
    error: function(e) {
      alert(e.message);
    }
  });
}

function ventanaSustentacion(idtrabajo) {
  $.ajax({
    type : 'post',
    url : waooserver+"/solicitudes/canalChatTrabajo",
    dataType: "json",
    data : {idtrabajo: idtrabajo, nickname:window.localStorage.getItem("nickname")},
    success : function(resp) {
      if(resp.error) alert(resp.error);
      else{
        misendbird.disconnect();
        cargaPagina('data/chats.html');
        setTimeout(function () {
          misendbird.setChannel(resp.msg);
          misendbird.init(0,resp.nickusr,-1);
        },200);
      }
    },
    error: function(e) {
      alert(e.message);
    }
  });
}

function renderHistorialTrabajosAceptados(resp) {
  var html = '', total = 0;
  if(resp.error) alert(resp.error);
  else{
    if(resp.msg){
      var json = JSON.parse('['+resp.msg+']');
      $.each(json,function (i,v) {
        total += parseInt(v.tokens);
        html += '<tr>'
          +'<td>'+v.fecha+'</td>'
          +'<td>'+v.titulo+'</td>'
          +'<td>'+v.tokens+'</td>'
        +'</tr>';
      });
      html += '<tr><td colspan="2">Total</td><td>'+total+'</td></tr>';
    }
    else {
      html = '<tr><td colspan="3">No hay registros</td></tr>';
    }
    $('.js-historial').html(html);
  }
}

function historialTrabajosAceptados() {
  var ajx = $.ajax({
    type : 'post',
    url : waooserver+"/solicitudes/historialTrabajosAceptados",
    dataType: "json",
    data : {nickname:window.localStorage.getItem("nickname")}
  });
  ajx.done(function (resp) {
    renderHistorialTrabajosAceptados(resp);
  })
  .fail(function(e) {
    alert('Error: ' + e.message);
  });
}


function procesaPagoEfectivo(ev) {
  ev.preventDefault();
  var form = ev.target;
  form.querySelector('.js-user').value = window.localStorage.getItem("nickname");
  var formData = new FormData(form);
  var ajx = $.ajax({
    type: 'post',
    url: waooserver+'/solicitudes/ingresarSoporte',
    dataType: 'json',
    data: formData,
    async : false,
    cache : false,
    contentType : false,
    processData : false
  });
  ajx.done(function (resp) {
    alert(resp.msg);
  })
  .fail(function (e) {
    alert('Error: ' + e.message);
  });
}

var mis_datos = "";
function obtener_datos(id) {
  $("#"+id).html('');
  $.ajax({
    type: "post",
    url: waooserver+"/materias/listarMaterias",
    dataType: "json",
    data: "",
    success: function(data) {
      mis_datos = data.materias;
    },
    error: function(e) {
      alert('Error: ' + e.message);
    }
  });
}

function validar_existe(dato){
  $("#lista_tareas").html('');
  var existe=0;
  for (var i = 0; i <= mis_datos.length-1; i++) {
    var str = mis_datos[i].nombre.toLowerCase();
    var n = str.indexOf(dato.toLowerCase());
    if (n>-1) {
      $("#lista_tareas").append('<label class="radio_tareas"><input type="radio" name="idmateria" value="'+mis_datos[i].id+'">'+mis_datos[i].nombre+'</label>');
      existe=1;
    }
  }
  if (existe==0) {
    $("#lista_tareas").html('Si no encuentras tu materia por favor contactate con <a href="#" onclick="cargaPagina(\'data/soporte.html\',7);">Nosotros</a>');
  }
  $("#lista_tareas").show('slow');
}

function buscar_nombre_seleccionado(id){
  for (var i = 0; i <= mis_datos.length-1; i++) {  
    if(mis_datos[i].id==id) {
      $("#lista").val(mis_datos[i].nombre)
    }
  }
}

//Mostrar comentarios tutor
function mostrarComentariosTutor(id,capa){
  $.ajax({
    type: "post",
    url: waooserver+"/usuarios/mostrarComentariosTutor",
    dataType: "json",
    data: {id: id},
    success: function(data) {
      var html = "<div><ul>";
      for (var i = 0; i <= data.comen.length-1; i++) {
        html += "<li>"
          +"<b class='shop_item_price'>Materia: </b>"
          +"<span>"+data.comen[i].materia+"</span>"+"<br>"
          +"<b class='shop_item_price'>Comentario: </b>"
          +"<span>"+data.comen[i].comentario+"</span>"
        +"</li>";
      }
      html += "</ul></div>";
      $("#com" + capa).append(html);
    },
    error: function(e) {
      alert('Error: ' + e.message);
    }
  });
}