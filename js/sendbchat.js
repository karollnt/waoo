'use strict';
var misendbird = (function () {
  var appId = 'A46AFE6E-E876-482B-BBAF-F736F7D02AFD';
  var apiToken = '7ba731169f7de777d71e1b613426ebe63c1efe5f';
  var userId = window.localStorage.getItem("nickname");
  var assistantId = '';
  var supportUrl = '711cc.support_waoo';
  var privUrl = 'sendbird_group_messaging_6302035_d737810ab733dd2e846f4d36d4814e0b4c93431b';
  var bgtask = null;
  var channelChat = '';
  var userAvatarSrc = '';
  var lastmessageid = 0;
  function init(chan,asid) {
    killTask();
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
              privChat();
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
        // console.log(data);
        var revie = false;
        if(lastmessageid != data.last_message.msg_id){
          lastmessageid = data.last_message.msg_id;
          revie = true;
        }
        sendbird.connect({
          "successFunc": function(data) {
            // console.log(data);
            if(revie){
              getMessages();
              reviewMessages();
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
    });
  }
  function setAssistant(asid) {
    assistantId = asid;
  }
  function privChat() {
    var guestIds = [userId,assistantId];
    if(privUrl!='') join1on1();
    else{
      sendbird.startMessaging(guestIds,{
        "successFunc" : function(data) {
          privUrl = data.channel.channel_url;
          sendbird.connect({
            "successFunc" : function(data) {
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
    }
  }
  function joinSupport() {
    joinChannel(supportUrl);
  }
  function join1on1() {
    sendbird.joinMessagingChannel(
      privUrl,{
        "successFunc" : function(data) {
          // console.log(data);
          var revie = false;
          if(lastmessageid != data.last_message.msg_id){
            lastmessageid = data.last_message.msg_id;
            revie = true;
          }
          sendbird.connect({
            "successFunc" : function(data) {
              //console.log(data);
              if(revie){
                getMessages();
                reviewMessages();
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
  function sendMsg() {
    var msg = $.trim($('#submit_message').val());
    if(msg!=''){
      sendbird.message(msg);
      $('#submit_message').val('');
      appendToChat(msg,userId);
      scrollContainer('.whatschat');
      setTimeout(function () {
        reviewMessages();
      },1200);
    }
  }
  function scrollContainer(div) {
    $(div).stop().animate({
      scrollTop: $(div).prop('scrollHeight')
    }, 800);
  }
  function getMessages() {
    //$('.chat_box').html("<img src='images/ajax-loader.gif'/>");
    getAvatar();
    sendbird.getMessageLoadMore({
      "limit": 20,
      "successFunc" : function(data) {
        //console.log(data);
        var moreMessage = data.messages;
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
  function reviewMessages() {
    killTask();
    bgtask = setInterval(function () {
      if(channelChat==0) join1on1();
      else joinSupport();
      //console.log("searching msgs");
    },1500);
  }
  function killTask() {
    clearInterval(bgtask);
    bgtask = null;
  }
  function getChannel() {
    return channelChat;
  }
  function reconnect() {
    init(channelChat,assistantId);
  }
  return {
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
