const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Add platform-specific resolution
config.resolver.platforms = ["native", "android", "ios", "web"];

// Mock problematic native modules for Expo Go
config.resolver.alias = {
  "@elevenlabs/react-native": path.resolve(__dirname, "mocks/elevenlabs-mock.js"),
};

module.exports = withNativeWind(config, { input: "./global.css" });