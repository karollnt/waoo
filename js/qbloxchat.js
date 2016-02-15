function verificarQuickblox(u){
	var params = { 'login': u, 'password': "12345"};
	QB.login(params, function(err, user){
		if(user){
			// success
		}
		else{
			registroQuickblox(u);
		}
	});
}

function loginQuickblox(u){
	var user = { 'login': u, 'password': "12345"};
	QB.createSession({login: user.login, password: user.pass}, function(err, res) {
		if(res){
			QB.chat.connect({userId: user.id, password: '12345'}, function(err, roster) {
				if(err) console.log(err);
			});
		}
		else{
			console.log(err);
		}
	});
	/*QB.login(params, function(err, user){
		if(user){
			QB.chat.connect({userId: user.id, password: '12345'}, function(err, roster) {
				console.log(err);
			});
		}
		else{
			// error
		}
	});*/
}

function logoutQuickblox(){
	QB.chat.disconnect();
	/*QB.logout(function(err, result){
		if(result){
			// success
		}
		else{
			// error
		}
	});*/
}

function registroQuickblox(u){
	var params = { 'login': u, 'password': "12345"};
	QB.users.create(params, function(err, user){
		if(user){
			// success
		}
		else{
			// error
		}
	});
}

function crearChatPrivado(uid,uid2){
	var params = {
		type: 3,
		occupants_ids: [uid,uid2],
		name: "Oferta aceptada"
	};
	QB.chat.dialog.create(params, function(err, createdDialog) {
		if(err){
			console.log(err);
		}
		else{
			notifyOccupants(createdDialog.occupants_ids, createdDialog._id);
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