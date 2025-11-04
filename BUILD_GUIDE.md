# Android APK Build Guide

## Prerequisites

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```
   - If you don't have an Expo account, create one at https://expo.dev

## Building the APK

### Option 1: Preview Build (Recommended for Testing)

This creates an APK that can be installed directly on Android devices:

```bash
eas build --platform android --profile preview
```

**What happens:**
- EAS will build your app in the cloud
- You'll get a download link for the APK
- Build typically takes 10-15 minutes
- The APK can be shared with testers via the download link

### Option 2: Production Build

For a production-ready build:

```bash
eas build --platform android --profile production
```

### Option 3: Local Build (No Expo Account Required)

If you prefer to build locally without using EAS cloud:

```bash
eas build --platform android --profile preview --local
```

**Note:** Local builds require:
- Android Studio installed
- Android SDK configured
- More setup time but no Expo account needed

## After Build Completes

1. **Download the APK**:
   - EAS will provide a download link in the terminal
   - Or visit https://expo.dev/accounts/[your-account]/projects/donor-app-poc/builds

2. **Share with Testers**:
   - Send the APK download link directly
   - Or download and share the APK file via email/drive
   - Testers need to enable "Install from Unknown Sources" on their Android devices

3. **Install on Device**:
   - Download the APK on Android device
   - Tap to install
   - Accept permissions when prompted

## Build Configuration

The build is configured in `eas.json`:
- **preview**: Creates APK for internal testing
- **production**: Creates production-ready APK
- Both profiles generate APK files (not AAB)

## App Details

- **Package Name**: `com.copperpoddigital.donorapp`
- **Version**: 1.0.0
- **Version Code**: 1

## Troubleshooting

### Build Fails
- Check that all dependencies are properly installed
- Ensure app.json is valid JSON
- Review build logs on expo.dev

### APK Won't Install
- Enable "Install from Unknown Sources" in Android settings
- Check that device meets minimum Android version requirements
- Try uninstalling any previous version first

### Need to Update Version
Edit `app.json`:
```json
"version": "1.0.1",
"android": {
  "versionCode": 2
}
```

## Quick Commands Reference

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build APK for testing
eas build --platform android --profile preview

# Check build status
eas build:list

# View build details
eas build:view [build-id]
```

## Next Steps

1. Run the build command
2. Wait for build to complete (10-15 minutes)
3. Download the APK
4. Share with testers
5. Collect feedback
6. Iterate and rebuild as needed
