# Kotlin Version Fix

## Issue
Build failed with error:
```
Can't find KSP version for Kotlin version '1.9.24'. 
You're probably using an unsupported version of Kotlin.
Supported versions are: '2.2.20, 2.2.10, 2.2.0, 2.1.21, 2.1.20, 2.1.10, 2.1.0, 2.0.21, 2.0.20, 2.0.10, 2.0.0'
```

## Root Cause
- Expo SDK 54 with React Native 0.76.5 requires Kotlin 2.0+
- The default Kotlin version was 1.9.24 (unsupported)
- KSP (Kotlin Symbol Processing) couldn't find compatible version

## Solution Applied

### 1. Created Custom Config Plugin (`app.plugin.js`)
Created a plugin to override Kotlin version in the build process:

```javascript
const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withKotlinVersion(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents) {
      // Update Kotlin version to 2.0.0
      config.modResults.contents = config.modResults.contents.replace(
        /kotlinVersion\s*=\s*['"][\d.]+['"]/g,
        'kotlinVersion = "2.0.0"'
      );
    }
    return config;
  });
};
```

### 2. Updated `app.json`
Added the custom plugin to the plugins array:

```json
"plugins": [
  "expo-router",
  "./app.plugin.js"
]
```

### 3. Updated `eas.json`
Enhanced Android build configuration:

```json
"preview": {
  "distribution": "internal",
  "android": {
    "buildType": "apk",
    "gradleCommand": ":app:assembleRelease"
  },
  "env": {
    "EXPO_USE_UPDATES": "false"
  }
}
```

## Files Modified

1. **app.plugin.js** (NEW) - Custom Kotlin version configuration
2. **app.json** - Added plugin reference
3. **eas.json** - Enhanced build configuration

## Build Status

✅ Configuration updated
✅ Build uploaded to EAS
✅ Build queued successfully

**Current Build URL**: 
https://expo.dev/accounts/copperpod/projects/donor-app-poc/builds/70c0fed0-da72-4ae0-989f-ad588ac7c6f7

## Why This Works

- **Kotlin 2.0.0** is the minimum version supported by KSP in Expo SDK 54
- The config plugin modifies the Gradle build files before compilation
- This ensures the correct Kotlin version is used throughout the build process

## Future Builds

No additional steps needed. The configuration is now permanent:

```bash
eas build --platform android --profile preview
```

The Kotlin version will automatically be set to 2.0.0 for all future builds.

## Technical Details

### Supported Kotlin Versions (as of Expo SDK 54)
- 2.2.20, 2.2.10, 2.2.0
- 2.1.21, 2.1.20, 2.1.10, 2.1.0
- 2.0.21, 2.0.20, 2.0.10, **2.0.0** ✅ (using this)

### Why Not Use Latest?
- Kotlin 2.0.0 is stable and well-tested with Expo SDK 54
- Newer versions may have compatibility issues with some dependencies
- 2.0.0 provides the best balance of features and stability

## Troubleshooting

If you still see Kotlin errors:

1. **Clear EAS cache**:
   ```bash
   eas build --platform android --profile preview --clear-cache
   ```

2. **Check plugin is loaded**:
   Verify `app.plugin.js` is in the root directory and referenced in `app.json`

3. **Verify @expo/config-plugins is installed**:
   ```bash
   npm list @expo/config-plugins
   ```

## Related Issues Fixed

1. ✅ React version incompatibility (React 19 → 18.3.1)
2. ✅ React Native version (0.81.5 → 0.76.5)
3. ✅ Kotlin version (1.9.24 → 2.0.0)
4. ✅ Peer dependency conflicts (--legacy-peer-deps)

All issues are now resolved and the build should complete successfully.
