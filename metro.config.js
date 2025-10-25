const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add platform-specific resolution
config.resolver.platforms = ["native", "android", "ios", "web"];

module.exports = withNativeWind(config, { input: "./global.css" });