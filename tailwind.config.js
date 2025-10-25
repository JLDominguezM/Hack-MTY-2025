/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Roboto Regular
        roboto: ["Roboto-Regular", "sans-serif"],
        robotoItalic: ["Roboto-Italic", "sans-serif"],

        // Roboto Thin
        robotoThin: ["Roboto-Thin", "sans-serif"],
        robotoThinItalic: ["Roboto-ThinItalic", "sans-serif"],

        // Roboto ExtraLight
        robotoExtraLight: ["Roboto-ExtraLight", "sans-serif"],
        robotoExtraLightItalic: ["Roboto-ExtraLightItalic", "sans-serif"],

        // Roboto Light
        robotoLight: ["Roboto-Light", "sans-serif"],
        robotoLightItalic: ["Roboto-LightItalic", "sans-serif"],

        // Roboto Medium
        robotoMedium: ["Roboto-Medium", "sans-serif"],
        robotoMediumItalic: ["Roboto-MediumItalic", "sans-serif"],

        // Roboto SemiBold
        robotoSemiBold: ["Roboto-SemiBold", "sans-serif"],
        robotoSemiBoldItalic: ["Roboto-SemiBoldItalic", "sans-serif"],

        // Roboto Bold
        robotoBold: ["Roboto-Bold", "sans-serif"],
        robotoBoldItalic: ["Roboto-BoldItalic", "sans-serif"],

        // Roboto ExtraBold
        robotoExtraBold: ["Roboto-ExtraBold", "sans-serif"],
        robotoExtraBoldItalic: ["Roboto-ExtraBoldItalic", "sans-serif"],

        // Roboto Black
        robotoBlack: ["Roboto-Black", "sans-serif"],
        robotoBlackItalic: ["Roboto-BlackItalic", "sans-serif"],

        // Roboto Condensed Regular
        robotoCondensed: ["Roboto-Condensed-Regular", "sans-serif"],
        robotoCondensedItalic: ["Roboto-Condensed-Italic", "sans-serif"],

        // Roboto Condensed Thin
        robotoCondensedThin: ["Roboto-Condensed-Thin", "sans-serif"],
        robotoCondensedThinItalic: [
          "Roboto-Condensed-ThinItalic",
          "sans-serif",
        ],

        // Roboto Condensed ExtraLight
        robotoCondensedExtraLight: [
          "Roboto-Condensed-ExtraLight",
          "sans-serif",
        ],
        robotoCondensedExtraLightItalic: [
          "Roboto-Condensed-ExtraLightItalic",
          "sans-serif",
        ],

        // Roboto Condensed Light
        robotoCondensedLight: ["Roboto-Condensed-Light", "sans-serif"],
        robotoCondensedLightItalic: [
          "Roboto-Condensed-LightItalic",
          "sans-serif",
        ],

        // Roboto Condensed Medium
        robotoCondensedMedium: ["Roboto-Condensed-Medium", "sans-serif"],
        robotoCondensedMediumItalic: [
          "Roboto-Condensed-MediumItalic",
          "sans-serif",
        ],

        // Roboto Condensed SemiBold
        robotoCondensedSemiBold: ["Roboto-Condensed-SemiBold", "sans-serif"],
        robotoCondensedSemiBoldItalic: [
          "Roboto-Condensed-SemiBoldItalic",
          "sans-serif",
        ],

        // Roboto Condensed Bold
        robotoCondensedBold: ["Roboto-Condensed-Bold", "sans-serif"],
        robotoCondensedBoldItalic: [
          "Roboto-Condensed-BoldItalic",
          "sans-serif",
        ],

        // Roboto Condensed ExtraBold
        robotoCondensedExtraBold: ["Roboto-Condensed-ExtraBold", "sans-serif"],
        robotoCondensedExtraBoldItalic: [
          "Roboto-Condensed-ExtraBoldItalic",
          "sans-serif",
        ],

        // Roboto Condensed Black
        robotoCondensedBlack: ["Roboto-Condensed-Black", "sans-serif"],
        robotoCondensedBlackItalic: [
          "Roboto-Condensed-BlackItalic",
          "sans-serif",
        ],

        // Roboto SemiCondensed Regular
        robotoSemiCondensed: ["Roboto-SemiCondensed-Regular", "sans-serif"],
        robotoSemiCondensedItalic: [
          "Roboto-SemiCondensed-Italic",
          "sans-serif",
        ],

        // Roboto SemiCondensed Thin
        robotoSemiCondensedThin: ["Roboto-SemiCondensed-Thin", "sans-serif"],
        robotoSemiCondensedThinItalic: [
          "Roboto-SemiCondensed-ThinItalic",
          "sans-serif",
        ],

        // Roboto SemiCondensed ExtraLight
        robotoSemiCondensedExtraLight: [
          "Roboto-SemiCondensed-ExtraLight",
          "sans-serif",
        ],
        robotoSemiCondensedExtraLightItalic: [
          "Roboto-SemiCondensed-ExtraLightItalic",
          "sans-serif",
        ],

        // Roboto SemiCondensed Light
        robotoSemiCondensedLight: ["Roboto-SemiCondensed-Light", "sans-serif"],
        robotoSemiCondensedLightItalic: [
          "Roboto-SemiCondensed-LightItalic",
          "sans-serif",
        ],

        // Roboto SemiCondensed Medium
        robotoSemiCondensedMedium: [
          "Roboto-SemiCondensed-Medium",
          "sans-serif",
        ],
        robotoSemiCondensedMediumItalic: [
          "Roboto-SemiCondensed-MediumItalic",
          "sans-serif",
        ],

        // Roboto SemiCondensed SemiBold
        robotoSemiCondensedSemiBold: [
          "Roboto-SemiCondensed-SemiBold",
          "sans-serif",
        ],
        robotoSemiCondensedSemiBoldItalic: [
          "Roboto-SemiCondensed-SemiBoldItalic",
          "sans-serif",
        ],

        // Roboto SemiCondensed Bold
        robotoSemiCondensedBold: ["Roboto-SemiCondensed-Bold", "sans-serif"],
        robotoSemiCondensedBoldItalic: [
          "Roboto-SemiCondensed-BoldItalic",
          "sans-serif",
        ],

        // Roboto SemiCondensed ExtraBold
        robotoSemiCondensedExtraBold: [
          "Roboto-SemiCondensed-ExtraBold",
          "sans-serif",
        ],
        robotoSemiCondensedExtraBoldItalic: [
          "Roboto-SemiCondensed-ExtraBoldItalic",
          "sans-serif",
        ],

        // Roboto SemiCondensed Black
        robotoSemiCondensedBlack: ["Roboto-SemiCondensed-Black", "sans-serif"],
        robotoSemiCondensedBlackItalic: [
          "Roboto-SemiCondensed-BlackItalic",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          100: "#F5F8FF",
          200: "#EBF4FF",
          300: "#C3D9FF",
          400: "#9BBFFF",
          500: "#0286FF",
          600: "#6A85E6",
          700: "#475A99",
          800: "#364573",
          900: "#242B4D",
        },
        secondary: {
          100: "#F8F8F8",
          200: "#F1F1F1",
          300: "#D9D9D9",
          400: "#C2C2C2",
          500: "#AAAAAA",
          600: "#999999",
          700: "#666666",
          800: "#4D4D4D",
          900: "#333333",
        },
        success: {
          100: "#F0FFF4",
          200: "#C6F6D5",
          300: "#9AE6B4",
          400: "#68D391",
          500: "#38A169",
          600: "#2F855A",
          700: "#276749",
          800: "#22543D",
          900: "#1C4532",
        },
        danger: {
          100: "#FFF5F5",
          200: "#FED7D7",
          300: "#FEB2B2",
          400: "#FC8181",
          500: "#F56565",
          600: "#E53E3E",
          700: "#C53030",
          800: "#9B2C2C",
          900: "#742A2A",
        },
        warning: {
          100: "#FFFBEB",
          200: "#FEF3C7",
          300: "#FDE68A",
          400: "#FACC15",
          500: "#EAB308",
          600: "#CA8A04",
          700: "#A16207",
          800: "#854D0E",
          900: "#713F12",
        },
        general: {
          100: "#CED1DD",
          200: "#858585",
          300: "#EEEEEE",
          400: "#0CC25F",
          500: "#F6F8FA",
          600: "#E6F3FF",
          700: "#EBEBEB",
          800: "#ADADAD",
        },
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")],
};
