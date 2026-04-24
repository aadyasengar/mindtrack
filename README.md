# MindTrack 🌿
**Your Compass for Mental Wellness.**

MindTrack is a thoughtful, AI-powered mental health platform designed to help you navigate your emotional landscape with clarity and calm. It combines an empathetic AI companion with structured wellness tools to provide a supportive environment for reflection and growth.

## ✨ Key Features

- **💬 AI Companion**: A context-aware, empathetic chatbot that listens without judgment. Features randomized variations and human-like response pacing.
- **📈 Mood Tracker**: Log your daily emotions and gain visual insights into your wellbeing with dynamic analytics and streak tracking.
- **📝 Personal Journal**: A private, distraction-free space to write and save your thoughts.
- **🧘 Wellness Toolkit**: Interactive tools including guided breathing exercises, focus mode, and daily wellness tips.
- **🛡️ Safety Escalation**: Intelligent detection of distress keywords with gentle redirects to professional help and local helplines (e.g., Kiran Helpline).
- **🎤 Voice Input**: Integrated Web Speech API for natural, hands-free conversation.
- **🎨 Calm Aesthetic**: A beautiful Lavender & Calm Blue design system optimized for tranquility and focus.

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion.
- **Backend**: Node.js / Express.
- **Database & Auth**: Supabase (PostgreSQL).
- **AI**: OpenAI API.
- **Voice**: Web Speech API.

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/aadyasengar/mindtrack.git
```

### 2. Install dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 3. Set up Environment Variables
Create a `.env` file in the `server` directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
```

### 4. Run the application
```bash
# Start frontend (root directory)
npm run dev

# Start backend (in server directory)
npm start
```

## 🔒 Privacy & Safety
MindTrack is designed with privacy at its core. Your journal entries and chats are stored securely and are private to you. The app also includes a smart safety layer that detects signs of serious distress and provides immediate resources for professional support.

---
*Made with 🤍 for mental wellbeing.*
