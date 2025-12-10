# ZenTab 🌊

**ZenTab** is a minimal, aesthetic personal dashboard grounded in simplicity and functionality. Designed to replace your "New Tab" page, it brings your bookmarks, weather, and focus together in a beautiful interface. It is inspired by Momentum, but adjusted for more personal use.

## ✨ Features

- **Personalized Greeting**: Dynamic time and greeting based on your name.
- **Bookmarks Manager**:
  - Organize links into categories.
  - **Drag & Drop** categories to reorder them to your liking.
  - Edit titles, URLs, and icons on the fly.
  - Auto-fetch favicons or use custom icon URLs.
- **Weather Integration**:
  - Live temperature and weather conditions.
  - Powered by [Open-Meteo](https://open-meteo.com/) (Free, no API key required).
  - Just set your city in Settings!
- **Clean Mode**: Toggle a distraction-free view that hides all editing controls.
- **Customization**:
  - Set a custom background image URL (supports Unsplash, etc.).
  - Toggle between 12h/24h clock formats.
- **Local First**: All data is persisted locally in your browser so it's snappy and private. You can also **Export/Import** your data to JSON for backup.

## 🛠️ Tech Stack

Built with love using:

- **[Next.js](https://nextjs.org/)** (App Router)
- **[Tailwind CSS](https://tailwindcss.com/)** (Styling)
- **[Lucide React](https://lucide.dev/)** (Icons)
- **[@dnd-kit](https://dndkit.com/)** (Drag & Drop)
- **TypeScript**

## 🚀 Getting Started

1. **Clone the repository**:

   ```bash
   git clone git@github.com:mikaelmalm/malmentum.git
   cd malmentum
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   bun install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

- **Hover** over bookmarks to see Edit/Delete options.
- Click the **Settings (Gear)** icon bottom-left to:
  - Change your Name.
  - Set your City for weather.
  - Toggle Clean Mode.
  - Import/Export your configuration.
- **Drag** the handle on category headers to reorder them (unless in Clean Mode).

---

_Created by Mikael Malm._
