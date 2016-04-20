'use strict';
var misendbird = (function () {
  var appId = 'A46AFE6E-E876-482B-BBAF-F736F7D02AFD';
  var apiToken = '7ba731169f7de777d71e1b613426ebe63c1efe5f';
  var userId = window.localStorage.getItem("nickname");
  var assistantId = '';
  var supportUrl = '711cc.support_waoo';
  var privUrl = '711cc.privchat_waoo';
  var bgtask = null;
  var channelChat = '';
  var userAvatarSrc = '';
  var init = function (chan,asid) {
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
              privChat();
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
  };
  var joinChannel = function (channel) {
    sendbird.joinChannel(channel,{
      "successFunc" : function(data) {
        console.log(data);
        sendbird.connect({
          "successFunc": function(data) {
            console.log(data);
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
  };
  var setAssistant = function (asid) {
    assistantId = asid;
  };
  var privChat = function () {
    var guestIds = [userId,assistantId];
    sendbird.startMessaging(guestIds,{
      "successFunc" : function(data) {
        console.log(data);
        sendbird.connect({
          "successFunc" : function(data) {
            //data.channel.channel_url
            join1on1();

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
  };
  var joinSupport = function () {
    joinChannel(supportUrl);
  };
  var join1on1 = function () {
    sendbird.joinMessagingChannel(
      privUrl,{
        "successFunc" : function(data) {
          console.log(data);
          sendbird.connect({
            "successFunc" : function(data) {
              console.log(data);
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
      }
    );
  };
  var sendMsg = function () {
    var msg = $.trim($('#submit_message').val());
    if(msg!=''){
      sendbird.message(msg);
      $('#submit_message').val('');
      appendToChat(msg,userId);
    }
  };
  var scrollContainer = function (div) {
    $(div).stop().animate({
      scrollTop: $(div).prop('scrollHeight')
    }, 800);
  };
  var getMessages = function () {
    $('.chat_box').html("<img src='images/ajax-loader.gif'/>");
    getAvatar();
    sendbird.getMessageLoadMore({
      "limit": 20,
      "successFunc" : function(data) {
        console.log(data);
        moreMessage = data["messages"];
        $('.chat_box').html("");
        $.each(moreMessage.reverse(), function(index, msg) {
          appendToChat(msg.payload.message,msg.payload.user.guest_id);
        });
        scrollContainer('.whatschat');
      },
      "errorFunc": function(status, error) {
        console.log(status, error);
        putReconnectButton();
      }
    });
  };
  var putReconnectButton = function () {
    $('.chat_box').html("<button type='button' onclick='misendbird.reconnect();'>Recargar</button>");
  };
  var getAvatar = function () {
    var nickname = window.localStorage.getItem("nickname");
  	$.ajax({
  		type : 'post',
  		url : waooserver+"/usuarios/verificaAvatar",
  		dataType: "json",
  		data : {nickname:nickname},
  		success : function(resp) {
  			var idimg = resp.msg;
  			if(idimg*1==0){
  				userAvatarSrc = "images/default_avatar.gif";
  			}
  			else{
  				userAvatarSrc = waooserver+"/usuarios/verAvatar/"+idimg+"/"+((Math.random()*1000)/1000);
  			}
  		},
  		error: function(e) {
  			alert("Error al conectar: "+e.message);
  		}
  	});
  };
  var appendToChat = function (msg,nck) {
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
  };
  var reviewMessages = function () {
    bgtask = setInterval(function () {
      getMessages();
    },2000);
  };
  var killTask = function () {
    clearInterval(bgtask);
    bgtask = null;
  };
  var getChannel = function () {
    return channelChat;
  };
  var reconnect = function () {
    init(channelChat,assistantId);
  };
  return{
    init: init,
    sendMsg: sendMsg,
    getMessages: getMessages,
    setAssistant: setAssistant,
    privChat: privChat,
    joinSupport: joinSupport,
    reviewMessages: reviewMessages,
    killTask: killTask,
    getChannel: getChannel,
    reconnect: reconnect
  };
})();
