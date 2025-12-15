# ZenTab 🌊

**ZenTab** is a minimal, aesthetic personal dashboard grounded in simplicity and functionality. Designed to replace your "New Tab" page, it brings your bookmarks, weather, and focus together in a beautiful interface. It is inspired by [Momentum](https://momentum.app/).

<p align="center">
  <img src="https://raw.githubusercontent.com/mikaelmalm/zentab/main/assets/zentab-default.png" width="45%" />
  <img src="https://raw.githubusercontent.com/mikaelmalm/zentab/main/assets/zentab-clean.png" width="45%" />
</p>

## ✨ Features

- **Personalized Greeting**: Dynamic time and greeting based on your name.
- **Bookmarks Manager**:
  - Organize links into categories.
  - **Drag & Drop** categories to reorder them to your liking.
  - **Collections**: Create separate profiles/collections (e.g., Work, Personal) and switch between them.
  - **Fuzzy Search**: Search for bookmarks and collections.
  - **Keyboard Navigation**: Fully accessible bookmark and collection navigation via keyboard.
  - Edit titles, URLs, and icons on the fly.
  - Auto-fetch favicons or use custom icon URLs.
- **Weather Integration**:
  - Live temperature and weather conditions.
  - Powered by [Open-Meteo](https://open-meteo.com/) (Free, no API key required).
  - Just set your city in Settings!
- **Edit Mode**: Toggle an editing view to manage your dashboard, or keep it clean for focus.
- **Extension System**: Extend functionality with custom plugins (like the built-in Nameday display).
- **Customization**:
  - Set a custom background image URL
  - Toggle between 12h/24h clock formats.
  - Adjust Clock Size and Date Format.
- **Local First**: All data is persisted locally in your browser so it's snappy and private. You can also **Export/Import** your data to JSON for backup.

## 🛠️ Tech Stack

Built with love using:

- **[React](https://react.dev/)**
- **[Vite](https://vitejs.dev/)**
- **[Tailwind CSS](https://tailwindcss.com/)** (Styling)
- **[Lucide React](https://lucide.dev/)** (Icons)
- **[@dnd-kit](https://dndkit.com/)** (Drag & Drop)
- **TypeScript**

## 🚀 Getting Started

1. **Clone the repository**:

   ```bash
   git clone git@github.com:mikaelmalm/zentab.git
   cd zentab
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

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🧩 Add as Chrome Extension

1. **Build the project**:

   ```bash
   npm run build:extension
   ```

2. **Load into Chrome**:
   - Open Chrome and navigate to `chrome://extensions`.
   - Enable **Developer mode** (top right).
   - Click **Load unpacked**.
   - Select the `dist` folder in your project directory.
   - Open a new tab to see **ZenTab** in action!

## 🔌 Extension System

ZenTab features a modular extension system allowing usage of custom components rendered on the dashboard.

### **Structure**

Extensions live in `src/extensions/`. Each extension folder (e.g., `src/extensions/nameday/`) contains:

- `index.tsx`: The main component rendered on the dashboard.
- `settings.tsx`: The settings configuration and UI component.

### **Creating a new Extension**

1. **Create the folder**: `src/extensions/my-extension/`
2. **Create the Component** (`index.tsx`):
   ```tsx
   export default function MyExtension({ settings }) {
     if (!settings.enabled) return null;
     return <div>Hello World</div>;
   }
   ```
3. **Define Settings** (`settings.tsx`):
   ```tsx
   const config: ExtensionConfig = {
     id: 'my-extension',
     name: 'My Extension',
     component: MyExtension,
     defaultSettings: { enabled: true },
     settingsComponent: ({ settings, onUpdateSettings }) => (
       // ... your settings UI
     )
   };
   export default config;
   ```
4. **Register**: Add your config to the list in `src/extensions/registry.ts`.

## 📝 Usage

- **Edit Mode**: Click the **Pen icon** (top right) to enable adding/removing content.
- **Settings**: Click the **Gear icon** to open the tabbed settings modal.
  - **Appearance**: Name, background, opacity.
  - **General**: Weather, clock, dates, data management.
  - **Extensions**: Enable/configure installed extensions.
- **Collections**: Use the tabs at the bottom right to switch contexts. Press `Tab` then `Enter`/`Space` to navigate via keyboard.

---

_Created by Mikael Malm._
