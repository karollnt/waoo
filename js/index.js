document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady () {
  window.localStorage.setItem("plataforma", device.platform);
  initPushwoosh();
}

function onPushwooshInitialized(pushNotification) {

  //if you need push token at a later time you can always get it from Pushwoosh plugin
  pushNotification.getPushToken(function(token) {
    console.info('push token: ' + token);
  });

  //and HWID if you want to communicate with Pushwoosh API
  pushNotification.getPushwooshHWID(function(token) {
    console.info('Pushwoosh HWID: ' + token);
  });

  //settings tags
  pushNotification.setTags({
    tagName: "tagValue",
      intTagName: 10
    },
    function(status) {
      console.info('setTags success: ' + JSON.stringify(status));
    },
    function(status) {
      console.warn('setTags failed');
    }
  );

  pushNotification.getTags(
    function(status) {
      console.info('getTags success: ' + JSON.stringify(status));
    },
    function(status) {
      console.warn('getTags failed');
    }
  );

  //start geo tracking.
  //pushNotification.startLocationTracking();
}

function initPushwoosh() {
  var pushwoosh = cordova.require("pushwoosh-cordova-plugin.PushNotification");

  // Should be called before pushwoosh.onDeviceReady
  document.addEventListener('push-notification', function(event) {
    var notification = event.notification;
    // handle push open here
    // alert(notification.message);
  });

  // Initialize Pushwoosh. This will trigger all pending push notifications on start.
  pushwoosh.onDeviceReady({
    appid: "0E566-1EDAC",
    projectid: "1021525473859",
    serviceName: ""
  });

  if (! (window.localStorage.getItem('isPushwoosh')) ) {
    window.localStorage.setItem('isPushwoosh', 'true');
    registerDevice(pushwoosh);
  }
  else {
    if (! (window.localStorage.getItem('token')) ) {
      registerDevice(pushwoosh);
    }
  }
}

function registerDevice(pushObj) {
  pushObj.registerDevice(
    function(status) {
      var pushToken = status.pushToken;
      // handle successful registration here
      window.localStorage.setItem('token', pushToken);
      onPushwooshInitialized(pushObj);
    },
    function(status) {
      // handle registration error here
      alert('msg: '+status);
    }
  );
}
