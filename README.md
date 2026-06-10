# 🎓 StudyAI — AI-Powered Study Planner

> **Plan Smarter. Learn Faster. Achieve More.**

A premium SaaS-style EdTech web application that generates personalized AI study schedules, tracks academic performance, manages exam timelines, and builds consistent study habits — all powered by smart scheduling algorithms and proven cognitive science principles.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://github.com/Himanshu-GenAI/EduPlanner-AI)
[![GitHub Stars](https://img.shields.io/github/stars/Himanshu-GenAI/EduPlanner-AI?style=for-the-badge)](https://github.com/Himanshu-GenAI/EduPlanner-AI/stargazers)
[![License](https://img.shields.io/github/license/Himanshu-GenAI/EduPlanner-AI?style=for-the-badge)](LICENSE)

---

## 📸 Screenshots

| Homepage Hero | Dashboard Preview | Pricing Plans |
|:---:|:---:|:---:|
| ![Hero](https://placehold.co/340x200/064e3b/ffffff?text=Hero+Section) | ![Dashboard](https://placehold.co/340x200/065f46/ffffff?text=Dashboard) | ![Pricing](https://placehold.co/340x200/047857/ffffff?text=Pricing+Plans) |

---

## ✨ Key Features

### 🤖 AI Scheduling Engine
- **AI Timetable Generator** — Dynamically allocates study hours by subject difficulty, upcoming deadlines, and daily availability
- **Difficulty Weighting** — Harder subjects receive proportionally more study slots automatically
- **Deadline Prioritization** — Urgency increases automatically as exam dates approach
- **Spaced Repetition** — Schedules review sessions at optimal intervals (1, 4, 10 days) to maximize long-term retention
- **Dynamic Recalibration** — Misses a session? Hit "Regenerate" and the plan recalculates instantly

### 📊 Progress & Analytics
- **Interactive Dashboard** — Weekly calendar, subject progress bars, upcoming exams, and study hours at a glance
- **Study Streak Tracker** — Gamified daily streaks with visual heatmaps and milestone rewards
- **Goal Tracking** — Set weekly targets and track completion % in real-time
- **Performance Analytics** — Canvas-rendered donut charts, subject breakdown, and focus index scoring
- **Subject-wise Reports** — Hours logged, task completion rate, revision coverage & predicted readiness

### 🔔 Smart Tools
- **Smart Reminders** — Browser toast alerts before sessions start to minimize procrastination
- **Exam Preparation Planner** — Structures review blocks and spaced-repetition cycles ahead of every exam
- **Personalized Recommendations** — AI identifies weak subjects and suggests session length adjustments
- **Pomodoro Integration** — 25-min focus + 5-min break blocks built into every study slot

### 🎨 Premium UI/UX
- **Glassmorphism Design** — Modern frosted-glass cards with backdrop blur effects
- **Dark / Light Mode** — Full theme toggle with persistent preference
- **Smooth Animations** — Scroll-triggered reveal effects, floating widgets, progress bar animations
- **Fully Responsive** — Works seamlessly on desktop, tablet, and mobile
- **AI Chatbot** — Built-in study assistant for quick queries

---

## 📋 Pages

| Page | Description |
|------|-------------|
| `index.html` | Landing page — hero, stats, features, dashboard mockup, testimonials, pricing, FAQ |
| `about.html` | Mission, why AI, pain points, AI mechanisms, comparison |
| `features.html` | 8 advanced feature cards + full pricing comparison table |
| `testimonials.html` | Student reviews, community ratings, review submission form |
| `contact.html` | Contact form, FAQ accordion, support info |
| `dashboard.html` | Interactive analytics dashboard with charts and streak tracker |
| `planner.html` | AI schedule generator — input subjects, get weekly timetable |
| `analytics.html` | Performance insights and subject-level breakdown |
| `login.html` | User authentication |
| `signup.html` | Account creation |

---

## 💰 Pricing Tiers

| Plan | Price | Key Inclusions |
|------|-------|----------------|
| **Free** | $0/mo | 3 subjects, basic dashboard, streak tracker, PDF export |
| **Student Premium** | $2.99/mo | Unlimited subjects, deep analytics, smart reminders, recommendations |
| **Pro** | $4.99/mo | Everything + Google/Outlook sync, AI chatbot, API access, priority support |

> 💡 Save 20% with annual billing (toggle on the pricing section)

---

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|-------|
| **HTML5** | Semantic page structure |
| **CSS3** | Custom design system, glassmorphism, animations |
| **Vanilla JavaScript** | Scheduling algorithm, localStorage CRUD, chart rendering |
| **Inter + Space Grotesk** | Google Fonts typography |
| **Canvas API** | Donut charts for analytics |
| **localStorage** | All data storage — no backend required |

---

## 🚀 Getting Started

### Run Locally (No Dependencies)

```bash
# 1. Clone the repository
git clone https://github.com/Himanshu-GenAI/EduPlanner-AI.git

# 2. Navigate into the project
cd EduPlanner-AI

# 3. Open in browser (any of these methods)

# Option A — Python HTTP Server (recommended)
python -m http.server 8000
# Then open: http://localhost:8000

# Option B — Node.js serve
npx serve .
# Then open: http://localhost:3000

# Option C — Direct open
# Simply double-click index.html in your file explorer
```

---

## 📁 Project Structure

```
EduPlanner-AI/
├── index.html          # Homepage (landing page)
├── about.html          # About & mission
├── features.html       # Features & pricing
├── testimonials.html   # Student reviews
├── contact.html        # Contact & FAQ
├── dashboard.html      # Analytics dashboard
├── planner.html        # AI schedule generator
├── analytics.html      # Performance reports
├── login.html          # Authentication
├── signup.html         # Registration
│
├── css/
│   ├── style.css       # Design tokens, base styles, animations
│   ├── components.css  # UI components (cards, navbar, pricing, modals)
│   ├── dark-mode.css   # Dark theme overrides
│   └── dashboard.css   # Dashboard-specific styles
│
└── js/
    ├── app.js          # Global nav, theme toggle, auth state
    ├── utils.js        # localStorage helpers, data seeding
    ├── planner.js      # AI scheduling algorithm
    ├── dashboard.js    # Chart rendering, streak logic
    ├── analytics.js    # Analytics computation
    └── chatbot.js      # AI study assistant widget
```

---

## 🧠 How the AI Scheduler Works

```
Input: Subjects + Difficulty + Daily Hours + Exam Dates
           ↓
   Calculate total available days per subject
           ↓
   Apply difficulty weights (Hard=45%, Medium=35%, Easy=20%)
           ↓
   Scale urgency as exam dates approach
           ↓
   Insert spaced repetition review slots at intervals
           ↓
   Distribute Pomodoro blocks (25 min focus + 5 min break)
           ↓
Output: Dynamic weekly timetable with daily sessions
```

---

## 🌙 Design System

The project uses a fully modular CSS custom properties system:

```css
:root {
    /* Brand Colors */
    --green-500: #10b981;
    --green-600: #059669;
    --green-700: #047857;

    /* Gradients */
    --gradient-hero:    linear-gradient(135deg, #f0fdf4, #ecfdf5, #e0f2fe);
    --gradient-primary: linear-gradient(135deg, #10b981, #047857);
    --gradient-cta:     linear-gradient(135deg, #064e3b, #065f46, #047857);

    /* Glassmorphism */
    --glass-bg:     rgba(255, 255, 255, 0.7);
    --glass-border: rgba(16, 185, 129, 0.15);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);

    /* Typography */
    --font-sans:    'Inter', sans-serif;
    --font-display: 'Space Grotesk', sans-serif;
}
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

---

## 📬 Contact

**Himanshu Rautela**
- GitHub: [@Himanshu-GenAI](https://github.com/Himanshu-GenAI)
- Repository: [EduPlanner-AI](https://github.com/Himanshu-GenAI/EduPlanner-AI)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ for <strong>InAmigos</strong> · Powered by AI &amp; Cognitive Science</p>
  <p>⭐ Star this repo if it helped you study smarter!</p>
</div>
