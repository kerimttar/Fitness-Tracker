FitTrack is a component-based web application that allows users to easily manage their daily calories, water intake, and exercise routines through a modern dashboard interface.

## 🚀 Live Demo
You can access the live deployment here: 
🔗 https://agent-6a0856b92908f95541b96--cheery-naiad-2b4618.netlify.app/

---

## 📋 Project Requirements & Features

This project was developed in strict accordance with modern web development standards and specific project criteria:

- **Modern JS Framework:** Built using **ReactJS** with Vite for optimal performance.
- **Folder Architecture:** Adheres to structured modularity with dedicated `Components`, `Pages`, and `Interfaces` directories.
- **UI & Design:** Styled with **Tailwind CSS** to ensure a fully responsive, mobile-friendly, and sleek dark-themed user interface.
- **Full CRUD Cycle:**
  - **Create:** Add new meals via `MealForm` and exercises via `ExerciseForm`.
  - **Read:** Dynamically display logged data inside structured tables/lists (`MealList`, `ExerciseList`).
  - **Update:** Edit existing logs and records directly from the UI.
  - **Delete:** Remove logs instantly from the lists with a single click.

---

## 🛠️ Tech Stack

- **Frontend:** ReactJS (JSX), Vanilla JavaScript
- **Styling:** Tailwind CSS, PostCSS
- **Build Tool:** Vite
- **Deployment:** Netlify

---

## 📁 Project Structure

```text
src/
├── Components/       # Reusable UI components (Forms, Lists, Progress Bars)
├── Interfaces/       # Data models and type blueprints (types.js)
├── Pages/            # Main views and Dashboard container
├── App.jsx           # Root application component & core State management
├── main.jsx          # React entry point
└── index.css         # Tailwind CSS directives

Installation & Local Setup
To run this project locally, follow these steps:

Vs code terminal
git clone [Paste_Your_Github_Repo_Link_Here].git
cd FITNESS-TRACKER
npm install
npm run dev
