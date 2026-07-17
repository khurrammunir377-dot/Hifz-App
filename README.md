# AI Quran Teacher

A comprehensive mobile application for learning and memorizing the Quran with AI-powered features, built with React Native, Expo, and TypeScript.

## Features

- **Complete Quran Database:** Word-by-word Uthmani script with English translations and transliterations
- **Intelligent Search:** Arabic-normalized search across all Quranic text
- **Lesson Management:** Create and track personalized lessons
- **Bookmarks:** Save favorite verses for quick access
- **Cross-Platform:** Available on Web, iOS, and Android
- **Offline Support:** Access Quran data offline (coming soon)
- **AI-Powered Analysis:** Tajweed and pronunciation analysis (coming soon)

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (this project uses pnpm exclusively — see `packageManager` in `package.json` and `pnpm-lock.yaml`; using `npm` or `yarn` will produce a broken/mismatched install)
- Expo CLI (for mobile development)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-quran-teacher.git
cd ai-quran-teacher

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### Development

```bash
# Start the development server
pnpm dev

# This will start both the backend server and Expo Metro bundler
# Web version: http://localhost:8081
# Backend API: http://localhost:3000
```

### Testing

```bash
# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

### Building

```bash
# Build backend for production
pnpm build

# Start production server
pnpm start
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for web, iOS, and Android.

### Quick Deploy

**Web:**
```bash
pnpm build
# Deploy to Manus WebDev
```

**iOS:**
```bash
eas build --platform ios
eas submit --platform ios
```

**Android:**
```bash
eas build --platform android
eas submit --platform android
```

## Project Structure

```
ai-quran-teacher/
├── app/                    # React Native/Expo screens
├── server/                 # Backend API and services
│   ├── db/                # Database schema and migrations
│   ├── utils/             # Utilities (Arabic normalization, etc.)
│   └── _core/             # Core server setup
├── docs/                  # Documentation
├── assets/                # App icons and images
├── app.json               # Expo configuration
├── eas.json               # EAS Build configuration
└── package.json           # Dependencies
```

## Database

The app uses MySQL with Drizzle ORM. Database schema includes:

- **Surahs:** Quranic chapters with metadata
- **Ayahs:** Verses with Uthmani text and classifications
- **Words:** Word-by-word data with translations
- **Lessons:** User lesson progress tracking
- **Bookmarks:** User bookmarked verses

## API

The app exposes a tRPC API with the following main endpoints:

- `quran.getSurahs()` - Get all Surahs
- `quran.searchQuran()` - Search Quranic text
- `quran.createLesson()` - Create a lesson
- `quran.createBookmark()` - Bookmark a verse

See [docs/QuranKnowledgeEngine.md](./docs/QuranKnowledgeEngine.md) for complete API documentation.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact us at support@manus.im.

## Acknowledgments

- Quranic data sourced from verified Islamic repositories
- Built with [Expo](https://expo.dev), [React Native](https://reactnative.dev), and [TypeScript](https://www.typescriptlang.org)
- Database powered by [Drizzle ORM](https://orm.drizzle.team) and [MySQL](https://www.mysql.com)
