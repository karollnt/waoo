document.addEventListener("deviceready", function(){
	  window.localStorage.setItem("plataforma", device.platform);

    window.plugins.PushbotsPlugin.initialize("575f09fc4a9efab5a28b4568", {"android":{"sender_id":"157120585069"}});
    window.plugins.PushbotsPlugin.on("registered", function(token){
        window.localStorage.setItem("token", token);
    });

    window.plugins.PushbotsPlugin.getRegistrationId(function(token){
        window.localStorage.setItem("token", token);
    });
}, false);

