# React Native Local Dev Speed Boost

This document explains how the local development speed boost was implemented to significantly reduce Android compile times without affecting release builds.

## The Problem
By default, React Native configures the Android build to compile C++ native libraries (like Reanimated or Vision Camera) for **all four major architectures** (`armeabi-v7a`, `arm64-v8a`, `x86`, `x86_64`). 

While this is necessary for a release `.apk` or `.aab` to ensure it runs on any device, doing this during local development means you wait for 4 separate C++ compilation steps when you only ever test on one device at a time (e.g., an x86_64 emulator).

## How We Fixed It

We isolated the optimizations so they only apply when running locally, preserving the safety of production release builds.

### 1. Interactive Run Script (`scripts/run-android.js`)
We created a custom Node.js script that prompts the developer for their current testing environment before booting up the project:
1. **x86_64**: Standard for Windows/Intel Android Emulators.
2. **arm64-v8a**: Standard for physical Android phones and M-series Mac Emulators.
3. **Auto-detect**: Uses React Native's `--active-arch-only` flag to try and detect the connected ADB device.

Based on the selection, the script spawns the React Native CLI and injects a Gradle parameter override: `--extra-params "-PreactNativeArchitectures=ARCH"`. This forces Gradle to only compile for that specific architecture, cutting compilation time by ~75%.

### 2. package.json Integration
We modified the default `"android"` script in `package.json` to route through our new interactive script:
```json
"scripts": {
  "android": "node scripts/run-android.js",
  "android:raw": "react-native run-android"
}
```
If you ever want to bypass the prompt and run the standard build, you can use `npm run android:raw`.

### 3. Global Gradle Caching & Memory (gradle.properties)
In addition to the architecture filtering, we applied safe, global optimizations in `android/gradle.properties` that benefit both local and release builds:
- Increased Gradle JVM Daemon memory from 2GB to 4GB (`org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m`) to prevent out-of-memory slowdowns.
- Enabled Gradle Build Cache (`org.gradle.caching=true`) to speed up incremental builds.
- Enabled Configure on Demand (`org.gradle.configureondemand=true`) for faster task resolution.

## Usage
Simply run:
```bash
npm run android
```
And select the architecture you are currently testing on from the terminal prompt.
