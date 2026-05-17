# Android Build Instructions

SignalPack is set up with PWA capabilities.
To build a native Android app:

1. **Capacitor Configuration**
You can use `@capacitor/core` and `@capacitor/android` to wrap the `dist` folder.
\`\`\`bash
npm i @capacitor/core
npm i -D @capacitor/cli
npx cap init SignalPack com.signalpack.app --web-dir dist
npx cap add android
\`\`\`

2. **Build and Sync**
Whenever you change the UI:
\`\`\`bash
npm run build
npx cap sync android
npx cap open android
\`\`\`

3. **Required Permissions**
In `AndroidManifest.xml` add:
- `android.permission.INTERNET`
- `android.permission.RECORD_AUDIO`
- `android.permission.CAMERA`

That's it!
