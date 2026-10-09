# Frame Extractor

A privacy-first React Native app for extracting still images from a selected video. Processing happens on-device; the app does not upload videos or frames to a server.

## Features

- Modern, responsive three-step workflow: select a video, choose a time range, configure output.
- English and Persian UI, including Persian right-aligned content where appropriate.
- Native system video picker, video preview/playback, and start/end controls.
- FFmpeg-based extraction at one image per second, two images per second, or every decoded frame.
- PNG, JPEG, and WebP output; quality presets for lossy formats.
- Live processing progress, cancellation, clear errors, and output image count.
- Timestamped, non-overwriting output folders in the app's document directory.
- Share-sheet handoff for exported images.
- Custom Android launcher and iOS app icons.

## Stack

- React Native 0.79.2 / React 19
- JavaScript and React hooks
- `munim-ffmpeg` + `react-native-nitro-modules` for native FFmpeg/FFprobe processing
- `react-native-image-picker`, `react-native-video`, and `@react-native-community/slider`
- `react-native-fs` / `react-native-blob-util` for local file handling
- `react-native-share` and `react-native-zip-archive` for exporting the complete result as a ZIP archive

`munim-ffmpeg` requires React Native's New Architecture and Android API 24+ / iOS 15.1+. This project has `newArchEnabled=true` configured for Android. Native dependencies must be installed and the native app rebuilt after changes; a Metro reload alone is not sufficient.

## Requirements

- Node.js 18 or newer
- JDK 17
- Android Studio with Android SDK / NDK versions compatible with the checked-in Gradle configuration
- For iOS builds: macOS, Xcode, Ruby/Bundler and CocoaPods
- A physical Android/iOS device is strongly recommended for media validation

## Install

The dependency manifest was updated as part of this repair. Generate a fresh npm lockfile in your environment and install the native packages (this also downloads the native FFmpeg binaries):

```sh
npm install
```

For iOS:

```sh
cd ios
pod install
cd ..
```

If the package postinstall script cannot download the matching FFmpeg binaries, follow the `munim-ffmpeg` installation instructions and verify the binary checksum before building.

## Run in development

Terminal 1:

```sh
npm start
```

Terminal 2:

```sh
npm run android
# or on macOS:
npm run ios
```

## Build Android release

```sh
npm install
npm run android:release
```

The unsigned/debug-signed development output is not a Play Store release. Before publishing, create a private release keystore, configure signing through environment variables or an untracked Gradle properties file, and verify the final AAB with Play Console internal testing. Never commit a production keystore or passwords.

## Output and privacy

Images are written to:

- Android: the app's private document directory under `FrameExtractor/<timestamped-job>/`
- iOS: the app's Documents directory under `FrameExtractor/<timestamped-job>/`

The in-app export action packages the complete output folder as a ZIP archive next to the job folder and passes that single archive to the operating system's share sheet. Files remain in app storage unless the user shares or exports them. The iOS deployment target is 15.5 to meet the ZIP library's minimum supported version. The current app does not implement a user-selected SAF folder or a public gallery destination; this is intentional to avoid pretending a `content://` folder URI is a normal filesystem path.

The app copies selected `content://` videos into app cache when the platform allows it. If a provider blocks copying, choose a locally stored video or copy it to local storage first. Temporary source copies are placed in cache and may be removed by the operating system.

## Extraction behavior

- **1 image per second:** uses FFmpeg's `fps=1` filter.
- **2 images per second:** uses `fps=2`.
- **Every frame:** omits the frame-rate filter and writes every decoded video frame in the selected interval. This can create very large output folders for long/high-frame-rate videos.
- JPEG and WebP quality presets trade image size against visual quality. PNG is lossless and does not use the lossy quality selector.

For performance and safety, test long videos before choosing “Every frame”. The output directory is unique per job; existing output is not overwritten by another job.

## Checks and testing

```sh
npm run lint
npm run typecheck
npm test
```

Then perform device-level tests for:

1. Picking and cancelling video selection.
2. Short, long, rotated, variable-frame-rate, HEVC, and large video files.
3. Start/end range boundaries and clips near the end of a file.
4. PNG/JPEG/WebP output and all three capture frequencies.
5. Cancellation during extraction, app backgrounding, and low storage.
6. Sharing outputs on Android and iOS.
7. English/Persian switching, small screens, and screen readers.
8. Fresh Android release build and iOS archive.

## Release checklist

- [ ] Install dependencies successfully and commit the generated `package-lock.json`.
- [ ] Run lint, typecheck, unit tests, Android release build and iOS archive.
- [ ] Test on physical devices and inspect FFmpeg output / failure paths.
- [ ] Confirm all selected formats are supported by the bundled FFmpeg build.
- [ ] Verify cancellation and cleanup of temporary source copies.
- [ ] Add FFmpeg license notices and comply with the bundled build's LGPL terms.
- [ ] Configure production signing, app version/build number, store metadata and privacy disclosures.
- [ ] Validate icon rendering on launchers and app stores.

## Known release gate

This source repair has not been built on a connected Android/iOS SDK in this environment. Native dependency installation downloads platform binaries and requires Gradle/Xcode, so **do not treat this ZIP as a certified store-ready binary** until the build and device-level checklist above passes. A clean source package is provided; release readiness must be verified in the target build environment.
