var QBApp = {
	appId: 28287,
	authKey: 'XydaWcf8OO9xhGT',
	authSecret: 'JZfqTspCvELAmnW'
};

var usrpwds = 'w4o0p15s_';
var assistantID = 6729114;

$(document).ready(function(){
	$("html").niceScroll({cursorcolor:"#02B923", cursorwidth:"7", zindex:"99999"});
	$(".nice-scroll").niceScroll({cursorcolor:"#02B923", cursorwidth:"7", zindex:"99999"});
});

function verificaIcono(){
	var btsrc = "";
	if($.trim($("#message_text").val()) != "") btsrc = "images/chat.png";
	else btsrc = "images/attach.png";
	$("#send_btn").prop("src",btsrc);
}

function verificaClic(){
	if($.trim($("#message_text").val()) != ""){
		clickSendMessage();
	}
	else{
		clickSendAttachments($('#load-img')[0]);
	}
}

function conexionChat(){
	var u = window.localStorage.getItem("nickname");
	if(u!=null){
		var config = {
			chatProtocol: {
				active: 2
			},
			debug: {
				mode: 1,
				file: null
			}
		};
		QB.init(QBApp.appId, QBApp.authKey, QBApp.authSecret, config);
		/*var sId = readCookie('sessionId');
		if(sId) tokenSession(sId,QBApp.appId);
		else */loginQuickblox(u);
	}
}

function tokenSession(sestoken,appid){
	QB.init(sestoken,appid);
	retrieveChatDialogs();
	setupAllListeners();
	setupMsgScrollHandler();
}

function writeCookie(name,value,days) {
	var date, expires;
	if(days){
		date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires=" + date.toGMTString();
	}
	else{
		expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var i, c, ca, nameEQ = name + "=";
	ca = document.cookie.split(';');
	for(i=0;i < ca.length;i++){
		c = ca[i];
		while(c.charAt(0)==' '){
			c = c.substring(1,c.length);
		}
		if(c.indexOf(nameEQ) == 0) {
			return c.substring(nameEQ.length,c.length);
		}
	}
	return '';
}

function loginQuickblox(u){
	var params = { 'login': u, 'password': usrpwds};
	QB.createSession(function(err,result){
		console.log('Session create callback', err, result);
		QB.login(params, function(err, user){
			if(user){
				var usiir = {
					id:user.id,
					name: user.full_name,
					login: user.login,
					pass: usrpwds
				};
				currentUser = usiir;
				writeCookie('sessionId', user.token, 1);
				connectToChat(usiir.id);
			}
			else{
				registroQuickblox(u);
			}
		});
	});

}

function logoutQuickblox(){
	QB.chat.disconnect();
	QB.logout(function(err, result){
		if(result){
			// success
		}
		else{
			console.log(JSON.stringify(err));
		}
	});
}

function registroQuickblox(u){
	var params = { 'login': u, 'password': usrpwds};
	QB.users.create(params, function(err, user){
		if(user){
			actualizaIdQuick(user.id,u);
			loginQuickblox(u);
		}
		else{
			console.log(JSON.stringify(err));
		}
	});
}

function connectToChat(user){
	crearChatPrivado(user,assistantID);
	/*retrieveChatDialogs();
	setupAllListeners();
	setupMsgScrollHandler();*/
}

function setupAllListeners(){
	QB.chat.onDisconnectedListener    = onDisconnectedListener;
	QB.chat.onReconnectListener       = onReconnectListener;
	QB.chat.onMessageListener         = onMessage;
	QB.chat.onSystemMessageListener   = onSystemMessageListener;
	QB.chat.onDeliveredStatusListener = onDeliveredStatusListener;
	QB.chat.onReadStatusListener      = onReadStatusListener;
	setupIsTypingHandler();
}

function crearChatPrivado(uid,uid2){
	var params = {
		type: 3,
		occupants_ids: [uid2],
		name: "Oferta aceptada"
	};
	QB.chat.dialog.create(params, function(err, createdDialog) {
		if(err){
			console.log(err);
		}
		else{
			//notifyOccupants(createdDialog.occupants_ids, createdDialog._id);
			retrieveUsersForDialogUpdate(function(){
				retrieveChatMessages(createdDialog,null);
			});
		}
	});
}

function notifyOccupants(dialogOccupants, dialogId) {
	dialogOccupants.forEach(function(itemOccupanId, i, arr) {
		if (itemOccupanId != currentUser.id) {
			var msg = {
				type: 'chat',
				extension: {
					notification_type: 1,
					_id: newDialogId,
				},
			};
			QB.chat.send(itemOccupanId, msg);
		}
	});
}

function enviarMensaje(dest,mensaje){
	var msg = {
		type: 'chat',
		body: mensaje,
		extension: {
			save_to_history: 1,
		}
	};
	var opponentId = dest;
	QB.chat.send(opponentId, msg);
}
