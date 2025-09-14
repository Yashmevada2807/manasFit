# ManasFit - AI Platform for Student Wellness

A comprehensive wellness platform designed specifically for students, featuring AI-powered insights, smartwatch integration, and personalized health tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ManasFit
   ```

2. **Run the setup script**
   ```bash
   npm run setup
   ```

3. **Configure environment variables**
   - Edit `backend/.env` with your MongoDB URI and API keys
   - Edit `frontend/.env` with your API URL

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Neo-Brutalist design
- **State Management**: Zustand
- **Routing**: React Router
- **HTTP Client**: Axios
- **UI Components**: Custom brutalist components

### Backend (Node.js + Express)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **AI Integration**: OpenAI API

## 📱 Features

### Core Features
- **User Authentication**: Secure registration and login
- **Wellness Tracking**: Sleep, steps, study hours, mood, stress
- **AI Assistant**: Personalized wellness insights and recommendations
- **Dashboard**: Comprehensive wellness overview with charts
- **Resource Hub**: Curated articles, videos, and tools
- **Smartwatch Integration**: Fitbit, Google Fit, Apple Health
- **Gamification**: Streaks, badges, and rewards

### Design System
- **Neo-Brutalist UI**: Bold, blocky design with MongoDB green palette
- **Responsive**: Mobile-first design
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized for fast loading

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Building
npm run build            # Build both frontend and backend
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Utilities
npm run install:all      # Install all dependencies
npm run setup            # Run setup script
```

### Project Structure

```
manasfit/
├── backend/          # Node.js/Express backend
├── frontend/         # React frontend
├── package.json      # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Wellness Data
- `POST /wellness/add` - Add wellness data
- `GET /wellness/dashboard` - Get dashboard data
- `POST /wellness/sync-watch` - Sync smartwatch data

### AI Chatbot
- `POST /ai/chat` - Chat with AI agent

### Resources
- `GET /resources` - Fetch curated resources

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Railway/Heroku/Vercel)
1. Set environment variables in your deployment platform
2. Ensure MongoDB connection string is configured
3. Deploy the backend

### Frontend Deployment (Vercel/Netlify)
1. Set `VITE_API_URL` to your deployed backend URL
2. Deploy the frontend

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🔧 Development

### Available Scripts

**Root Level:**
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run install:all` - Install all dependencies

**Backend:**
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm test` - Run tests

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Structure

The application follows a clean architecture pattern:

- **Backend**: Express.js with TypeScript, MongoDB with Mongoose
- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **State Management**: Zustand for client-side state
- **API Communication**: Axios with interceptors
- **Authentication**: JWT tokens with secure storage
- **Charts**: Recharts for data visualization

## 🛠️ Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or use MongoDB Atlas
   - Check the connection string in `backend/.env`

2. **OpenAI API Error**
   - Verify your OpenAI API key is correct
   - Check your OpenAI account has sufficient credits

3. **Port Already in Use**
   - Change the PORT in `backend/.env`
   - Update `VITE_API_URL` in `frontend/.env` accordingly

4. **CORS Issues**
   - Ensure `FRONTEND_URL` in backend matches your frontend URL
   - Check that both servers are running on the correct ports

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Review the API documentation at `/api/health`
- Ensure all environment variables are properly set

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS is properly configured
- Input validation on all endpoints
- Rate limiting implemented
- Helmet.js for security headers

## 📊 Features Overview

### ✅ Implemented Features
- [x] User authentication (register/login)
- [x] Wellness data tracking
- [x] Interactive dashboard with charts
- [x] AI chatbot for wellness support
- [x] Resource hub with curated content
- [x] Smartwatch integration (Fitbit/Google Fit)
- [x] Goal setting and tracking
- [x] Alert system for wellness metrics
- [x] Gamification (badges, streaks)
- [x] Profile management
- [x] Responsive design

### 🚧 Future Enhancements
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and insights
- [ ] Social features and community
- [ ] Integration with more health platforms
- [ ] Offline support
- [ ] Push notifications
- [ ] Advanced AI features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- MongoDB for database
- React and Vite teams
- Tailwind CSS for styling
- All open-source contributors

---

**Made with ❤️ for student wellness**
