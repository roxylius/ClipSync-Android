/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import MyHeadlessTask from './headless';



AppRegistry.registerHeadlessTask('Clipsync', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
