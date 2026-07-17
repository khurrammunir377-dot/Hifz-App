# App Store Submission Guide

## Apple App Store (iOS)

### Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at [developer.apple.com](https://developer.apple.com)
   - Enable two-factor authentication
   - Accept the latest agreements

2. **Certificates and Provisioning Profiles**
   ```bash
   eas credentials
   # Follow prompts to set up iOS credentials
   ```

### App Store Connect Setup

1. **Create App Record**
   - Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Click "My Apps" → "+"
   - Select "New App"
   - Fill in:
     - Platform: iOS
     - Name: AI Quran Teacher
     - Primary Language: English
     - Bundle ID: com.manus.aiquranteacher
     - SKU: aiquranteacher-001

2. **App Information**
   - Category: Education
   - Subcategory: Religion
   - Content Rating: 4+
   - Privacy Policy: [Add your privacy policy URL]

3. **Pricing and Availability**
   - Free app
   - Available in all countries

4. **App Preview and Screenshots**
   - Minimum 2 screenshots per device type
   - Maximum 5 screenshots
   - Include app name and key features

5. **Description**
   ```
   Learn and memorize the Quran with AI-powered features.
   
   Features:
   - Complete Quran with word-by-word translations
   - Intelligent search with Arabic normalization
   - Track your learning progress
   - Bookmark favorite verses
   - Cross-platform access (Web, iOS, Android)
   ```

6. **Keywords**
   - quran, islamic, learning, memorization, tajweed, education

7. **Support URL**
   - https://support.manus.im

8. **Build Submission**
   ```bash
   eas build --platform ios
   eas submit --platform ios
   ```

### Review Guidelines

Apple typically reviews apps within 24-48 hours. Common rejection reasons:

- **Incomplete app information** - Ensure all fields are filled
- **Misleading functionality** - Accurately describe features
- **Crash on launch** - Test thoroughly before submission
- **Requires login without clear benefit** - Optional login is better
- **Offline content issues** - Clearly state what works offline

### Approval Timeline

- Initial review: 24-48 hours
- If rejected: 24-48 hours to resubmit
- Expedited review: Available for time-sensitive updates

---

## Google Play Store (Android)

### Prerequisites

1. **Google Play Developer Account** ($25 one-time)
   - Sign up at [play.google.com/console](https://play.google.com/console)
   - Add payment method
   - Accept agreements

2. **Signing Certificate**
   ```bash
   eas credentials
   # Follow prompts to set up Android credentials
   ```

### Google Play Console Setup

1. **Create App**
   - Click "Create app"
   - App name: AI Quran Teacher
   - Default language: English
   - App or game: App
   - Category: Education
   - Free or paid: Free

2. **App Details**
   - Short description (80 characters)
   - Full description (4000 characters)
   - Screenshots (minimum 2, maximum 8)
   - Feature graphic (1024x500 px)
   - Icon (512x512 px)

3. **Content Rating**
   - Complete questionnaire
   - Category: Education
   - Content rating: Everyone

4. **Pricing and Distribution**
   - Price: Free
   - Countries: All available

5. **Build Submission**
   ```bash
   eas build --platform android
   eas submit --platform android
   ```

### Review Guidelines

Google Play typically reviews apps within 2-3 hours. Common rejection reasons:

- **Inappropriate content** - Ensure app is family-friendly
- **Broken functionality** - Test all features
- **Misleading claims** - Be accurate in descriptions
- **Privacy policy missing** - Add privacy policy URL
- **Permissions not justified** - Only request necessary permissions

### Approval Timeline

- Initial review: 2-3 hours
- If rejected: Can resubmit immediately
- Staged rollout: Recommended for gradual release

---

## Pre-Submission Checklist

### General

- [ ] App version updated in `app.json`
- [ ] All tests passing: `npm run test`
- [ ] Code linting clean: `npm run lint`
- [ ] Build successful: `npm run build`
- [ ] No console errors or warnings
- [ ] Privacy policy created and accessible
- [ ] Support contact information available
- [ ] Changelog prepared

### iOS Specific

- [ ] App icons provided (1024x1024 minimum)
- [ ] Splash screen configured
- [ ] Bundle ID matches Apple Developer account
- [ ] Signing certificate valid
- [ ] Screenshots (5 per device type recommended)
- [ ] App preview video (optional but recommended)
- [ ] TestFlight beta testing completed

### Android Specific

- [ ] App icons provided (512x512 minimum)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (minimum 2, up to 8)
- [ ] Signing key configured
- [ ] Permissions justified in description
- [ ] Google Play beta testing completed

---

## Submission Commands

### iOS

```bash
# Build for production
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios

# Or build and submit in one command
eas build --platform ios --auto-submit
```

### Android

```bash
# Build for production
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android

# Or build and submit in one command
eas build --platform android --auto-submit
```

---

## Post-Submission

### Monitor Submissions

```bash
# Check build status
eas build --status

# Check submission status
eas submit --status
```

### Update Management

- **iOS:** New versions typically reviewed within 24 hours
- **Android:** New versions typically reviewed within 2-3 hours
- **Staged Rollout:** Recommended for Android (start at 5%, increase gradually)

### Version Management

- Increment version in `app.json`
- Update `CHANGELOG.md` with changes
- Tag release in git: `git tag v1.0.0`

---

## Support and Resources

- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Expo FAQ](https://docs.expo.dev/faq/)

