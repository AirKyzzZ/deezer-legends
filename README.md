<div align="center">

# 🎵 Deezer Legends

<img src="public/deezer-legends.png" alt="Deezer Legends Logo" width="400" />

### Transform your Deezer profile into a stunning holographic trading card

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-deezer--legends.vercel.app-9333ea?style=for-the-badge)](https://deezer-legends.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[![CI](https://github.com/airkyzzz/deezer-legends/actions/workflows/ci.yml/badge.svg)](https://github.com/airkyzzz/deezer-legends/actions/workflows/ci.yml)
[![Security](https://github.com/airkyzzz/deezer-legends/actions/workflows/security.yml/badge.svg)](https://github.com/airkyzzz/deezer-legends/actions/workflows/security.yml)
[![CodeQL](https://github.com/airkyzzz/deezer-legends/actions/workflows/codeql.yml/badge.svg)](https://github.com/airkyzzz/deezer-legends/actions/workflows/codeql.yml)

<br />

[✨ Try it Now](https://deezer-legends.vercel.app/) • [🐛 Report Bug](https://github.com/airkyzzz/deezer-legends/issues) • [💡 Request Feature](https://github.com/airkyzzz/deezer-legends/issues)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🃏 Holographic Trading Cards
Generate stunning TCG-style cards with 3D holographic effects that respond to mouse movement

### 🎨 Genre-Based Theming
Each card dynamically adapts its colors, icons, and style based on your most-listened music genre

### 📊 Music Stats Integration
Displays your top artists, playlists count, and listening habits as attack moves and stats

</td>
<td width="50%">

### 🌍 Multi-Language Support
Available in English and French with automatic browser detection

### 📱 Mobile Responsive
Beautiful experience on all devices with touch-optimized interactions

### 📤 Share & Download
Download your card as an image or share directly to social media

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20.x or higher
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/airkyzzz/deezer-legends.git
cd deezer-legends

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app in action!

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16.1 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Image Export** | html-to-image |
| **Deployment** | Vercel |

</div>

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run type-check` | Run TypeScript compiler checks |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

---

## 🎴 Card Rarity System

Cards are assigned rarity based on your music engagement:

| Rarity | HP Range | Description |
|--------|----------|-------------|
| ⭐ **LEGENDARY** | 200+ | Elite music lovers with exceptional stats |
| 💎 **ULTRA RARE** | 150-199 | Dedicated listeners with impressive collections |
| 🔮 **RARE** | 100-149 | Active music enthusiasts |
| 🎵 **UNCOMMON** | 50-99 | Regular Deezer users |
| 🎶 **COMMON** | 0-49 | New music explorers |

---

## 🎨 Supported Genres

Each genre has unique theming with custom colors, icons, and flavor text:

<div align="center">

`Pop` • `Rock` • `Hip-Hop` • `Rap` • `Electronic` • `Jazz` • `Classical` • `Metal` • `R&B` • `Indie`

</div>

---

## 📁 Project Structure

```
deezer-legends/
├── app/
│   ├── api/deezer/       # API routes for Deezer integration
│   ├── components/       # React components
│   │   ├── hero-search.tsx
│   │   ├── holo-card.tsx
│   │   ├── download-button.tsx
│   │   └── share-button.tsx
│   ├── context/          # React context providers
│   ├── lib/              # Utilities and API functions
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── .github/workflows/    # CI/CD pipelines
```

---

## 🔒 CI/CD Pipeline

This project uses GitHub Actions for continuous integration:

- ✅ **Linting** - ESLint with Next.js rules
- ✅ **Type Checking** - TypeScript strict mode
- ✅ **Build Verification** - Production build tests
- ✅ **Code Formatting** - Prettier consistency checks
- ✅ **Security Scanning** - npm audit + CodeQL analysis

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## ⚠️ Disclaimer

This project is **not affiliated with, endorsed by, or connected to Deezer** in any way. It uses the public Deezer API for educational and entertainment purposes only.

---

<div align="center">

Made with 💜 by [Maxime Mansiet](https://github.com/airkyzzz)

[![GitHub](https://img.shields.io/badge/GitHub-@airkyzzz-181717?style=for-the-badge&logo=github)](https://github.com/airkyzzz)

</div>
