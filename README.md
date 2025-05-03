# SkillKart - Curated Learning Roadmap Builder

SkillKart is a platform where learners can build personalized roadmaps to master new skills (e.g., Web Development, UI/UX, Data Science).

## Features

- 🔐 **Authentication & Profile Setup**: Create an account and set up your learning profile with interests, goals, and available weekly time.
- 🧭 **Personalized Roadmap Engine**: Generate a recommended learning path based on your selected skill.
- 📚 **Learning Resource Integration**: Access curated videos, blogs, and quizzes for each roadmap step.
- 💬 **Peer Support**: Engage with other learners through public discussion threads for each roadmap.
- 🏆 **Gamification**: Earn XP points and badges by completing roadmap steps and maintaining streaks.

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Firebase Authentication
- Zustand for state management

### Backend
- Node.js with Express.js
- MongoDB for database
- Firebase Admin SDK for authentication

## Setup Instructions

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB account (Atlas)
- Firebase project

### Environment Variables

1. Create a `.env` file in the root directory (for the client)
2. Create a `.env` file in the server directory (for the backend)

Use the `.env.example` files as templates.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/skillkart.git
cd skillkart

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Running the Application

```bash
# Start the backend server
cd server
npm run dev

# In a separate terminal, start the frontend
npm run dev
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Add the environment variables
3. Deploy with the following settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Backend (Render)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Add the environment variables
4. Deploy with the following settings:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`

## Project Structure

```
skillkart/
├── client/                       # React frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── context/            # State management (Zustand)
│   │   ├── services/           # API services
│   │   ├── store/              # Zustand stores
│   │   ├── assets/             # Images, fonts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
├── server/                       # Node.js backend
│   ├── src/
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── index.js
```

## License
MIT

## Contributing
1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request