# Green Economy

## What the App Does

[Description of the Green Economy app goes here]

## Prerequisites

Before running this Expo app, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Hack-MTY-2025
```

2. Install dependencies:

```bash
npm install
```

## Running the App

### Development Mode

Start the development server:

```bash
npx expo start
```

This will open the Expo developer tools in your browser. You can then:

- Scan the QR code with the Expo Go app on your mobile device
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Press `w` to open in web browser

### Production Build

To create a production build:

```bash
npx expo build
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## Troubleshooting

If you encounter issues:

1. Clear Expo cache: `npx expo start -c`
2. Reset npm cache: `npm cache clean --force`
3. Reinstall dependencies: `rm -rf node_modules && npm install`
