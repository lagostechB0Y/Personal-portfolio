# LagosTechBoy - Modern Personal Portfolio

![LagosTechBoy Portfolio Screenshot](https://i.imgur.com/example.png) <!-- Suggestion: Replace with a screenshot of your live portfolio -->

This is a modern, responsive, single-page portfolio for a software engineer. It's built with **TypeScript** and **Vite**, designed to be a fast, lightweight frontend powered by a **headless WordPress backend** via the REST API.

The project features a clean, developer-centric aesthetic with a dark/light theme toggle, smooth animations, and dynamic content fetching for projects.

---

## ✨ Core Features

-   **Dynamic Project Portfolio**: Fetches and displays project data from a headless WordPress API, including titles, descriptions, images, and tech stacks.
-   **Headless CMS Ready**: Works out-of-the-box with a demo API but can be easily configured to connect to your own WordPress installation for full content control.
-   **Responsive & Mobile-First**: A clean, fluid design that looks great on all devices, from mobile phones to desktop displays.
-   **Dark & Light Mode**: A sleek theme toggle that respects user's system preference (`prefers-color-scheme`) and persists their choice in local storage.
-   **Interactive UI**:
    -   An elegant project carousel for desktop and a touch-friendly slider for mobile.
    -   A fully accessible modal (dialog) for viewing detailed project information.
    -   Smooth, performant fade-in animations on scroll.
-   **Modern Tooling**: Built with Vite for a blazing-fast development server and optimized production builds.

---

## 🛠️ Tech Stack

-   **Frontend**: TypeScript, HTML5, CSS3 (with Custom Properties for theming)
-   **Build Tool**: Vite
-   **Backend (Headless)**: Designed for WordPress & REST API
-   **Fonts**: Google Fonts ([Manrope](https://fonts.google.com/specimen/Manrope) & [Space Mono](https://fonts.google.com/specimen/Space+Mono))

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (v18 or higher recommended) and npm installed on your system.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will now be running on `http://localhost:5173`. The site will use the default demo API for content.

---

## ⚙️ Configuration (Connecting to Your WordPress)

To power the portfolio with your own content, you need a WordPress site with the REST API enabled.

### 1. Change the API Endpoint

The portfolio connects to a demo API by default. To use your own, modify the `API_BASE_URL` constant in the `portfolio.ts` file:

```typescript
// in portfolio.ts
const API_BASE_URL = 'https://your-wordpress-site.com/wp-json'; // Change this URL
```

### 2. WordPress Setup

For the portfolio to work correctly, your WordPress backend should be structured as follows:

-   **Custom Post Type**: Create a custom post type with the slug `project`. You can do this with a plugin like [Custom Post Type UI](https://wordpress.org/plugins/custom-post-type-ui/).
-   **Required Fields**: Use a plugin like [Advanced Custom Fields (ACF)](https://www.advancedcustomfields.com/) to add the following fields to your `project` post type and ensure they are exposed to the REST API:
    -   `stack` (Text): A comma-separated list of technologies (e.g., "React, TypeScript, CSS").
    -   `live_url` (URL): A link to the live project.
    -   `repo_url` (URL): A link to the source code repository.
-   **Standard Fields**: The portfolio also uses these standard WordPress fields:
    -   **Title**: The project's name.
    -   **Excerpt**: Used for the short description on the project card.
    -   **Content/Body**: Used for the full description in the project modal.
    -   **Featured Image**: The main image for the project card and modal.

---

## 📦 Build for Production

To create an optimized, production-ready build of the app:

```bash
npm run build
```

This command generates a `dist/` folder containing all the static assets for your website. You can deploy the contents of this folder to any static hosting provider like Vercel, Netlify, or GitHub Pages.

---

## 📄 License

This project is licensed under the Apache-2.0 License. See the LICENSE file for details.
