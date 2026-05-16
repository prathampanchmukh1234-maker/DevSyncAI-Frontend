# DevSync AI - Frontend

React + Vite frontend for DevSync AI, powered by IBM Bob AI.

## 🚀 Features

- **Code Onboarder**: Analyze GitHub repositories and generate onboarding docs
- **Documentation Generator**: Create JSDoc comments, README, and unit tests
- **Task Automator**: Perform code transformations with natural language
- **Dashboard**: Real-time metrics and analytics
- **Export Reports**: Download comprehensive usage reports

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account
- Backend API running

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure .env with your values
```

## 🔧 Environment Variables

Create a `.env` file with:

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏃 Running Locally

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

App will start on `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   ├── components/
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   └── BobResponseCard.jsx # Bob response display
│   ├── pages/
│   │   ├── Dashboard.jsx    # Dashboard with metrics
│   │   ├── CodeOnboarder.jsx # Code analysis feature
│   │   ├── DocGenerator.jsx  # Documentation generator
│   │   ├── TaskAutomator.jsx # Task automation
│   │   └── ExportReport.jsx  # Report export
│   ├── hooks/
│   │   └── useBob.js        # Custom hook for Bob API
│   └── lib/
│       ├── auth.js          # Authentication utilities
│       └── supabase.js      # Supabase client
├── public/                  # Static assets
└── index.html              # HTML template
```

## 🎨 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Supabase** - Authentication & Database
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

## 🔌 Features

### Code Onboarder
Analyze GitHub repositories and generate:
- Project summary
- Getting started guide
- Key files overview
- Architecture description

### Documentation Generator
Generate for any code:
- JSDoc comments
- README sections
- Unit tests
- Edge cases

### Task Automator
Automate coding tasks:
- Code refactoring
- Pattern conversion
- Performance optimization
- Syntax modernization

### Dashboard
View real-time:
- Total sessions
- Lines generated
- Tests created
- Tasks automated

### Export Report
Download comprehensive reports:
- All Bob interactions
- Metrics and statistics
- Session history
- JSON format

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables
4. Deploy

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 🎨 Customization

### Tailwind Configuration
Edit `tailwind.config.js` to customize:
- Colors
- Fonts
- Spacing
- Breakpoints

### Theme
The app uses a dark theme by default. Colors are defined in `tailwind.config.js`:
- Primary: IBM Blue (#0f62fe)
- Background: Dark shades
- Text: White/Gray

## 🐛 Troubleshooting

**Vite not starting:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API connection errors:**
- Verify VITE_API_URL in .env
- Ensure backend is running
- Check browser console for errors

**Authentication not working:**
- Verify Supabase credentials
- Check if Supabase project is active
- Clear browser cache and cookies

**Build errors:**
```bash
# Clean build
rm -rf dist
npm run build
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔒 Security

- Environment variables for sensitive data
- Supabase Auth for authentication
- JWT tokens for API requests
- HTTPS in production
- No sensitive data in localStorage

## 📊 Performance

- Code splitting with React.lazy
- Optimized bundle size
- Fast refresh in development
- Production build optimization

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Made with ❤️ using IBM Bob AI