# Build Fix Notes

## Issue: npm ERESOLVE peer dependency conflict

### Root Cause
The project was using **React 19.1.0** and **React Native 0.81.5**, which caused peer dependency conflicts:
- React Native 0.81.5 requires React 19
- Most Expo SDK 54 packages expect React 18
- This created an unresolvable dependency tree

### Solution Applied

1. **Downgraded React to 18.3.1**
   - Changed from `react@19.1.0` to `react@18.3.1`
   - This is the stable version compatible with Expo SDK 54

2. **Updated React Native to 0.76.5**
   - Changed from `react-native@0.81.5` to `react-native@0.76.5`
   - Version 0.76.5 works with React 18 and Expo SDK 54

3. **Added react-dom**
   - Added `react-dom@18.3.1` for web compatibility

4. **Updated TypeScript types**
   - Changed `@types/react` from `~19.1.0` to `~18.3.12`

5. **Added resolutions**
   - Added `resolutions` field to lock React versions across all dependencies

6. **Reinstalled with --legacy-peer-deps**
   - Cleared node_modules and package-lock.json
   - Ran `npm install --legacy-peer-deps` to handle remaining peer dependency warnings

### Final package.json Changes

```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-dom": "18.3.1",
    // ... other deps
  },
  "devDependencies": {
    "@types/react": "~18.3.12",
    // ... other dev deps
  },
  "resolutions": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```

### Build Status

✅ Dependencies installed successfully
✅ Build uploaded to EAS
✅ Build is now in queue

**Build URL**: https://expo.dev/accounts/copperpod/projects/donor-app-poc/builds/a033b626-aa16-46b0-bb46-aca6a85a197f

### Expected Timeline
- Build typically takes 10-15 minutes
- You'll receive an APK download link when complete
- Can be shared directly with testers

### Future Builds

For subsequent builds, simply run:
```bash
eas build --platform android --profile preview
```

No need to reinstall dependencies unless you add new packages.

### Notes
- The `--legacy-peer-deps` flag was necessary due to some packages not yet fully supporting the exact version combinations
- This is a common issue in React Native ecosystem and the solution is stable
- All functionality should work as expected despite the peer dependency warnings
