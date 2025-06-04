# Monitoring My Life

A modern daily dashboard web app to track, note, and monitor various aspects of your life. Built with React, Vite, TypeScript, and Material-UI v7.

## ✨ Features
- **Category Dashboard**: Track Health, Finance, Career, Education, Emotion, Family, Spiritual, and Hobby.
- **Add Notes**: Click a category to add/view daily notes with date and time pickers.
- **Alert/Deadline System**: Set deadlines for each category; overdue tasks trigger a pulsing icon.
- **Archive & Restore**: Archive all data with a timestamp and restore from previous archives.
- **Clean Data**: Option to clean all data, with a prompt to archive first.
- **Persistent Storage**: All data is saved in your browser's localStorage.
- **Modern UI**: Responsive, animated, and user-friendly interface using Material-UI v7.

## 🛠️ Tech Stack
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material-UI v7](https://mui.com/)
- [date-fns](https://date-fns.org/) (with Indonesian locale)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later recommended)
- npm or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd report-web
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Open in your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

### Build for Production
```bash
npm run build
# or
yarn build
```
The output will be in the `dist/` folder.

## 📝 Usage
- **Add Notes**: Click a category icon, enter your note, select date/time, and click "Tambah".
- **Set Alert/Deadline**: Use the three-dot menu (top right) or the bell button (bottom right) to add a deadline for a category.
- **View Alerts**: Click the bell button to see all deadlines. Overdue tasks will pulse in red.
- **Archive Data**: Use the three-dot menu to archive all current data.
- **Restore Archive**: Use the three-dot menu to view and restore previous archives.
- **Clean Data**: Use the three-dot menu to clean all data (optionally archive first).

## ⚡ Customization
- **Categories**: Edit the `categories` array in `src/components/MonitoringMyLife.tsx` to add/remove categories.
- **Colors & Icons**: Change the `icon` and `color` fields in the same array.
- **Localization**: Uses Indonesian locale for dates/times by default.

## 🐞 Troubleshooting
### MUI v7 Grid Errors
- Material-UI v7 removed the `item` and `container` props from the `Grid` component. Use `Grid2` from `@mui/material/Unstable_Grid2` for grid layouts, or refactor to use `Stack`/`Box`/CSS Flexbox.
- If you see errors like `Property 'item' does not exist on type 'Grid'`, update your code to use the new API.

### Data Persistence
- All data is stored in your browser's localStorage. Clearing browser data will remove your notes, alerts, and archives.

## 📄 License
MIT (or specify your license here)

---

Made with ❤️ for personal productivity.
