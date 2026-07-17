# AI Quran Teacher - Deployment Guide

## Overview

This guide covers deploying the AI Quran Teacher app to web, iOS, and Android platforms.

## Prerequisites

- Node.js 18+ and npm/pnpm
- Expo CLI: `npm install -g eas-cli`
- For iOS: Xcode and Apple Developer Account
- For Android: Android Studio and Google Play Developer Account
- For Web: Manus WebDev hosting

## Web Deployment

### 1. Build for Web

```bash
pnpm build
```

This creates a production build in the `dist/` directory.

### 2. Deploy to Manus WebDev

The web version can be deployed using Manus WebDev hosting:

```bash
# Deploy using Manus WebDev
manus-webdev deploy
```

The web app will be available at a public URL for browser access.

## Native Deployment

### iOS Deployment

#### 1. Prepare Signing Credentials

```bash
eas credentials
```

Follow the prompts to configure your Apple Developer credentials.

#### 2. Build for iOS

```bash
eas build --platform ios --auto-submit
```

Or for a preview build:

```bash
eas build --platform ios --profile preview
```

#### 3. Submit to App Store

```bash
eas submit --platform ios
```

### Android Deployment

#### 1. Prepare Signing Credentials

```bash
eas credentials
```

Configure your Google Play credentials.

#### 2. Build for Android

```bash
eas build --platform android --auto-submit
```

Or for a preview build:

```bash
eas build --platform android --profile preview
```

#### 3. Submit to Google Play

```bash
eas submit --platform android
```

## Environment Configuration

Ensure your `.env` file is properly configured:

```
DATABASE_HOST=your-database-host
DATABASE_USER=your-database-user
DATABASE_PASSWORD=your-database-password
DATABASE_NAME=quran_db
```

## Testing

### Local Testing

```bash
# Start development server
pnpm dev

# Test web version
pnpm dev:metro

# Test on iOS simulator
pnpm ios

# Test on Android emulator
pnpm android
```

### Pre-Deployment Checklist

- [ ] All tests pass: `pnpm test`
- [ ] Code linting passes: `pnpm lint`
- [ ] Build succeeds: `pnpm build`
- [ ] Environment variables are set
- [ ] Database is accessible
- [ ] App icons and splash screens are in place
- [ ] Version number is updated in `app.json`

## Troubleshooting

### Build Failures

- Clear cache: `rm -rf node_modules dist .expo`
- Reinstall dependencies: `pnpm install`
- Check Node.js version: `node --version`

### Deployment Issues

- Check EAS logs: `eas build --status`
- Review credentials: `eas credentials`
- Verify app.json configuration

## Support

For issues or questions, refer to:
- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Manus WebDev Documentation](https://docs.manus.im)
