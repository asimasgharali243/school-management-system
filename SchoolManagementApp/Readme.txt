# Create the directory and mock file
New-Item -ItemType Directory -Force -Path "node_modules\@react-native\assets-registry"

# Create the mock registry file
@'
// Mock assets registry for React Native 0.71.11
export default {
  registerAsset: function(asset) {
    return 1;
  },
  getAssetByID: function(assetID) {
    return {
      __packager_asset: true,
      fileSystemLocation: "",
      httpServerLocation: "",
      width: 0,
      height: 0,
      scales: [1],
      hash: "",
      name: "",
      type: ""
    };
  }
};
'@ | Out-File -FilePath "node_modules\@react-native\assets-registry\registry.js" -Encoding UTF8


// {
//   "expo": {
//     "name": "SchoolManagementApp",
//     "slug": "SchoolManagementApp",
//     "version": "1.0.0",
//     "orientation": "portrait",
//     "icon": "./assets/icon.png",
//     "userInterfaceStyle": "light",
//     "newArchEnabled": true,
//     "splash": {
//       "image": "./assets/splash-icon.png",
//       "resizeMode": "contain",
//       "backgroundColor": "#ffffff"
//     },
//     "ios": {
//       "supportsTablet": true
//     },
//     "android": {
//       "adaptiveIcon": {
//         "foregroundImage": "./assets/adaptive-icon.png",
//         "backgroundColor": "#ffffff"
//       },
//       "edgeToEdgeEnabled": true,
//       "package": "com.asim_ali_786.SchoolManagementApp"
//     },
//     "web": {
//       "favicon": "./assets/favicon.png"
//     }
//   }
// }