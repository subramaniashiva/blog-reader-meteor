// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.nisaptham.siva',
  name: 'Nisaptham',
  version: '1.1.0',
  description: 'Read the blog contents of nisaptham.com',
  author: 'Siva',
  email: 'vengaishiva@gmail.com',
  website: 'http://github.com/subramaniashiva'
});
App.accessRule('*');

// Set up resources such as icons and launch screens.
App.icons({
  //'android_ldpi': 'resources/icons/ic_launcher_36x36.png',
  'android_mdpi': 'resources/icons/ic_launcher_48x48.png',
  'android_hdpi': 'resources/icons/ic_launcher_72x72.png',
  'android_xhdpi': 'resources/icons/ic_launcher_96x96.png'
  //'android_xxhdpi': 'resources/icons/ic_launcher_144x144.png',
  //'android_xxxhdpi': 'resources/icons/ic_launcher_192x192.png'
});

App.launchScreens({
  'android_ldpi_portrait': 'resources/splash/splash_portraite_200x320.png',
  //'android_ldpi_landscape': 'resources/splash/splash-320x200.png',
  'android_mdpi_portrait': 'resources/splash/splash_portraite_320x480.png',
  'android_mdpi_landscape': 'resources/splash/splash_landscape_480x320.png',
  'android_hdpi_portrait': 'resources/splash/splash_portraite_480x800.png',
  'android_hdpi_landscape': 'resources/splash/splash_landscape_800x480.png',
  'android_xhdpi_portrait': 'resources/splash/splash_portraite_720x1280.png',
  'android_xhdpi_landscape': 'resources/splash/splash_landscape_1280x720.png',
  //'android_xxhdpi_portrait': 'resources/splash/splash_portraite_960x1600.png',
  //'android_xxhdpi_portrait': 'resources/splash/splash_portraite_1600x960.png',
  //'android_xxxhdpi_portrait': 'resources/splash/splash_portraite_1280x1920.png',
  //'android_xxxhdpi_landscape': 'resources/splash/splash_portraite_1920x1280.png'
});

// Set PhoneGap/Cordova preferences
//App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);

// Pass preferences for a particular PhoneGap/Cordova plugin
//App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//  APP_ID: '1234567890',
//  API_KEY: 'supersecretapikey'
//});
