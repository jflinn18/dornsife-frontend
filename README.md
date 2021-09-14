### To configure the project:

1. Install Node -->                                 `brew install node`
2. Install Watchman -->                             `brew install watchman`
3. Install the React Native CLI -->                 `sudo npm install -g react-native-cli`
4. Navigate to the folder in the terminal
5. Install the Node dependencies to the folder -->  `npm install`
6. Link the dependencies -->                        `rnpm link`

### To run the project:

###### iOS
* Terminal: Run `react-native run-ios`
* XCode:
    1. Connect your phone to the computer
    2. Press the play button
For building in release mode: `react-native bundle --platform ios --dev false --entry-file index.ios.js --bundle-output iOS/main.jsbundle`
Edit the scheme of the project, select `release mode`

###### Android
* Terminal: Run `npm run android` which will install the app on a connected device or a running emulator. It will also set up port forwarding to make debugging easier
NOTE: make sure you have Android Studio installed and the Android 6.0 (Marshmallow) SDK.
More info here: https://facebook.github.io/react-native/docs/getting-started.html
