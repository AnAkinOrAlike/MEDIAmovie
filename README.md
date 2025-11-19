# MEDIAmovie

A responsive web application to track and manage your personal media consumption — movies, series, animation and books — built with React and Supabase.

## 🎟 Badges

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#license) ![JS](https://img.shields.io/badge/language-JavaScript-yellow) ![CSS](https://img.shields.io/badge/style-CSS-blue)

## 📌 Overview

MEDIAmovie helps you collect, rate, and track media items across statuses (Want to Watch / Want to Read, Watching / Reading, Watched / Read). It supports custom cover uploads, filtering, and a clean responsive UI for mobile and desktop.

Last Release: [text](https://github.com/AnAkinOrAlike/MEDIAmovie/releases/tag/alpha-0.2.0)

## 📌 Features

- Add and organize media items (Movies, Series, Animation, Books)
- Personal rating system (1–5 stars)
- Record last seen / read date
- Track status: Want to Watch / Want to Read, Watching / Reading, Watched / Read
- Filter and sort by type, genre, year, and status
- Upload and store cover images via Supabase Storage
- Assign a custom color to each item
- Fully responsive grid layout (mobile, tablet, desktop)
- Query system, with filters

## 🧰 Tech Stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Frontend   | React (Create React App)                     |
| Styling    | CSS (custom + utility classes)               |
| Backend    | Supabase (PostgreSQL + Storage)              |
| Language   | JavaScript, CSS, HTML                        |
| Deployment | Vercel (frontend), Supabase (backend)        |

## 🚀 Getting Started (Local)

Follow these steps to run the project locally.

1. Clone the repo
   ```bash
   git clone https://github.com/AnAkinOrAlike/MEDIAmovie.git
   cd MEDIAmovie
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure Supabase
   - Create a project at https://supabase.com.
   - Create the tables (you can use SQL migrations or the Supabase Table Editor).
   - Set up Supabase Storage for cover images and create a bucket.
   - Copy your Supabase project URL and ANON key from Project Settings → API.

4. Environment variables
   - Create a .env file in the project root and add:
     ```env
     REACT_APP_SUPABASE_URL=https://your-project.supabase.co
     REACT_APP_SUPABASE_ANON_KEY=your-anon-key
     ```
   - Restart the dev server after changing env vars.

5. Run the app
   ```bash
   npm start
   ```
   Open http://localhost:3000 to view the app.

## 📦 Build & Test

- Build for production:
  ```bash
  npm run build
  ```
- Run tests:
  ```bash
  npm test
  ```

## 📁 Folder structure

A suggested overview of the repository layout and important files — adjust to your actual structure if it differs.

```
MEDIAmovie/
├── .github/                    # CI, issue templates, workflows (optional)
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/             # reusable UI components
│   │   ├── ListaParaVer.jsx
│   │   └── NuevoMedia.jsx
│   ├── supabase.js             # API / Supabase client wrappers
│   ├── hooks/                  # custom React hooks
│   ├── utils/                  # helper functions
│   ├── main.css                # global styles and variables
│   ├── index.js
│   └── App.js
├── scripts/                    # optional build / dev scripts
├── .env                        # local env vars (not committed)
└── package.json
```

## 🗃️ Supabase Database Structure

**Main tables**

| Table      | Purpose                                                  |
|------------|----------------------------------------------------------|
| MEDIA      | Stores each media entry (movie, series, book, etc.)      |
| DIRECTORES | Directors, creators, or authors                          |
| CATEGORIA  | Genres or categories (action, drama, fantasy, etc.)      |
| COUNTRY    | Country of origin                                        |
| COMPAÑIA   | Production company, publisher, or studio                 |
| VISTOS     | History of completed media                               |
| MARCHA     | Media currently in progress ("watching/reading")         |

**Public Views**

| View        | Purpose                                                       |
|-------------|---------------------------------------------------------------|
| mediavistos | Combined view of completed media with enriched details        |
| mediamarcha | Combined view of media in progress, useful for tracking state |

**Relationships**

- MEDIA references DIRECTORES, CATEGORIA, COUNTRY, and COMPAÑIA (foreign keys).
- VISTOS and MARCHA link to MEDIA via id_media.
- Views like mediavistos and mediamarcha join MEDIA with related tables to present complete records.

---

## 🧪 Future Improvements

Planned or suggested enhancements to consider for upcoming iterations:

- 📊 Dashboard with personal metrics (total time watched, top genres)
- 📤 CSV export/import
- 🧠 Smart recommendations by genre or creator
- 🔐 Optional user authentication
- 🎞 Translation into TypeScript

## ♻️ Contributing

Contributions are welcome. Suggested workflow:
- Open an issue to discuss larger changes.
- Create a branch for your feature or fix.
- Submit a pull request with a clear description and testing notes.

Please include `npm test` results and any migration SQL if you modify the database schema.

## 🧾 License

MIT — see LICENSE

## 🙏 Acknowledgements

- Project scaffolded with Create React App.
- Backend powered by Supabase (Postgres + Storage).

---