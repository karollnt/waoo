var misendbird = (function () {
    var appId = 'A46AFE6E-E876-482B-BBAF-F736F7D02AFD';
    var apiToken = '7ba731169f7de777d71e1b613426ebe63c1efe5f';
    var userId = window.localStorage.getItem("nickname");
    var assistantId = '';
    var supportUrl = '711cc.support_waoo';
    var init = function () {
        sendbird.init({
            "app_id": appId,
            "guest_id": userId,
            "user_name": userId,
            "image_url": '',
            "access_token": '',
            "successFunc": function(data) {
                joinSupport();
            },
            "errorFunc": function(status, error) {
              console.log(status, error);
            }
        });
    };
    var joinSupport = function () {
        sendbird.joinChannel(
            supportUrl,{
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
            }
        );
    };
    var sendMsg = function () {
        var msg = $('#submit_message').val();
        var entr = 'xx';
        sendbird.message(msg,entr);
        console.log(entr);
        $('#submit_message').val('');
        appendToChat(msg);
        scrollContainer('.touchscroll');
    };
    var scrollContainer = function (div) {
        $(div).stop().animate({
            scrollTop: $(div).height()
        }, 800);
    };
    var getMessages = function () {
        //$('.chat_box').html('');
        sendbird.getMessageLoadMore({
            "limit": 20,
            "successFunc" : function(data) {
                console.log(data);
                moreMessage = data["messages"];
                $.each(moreMessage.reverse(), function(index, msg) {
                    console.log(msg);
                    appendToChat(msg,0);
                });
            },
            "errorFunc": function(status, error) {
                console.log(status, error);
            }
        });
    };
    var appendToChat = function (msg,loc) {
        var d = new Date();
        var h = d.getHours();
        var n = d.getMinutes();
        var rnorm = (loc==1?' chat_message_right':'');
        var html =
        "<div class='chat_message_wrapper"+rnorm+"'>"
            +"<div class='chat_user_avatar'>"
                +"<a href='#'><img alt='avatar' src='' class='md-user-image'></a>"
            +"</div>"
            +"<ul class='chat_message'>"
                +"<li>"
                    + msg + "<span class='chat_message_time'>"+((h<10?'0':'')+h)+":"+((n<10?'0':'')+n)+"</span>"
                +"</li>"
            +"</ul>"
        +"</div>";
        $('.chat_box').append(html);
    };
    return{
        init: init,
        sendMsg: sendMsg
    };
})();
