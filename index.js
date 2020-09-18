/**
 * @format
 */
import "node-libs-react-native/globals";
import "react-native-get-random-values";

import { AppRegistry } from "react-native";
import App from "./src/app/app";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
