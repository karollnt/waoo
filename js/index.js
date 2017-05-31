document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady () {
  if (!window.localStorage.getItem('plataforma')) {
    window.localStorage.setItem('plataforma', device.platform);
  }

  var iosSettings = {};
  iosSettings["kOSSettingsKeyAutoPrompt"] = false;
  iosSettings["kOSSettingsKeyInAppLaunchURL"] = true;

  window.plugins.OneSignal
    .startInit("2456ad57-ed56-498f-b352-e8ebd9c51cee")
    .handleNotificationReceived(function(jsonData) {
      // alert("Notification received: \n" + JSON.stringify(jsonData));
      console.log('Did I receive a notification: ' + JSON.stringify(jsonData));
    })
    .handleNotificationOpened(function(jsonData) {
      // alert("Notification opened: \n" + JSON.stringify(jsonData));
      var data = jsonData.notification;
      if (data.payload.additionalData) {
        var resp = data.payload.additionalData;
        if (resp.open_chat) {
          cargaPagina('data/chats.html');
          setTimeout(function () {
            misendbird.setChannel(resp.channel_id);
            misendbird.init(0,resp.assistant_nick);
          },200);
        }
      }
      console.log('didOpenRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    })
    .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
    .iOSSettings(iosSettings)
    .endInit()
    .registerForPushNotifications();
}
