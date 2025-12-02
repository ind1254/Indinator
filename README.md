# Ind-inator 🎭

An AI-powered character guessing game inspired by Akinator. Think of a fictional character, and Ind-inator will try to guess who you're thinking of by asking you a series of questions!

## 🎮 Features

- **Interactive Gameplay**: Answer questions with 5 response options (Yes, Probably, Maybe, Probably Not, No)
- **AI-Powered Guessing**: Uses Bayesian inference and entropy-based question selection
- **100+ Characters**: Database includes characters from movies, TV shows, anime, video games, and books
- **Modern Web UI**: Beautiful React frontend with smooth animations and dark blue theme
- **Real-time Progress**: Visual progress bar showing uncertainty reduction
- **Character List**: Browse all available characters in the Info modal

## 🛠️ Tech Stack

### Backend
- **Python 3.13+**
- **Flask** - REST API server
- **NumPy** - Numerical computations
- **scikit-learn** - Machine learning (PCA for embeddings)
- **Custom AI Engine** - Bayesian inference and entropy-based question selection

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Vite** - Build tool
- **shadcn/ui** - UI components

## 📋 Prerequisites

- Python 3.13 or higher
- Node.js 18+ and npm
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd group20-indinator
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

## 🎯 Running the Application

### Start the Backend Server

In the root directory:

```bash
python api_server.py
```

The backend will start on `http://127.0.0.1:5000`

### Start the Frontend Development Server

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:8080`

### Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

## 📁 Project Structure

```
group20-indinator/
├── api_server.py              # Flask API server
├── main.py                    # CLI game entry point
├── requirements.txt           # Python dependencies
├── data/                      # Game data files
│   ├── characters.json       # Character database
│   ├── questions.json        # Question database
│   ├── traits_flat.json      # Character traits
│   └── ...
├── indinator/                 # Core AI engine
│   ├── ai_engine.py          # Main AI logic
│   ├── game.py               # Game logic
│   ├── game_history.py       # Learning system
│   └── rl_agent.py           # Reinforcement learning
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── lib/              # Utilities & API client
│   │   └── data/             # Frontend data
│   └── package.json
└── scripts/                   # Data generation scripts
```

## 🎲 How to Play

1. **Start the Game**: Click "Start Game" on the landing screen
2. **Think of a Character**: Choose any character from the database (view all in the Info modal)
3. **Answer Questions**: Respond to each question with one of five options:
   - ✅ **Yes** - Definitely true
   - 👍 **Probably** - Likely true
   - 🤷 **Maybe** - Uncertain
   - 👎 **Probably Not** - Likely false
   - ❌ **No** - Definitely false
4. **Wait for the Guess**: Ind-inator will make a guess when confident enough
5. **Provide Feedback**: Confirm if the guess is correct or incorrect

## 👥 Team

This project was created by:
- **Ind**
- **Jay**
- **Emily**
- **Vidhi**

## 🔧 Development

### Building for Production

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

### Running Tests

```bash
# Python tests
pytest

# Frontend linting
cd frontend
npm run lint
```

## 📝 API Endpoints

- `POST /api/start` - Start a new game
- `POST /api/answer` - Submit an answer to a question
- `POST /api/next-question` - Get the next question (after wrong guess)
- `POST /api/guess-feedback` - Provide feedback on a guess

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python 3.13+ is installed
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Verify data files exist in the `data/` directory

### Frontend won't connect
- Ensure backend is running on port 5000
- Check that Vite proxy is configured correctly in `frontend/vite.config.ts`
- Try restarting both servers

### Port already in use
- Backend: Change port in `api_server.py` (line 243)
- Frontend: Change port in `frontend/vite.config.ts` or use `npm run dev -- --port 3000`

## 📄 License

This is a group project for an AI class.

## 🙏 Acknowledgments

Inspired by Akinator - the web-based character guessing game.
