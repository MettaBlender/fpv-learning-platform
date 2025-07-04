# FPV Learning Platform

The FPV Learning Platform is a modern web application for building, managing, and learning about FPV (First Person View) drone builds. It is designed to help beginners and enthusiasts explore, configure, and document their own drone projects with ease.

## Features

- **Interactive Drone Builder:**
  - Visualize and assemble custom FPV drone builds using an interactive SVG model.
  - Select, filter, and highlight components (frame, motors, ESC, FC, propellers, battery, camera) with real-time compatibility checks.
  - Color-coded selection: green for selected, blue for active, gray for unselected, light blue for hover.

- **Build Management:**
  - Save, edit, and delete multiple drone builds.
  - Edit builds in a dialog with a two-column layout: drone visualization and component selection.
  - Collapsible build cards for a clean overview.

- **Component Database:**
  - Browse and filter a large database of drone parts.
  - Detailed component information, images, prices, and shop links.

- **User Experience:**
  - Responsive design for desktop and mobile.
  - Tooltips, badges, and modern UI elements (Shadcn UI, Next.js, React).
  - Toast notifications for actions and errors.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Shadcn UI, Tailwind CSS
- **Backend:** Node.js (API routes), JSON/REST
- **Other:**
  - Lucide Icons
  - Sonner (toast notifications)

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```
2. **Start the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

   OR visit: https://fpv-learning-platform.vercel.app/

## Project Structure

- `components/` – UI components, drone builder, dialogs, forms
- `app/` – Next.js app directory, pages, API routes
- `lib/` – Utility functions, session handling
- `public/` – Images and static assets

## Contributing

Contributions, bug reports, and feature requests are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.