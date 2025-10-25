/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        GothamBold: ["Gotham-Bold"],
        GothamBook: ["Gotham-Book"],
        GothamMedium: ["Gotham-Medium"],
        GothamLight: ["Gotham-Light"],
      },
      colors: {
        BanorteRed: "#EB0029",
        BanorteGray: "#5B6670",
        White: "#FFFFFF",
        Sucess: "#6CC04A",
        Alert: "#FF671B",
        Warning: "FFA400",
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")],
};