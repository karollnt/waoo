'use strict';
var misendbird = (function () {
  var apiToken = '99fd7bd7103f83c072ba46523572c2defd0dbee9';
  var appId = '10089199-90A1-4BBC-BC0F-B66F191282A0';
  var assistantId = '';
  var channelChat = '';
  var privUrl = '';
  var supportUrl = '444e4.soporte';
  var userAvatarSrc = '';
  var userId = '';
  function init(chan,asid,idpreciotrabajo) {
    idpreciotrabajo = typeof idpreciotrabajo !== 'undefined' ? idpreciotrabajo : null;
    userId = window.localStorage.getItem("nickname");
    userId = userId.toLowerCase();
    channelChat = chan;
    sendbird.init({
      "app_id": appId,
      "guest_id": userId,
      "user_name": userId,
      "image_url": '',
      "access_token": '',
      "successFunc": function(data) {
        switch (chan) {
          case 0:
            assistantId = asid;
            setTimeout(function () {
              privChat(idpreciotrabajo);
            },1000);
            break;
          case 1:
            joinSupport();
            break;
          default:
            console.log("No channel specified");
            break;
        }
      },
      "errorFunc": function(status, error) {
        console.log(status, error);
        putReconnectButton();
      }
    });
  }
  function joinChannel(channel) {
    sendbird.joinChannel(channel,{
      "successFunc" : function(data) {
        sendbird.connect({
          "successFunc": function(data) {
            getMessages();
          },
          "errorFunc": function(status, error) {
            console.log(status, error);
          }
        });
      },
      "errorFunc": function(status, error) {
        console.log(status, error);
      }
    });
  }
  function setAssistant(asid) {
    assistantId = asid;
  }
  function obtenerDireccionCanalChat() {
  	$.ajax({
  		type : 'post',
  		url : waooserver+"/solicitudes/obtenerDireccionCanalChat",
  		dataType: "json",
  		data : {idasistente:assistantId},
  		success : function(resp) {
  			if(resp.error) alert(resp.error);
  			else{
  				if(resp.msg!=''){
            privUrl = resp.msg;
            cargaPagina('data/chats.html');
            setTimeout(function () {
            	init(0,assistantId);
            },200);
          }
  			}
  		},
  		error: function(e) {
  			alert(e.message);
  		}
  	});
  }
  function privChat(idpreciotrabajo) {
    var guestIds = [userId,assistantId];
    if(privUrl!='') join1on1(idpreciotrabajo);
    else{
      sendbird.startMessaging(guestIds,{
        "successFunc" : function(data) {
          privUrl = data.channel.channel_url;
          // console.log({idasistente:assistantId,idusuario:userId,canal:privUrl});
          $.ajax({
        		type : 'post',
        		url : waooserver+"/solicitudes/actualizarDireccionCanalChat",
        		dataType: "json",
        		data : {idasistente:assistantId,idusuario:userId,canal:privUrl},
        		success : function(resp) {
        			if(resp.error) alert(resp.error);
        		},
        		error: function(e) {
        			alert(e.message);
        		}
        	});
          sendbird.connect({
            "successFunc" : function(data) {
              join1on1(idpreciotrabajo);
            },
            "errorFunc": function(status, error) {
              console.log(status, error);
            }
          });
        },
        "errorFunc": function(status, error) {
          console.log(status, error);
        }
      });
    }
  }
  function joinSupport() {
    joinChannel(supportUrl);
  }
  function join1on1(idpreciotrabajo) {
    idpreciotrabajo = typeof idpreciotrabajo !== 'undefined' ? idpreciotrabajo : null;
    sendbird.joinMessagingChannel(
      privUrl,{
        "successFunc" : function(data) {
          sendbird.connect({
            "successFunc" : function(data) {
              getMessages();
              if (idpreciotrabajo) {
                notificarAperturaChatOfertaAceptada(idpreciotrabajo,assistantId,privUrl);
              }
            },
            "errorFunc": function(status, error) {
              console.log(status, error);
            }
          });
        },
        "errorFunc": function(status, error) {
          console.log(status, error);
        }
      }
    );
  }
  sendbird.events.onMessageReceived = function(obj) {
    if($('.whatschat').length){
      appendToChat(obj.message,obj.user.guest_id);
      scrollContainer('.chat_box');
    }
    else {
      if(obj.user.guest_id!=userId){
        sendbird.getChannelInfo(function(data) {
          if(data.isMessaging){
            privUrl = data.channel_url;
            cargaPagina('data/chats.html');
    				setTimeout(function () {
    					init(0,obj.user.guest_id);
    				},200);
          }
        });
      }
    }
  };
  sendbird.events.onSystemMessageReceived = function(obj) {
    //posible push
  };
  sendbird.events.onMessagingChannelUpdateReceived = function(obj) {
    // do something...
  };
  function sendMsg() {
    var msg = $.trim($('#submit_message').val());
    if(msg!=''){
      sendbird.message(msg,'sucmsLScsz-ooa52a');
      $('#submit_message').val('');
    }
  }
  function scrollContainer(div) {
    $(div).stop().animate({
      scrollTop: $(div).prop('scrollHeight')
    }, 800);
  }
  function getMessages() {
    getAvatar();
    sendbird.getMessageLoadMore({
      "limit": 20,
      "successFunc" : function(data) {
        var moreMessage = data.messages;
        $('.chat_box').html("");
        $.each(moreMessage.reverse(), function(index, msg) {
          appendToChat(msg.payload.message,msg.payload.user.guest_id);
        });
        scrollContainer('.chat_box');
      },
      "errorFunc": function(status, error) {
        console.log(status, error);
        putReconnectButton();
      }
    });
  }
  function putReconnectButton() {
    $('.chat_box').html("<button type='button' onclick='misendbird.reconnect();'>Recargar</button>");
  }
  function getAvatar() {
    var nickname = window.localStorage.getItem("nickname");
  	$.ajax({
  		type : 'post',
  		url : waooserver+"/usuarios/verificaAvatar",
  		dataType: "json",
  		data : {nickname:nickname},
  		success : function(resp) {
  			var idimg = resp.msg;
  			if(idimg*1==0) userAvatarSrc = "images/default_avatar.gif";
  			else userAvatarSrc = waooserver+"/usuarios/verAvatar/"+idimg+"/"+((Math.random()*1000)/1000);
  		},
  		error: function(e) { alert("Error al obtener avatar: "+e.message); }
  	});
  }
  function appendToChat(msg,nck) {
    var loc = nck==userId?1:0;
    var rnorm = (loc==1?' chat_message_right':'');
    nck = typeof nck === "undefined"?userId:nck;
    var imgav = loc==1?userAvatarSrc:'images/default_avatar.gif';
    var html =
    "<div class='chat_message_wrapper"+rnorm+"'>"
      +"<div class='chat_user_avatar'>"
        +"<a href='#'><img alt='avatar' src='"+imgav+"' class='md-user-image'></a>"
      +"</div>"
      +"<ul class='chat_message'>"
        +"<li>"
          + msg + "<span class='chat_message_time'>"+nck+"</span>"
        +"</li>"
      +"</ul>"
    +"</div>";
    $('.chat_box').append(html);
  }
  function getChannel() {
    return channelChat;
  }
  function setChannel(can) {
    privUrl = can;
  }
  function reconnect() {
    sendbird.disconnect();
    init(channelChat,assistantId);
  }
  function disconnect() {
    sendbird.disconnect();
  }
  function preInit(nick) {
    sendbird.init({
      "app_id": appId,
      "guest_id": nick,
      "user_name": nick,
      "image_url": '',
      "access_token": '',
      "successFunc": function(data) {
        joinSupport();
      },
      "errorFunc": function(status, error) {
        console.log(status, error);
        putReconnectButton();
      }
    });
  }

  return {
    init: init,
    sendMsg: sendMsg,
    getMessages: getMessages,
    setAssistant: setAssistant,
    privChat: privChat,
    joinSupport: joinSupport,
    getChannel: getChannel,
    reconnect: reconnect,
    obtenerDireccionCanalChat: obtenerDireccionCanalChat,
    preInit: preInit,
    setChannel: setChannel,
    disconnect: disconnect
  };
})();
