<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# David's Journey: The Epic Board Game

</div>

A digital reimagining of the classic Snakes & Ladders game, following the epic life and journey of King David from the Bible. Navigate through five epochs—from the Shepherd to the King—encountering trials (Snakes) and divine favor (Ladders) along the way!

This project was generated using [Google AI Studio](https://ai.studio/apps/2da158b6-12e5-4986-9289-97fa7102543a).

## 📖 About the Game

Instead of one continuous flow, each stage acts as its own "mini-board" that players must navigate before moving to the next. The game expands the map into five distinct "Epochs" of David's life:

1. **The Shepherd** (Foundations)
2. **The Court & The Giant** (Success & Pressure)
3. **The Wilderness** (Testing & Character)
4. **The Throne** (Power & Temptation)
5. **The Legacy** (Wisdom & Family)

Players must answer questions from the "Quest Cards" to pass through the Gates to the next Epoch.

For more details on game mechanics, challenges, and card types, see the [ABOUT.md](docs/ABOUT.md) document.

## 🚀 Run Locally

This repository contains everything you need to run your app locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Set the `GEMINI_API_KEY` in your `.env.local` to your Google Gemini API key:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will run locally with Vite at `http://localhost:3000`.

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Vite
- **Animations:** Motion
- **Backend/DB:** Express, Better-SQLite3
- **AI Integration:** Google GenAI
