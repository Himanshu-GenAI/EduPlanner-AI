/* ================================================================
   AI STUDY PLANNER — STUDENT DASHBOARD CONTROLLER (DASHBOARD.JS)
   Task CRUD Managers, Canvas Charts, Circular Progress Gauges, Seeding
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth check first
    if (!requireAuth()) return;
    
    // 2. Personalize welcome header
    const user = getSessionUser();
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle && user) {
        welcomeTitle.textContent = `Hello, ${user.name.split(' ')[0]}!`;
    }

    // 3. Initialize widgets
    initTasks();
    initWeeklyProgressChart();
    initDeadlines();
});

// --- TASK LIST WIDGET ---
function initTasks() {
    const taskListEl = document.getElementById('task-list-element');
    const taskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskBadge = document.getElementById('task-badge');
    
    let tasks = Storage.get('dashboard_tasks');
    
    // Seed default tasks if empty
    if (!tasks) {
        tasks = [
            { id: generateId(), text: 'Review Calculus integration sets', completed: false },
            { id: generateId(), text: 'Read Biology chapter 4 pages 120-135', completed: true },
            { id: generateId(), text: 'Outline essay for English Lit', completed: false }
        ];
        Storage.set('dashboard_tasks', tasks);
    }

    function renderTasks() {
        taskListEl.innerHTML = '';
        let remaining = 0;
        
        tasks.forEach(task => {
            if (!task.completed) remaining++;
            
            const item = document.createElement('div');
            item.className = `task-item ${task.completed ? 'completed' : ''}`;
            item.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                <span class="task-text">${task.text}</span>
                <button class="task-delete" data-id="${task.id}" title="Delete Task">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:16px;height:16px;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            `;
            taskListEl.appendChild(item);
        });

        // Update indicators
        taskBadge.textContent = `${remaining} remaining`;
        document.getElementById('stat-tasks').textContent = `${tasks.filter(t=>t.completed).length}/${tasks.length}`;
        
        // Update Goal Circle Gauge
        updateProgressGauge(tasks.length > 0 ? Math.round((tasks.filter(t=>t.completed).length / tasks.length) * 100) : 0);
        
        // Setup listeners
        setupTaskListeners();
    }

    function setupTaskListeners() {
        // Checkboxes
        taskListEl.querySelectorAll('.task-checkbox').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const task = tasks.find(t => t.id === id);
                if (task) {
                    task.completed = e.target.checked;
                    Storage.set('dashboard_tasks', tasks);
                    renderTasks();
                    showToast(task.completed ? 'Task completed! Keep it up!' : 'Task incomplete.', 'info', 1000);
                }
            });
        });

        // Delete Buttons
        taskListEl.querySelectorAll('.task-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                const id = button.getAttribute('data-id');
                tasks = tasks.filter(t => t.id !== id);
                Storage.set('dashboard_tasks', tasks);
                renderTasks();
                showToast('Task removed.', 'info', 1000);
            });
        });
    }

    addTaskBtn.addEventListener('click', addNewTask);
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addNewTask();
    });

    function addNewTask() {
        const text = taskInput.value.trim();
        if (!text) return;
        
        tasks.push({
            id: generateId(),
            text: text,
            completed: false
        });
        
        Storage.set('dashboard_tasks', tasks);
        taskInput.value = '';
        renderTasks();
        showToast('New task added!', 'success', 1000);
    }

    renderTasks();
}

// --- UPDATE CIRCULAR PROGRESS GAUGE ---
function updateProgressGauge(percentage) {
    const circle = document.getElementById('gauge-fill-circle');
    const text = document.getElementById('gauge-value-text');
    
    if (circle && text) {
        const radius = 34;
        const circumference = 2 * Math.PI * radius; // ~213.628
        
        circle.style.strokeDasharray = circumference;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        text.textContent = `${percentage}%`;
    }
}

// --- WEEKLY STUDY HOURS BAR CHART ---
function initWeeklyProgressChart() {
    const chartContainer = document.getElementById('weekly-hours-chart');
    if (!chartContainer) return;

    let weeklyHours = Storage.get('study_hours_weekly');
    if (!weeklyHours) {
        // Seed default hours: Mon, Tue, Wed, Thu, Fri, Sat, Sun
        weeklyHours = [3.2, 4.5, 2.0, 5.0, 3.8, 1.2, 0.5];
        Storage.set('study_hours_weekly', weeklyHours);
    }

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const maxVal = Math.max(...weeklyHours, 6); // Cap height relative to max or minimum 6 hrs
    
    chartContainer.innerHTML = '';
    
    // Calculate total hours today (seeded as Monday or current day, let's use Tue index 1)
    const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
    const chartIndex = todayIndex === 0 ? 6 : todayIndex - 1; // Map Sunday (0) to index 6, Mon to 0
    const hoursToday = weeklyHours[chartIndex] || 0;
    document.getElementById('stat-hours').textContent = `${hoursToday} hrs`;

    weeklyHours.forEach((hours, i) => {
        const pctHeight = Math.round((hours / maxVal) * 80); // max 80% container height
        const wrapper = document.createElement('div');
        wrapper.className = 'chart-bar-wrapper';
        wrapper.innerHTML = `
            <div class="chart-bar" style="height: ${pctHeight}%;">
                <div class="chart-tooltip">${hours} hrs</div>
            </div>
            <div class="chart-label">${days[i]}</div>
        `;
        chartContainer.appendChild(wrapper);
    });
}

// --- DEADLINES WIDGET ---
function initDeadlines() {
    const deadlinesList = document.getElementById('deadlines-list-element');
    if (!deadlinesList) return;

    let scheduleData = Storage.get('active_schedule');
    
    // If no schedule exists, default placeholder
    if (!scheduleData || !scheduleData.subjects || scheduleData.subjects.length === 0) {
        deadlinesList.innerHTML = `
            <div class="card-flat" style="padding:16px; text-align:center;">
                <p class="text-xs text-secondary" style="margin-bottom:12px;">No exams scheduled.</p>
                <a href="planner.html" class="btn btn-outline btn-sm">Setup Subjects & Exams</a>
            </div>
        `;
        return;
    }

    deadlinesList.innerHTML = '';
    
    // Sort subjects by exam date ascending
    const sorted = [...scheduleData.subjects].sort((a,b) => new Date(a.examDate) - new Date(b.examDate));

    sorted.slice(0, 3).forEach(sub => {
        const dateObj = new Date(sub.examDate);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('en-US', { month: 'short' });
        
        // Calculate days remaining
        const diffTime = dateObj - new Date();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const daysLabel = diffDays > 0 ? `${diffDays} days left` : diffDays === 0 ? 'Exam Today!' : 'Completed';
        
        const item = document.createElement('div');
        item.className = 'deadline-item';
        item.innerHTML = `
            <div class="deadline-date">
                <span>${month}</span>
                <span>${day}</span>
            </div>
            <div class="deadline-info">
                <div class="deadline-title">${sub.name} Final Exam</div>
                <div class="deadline-desc">${sub.difficulty} Difficulty • ${daysLabel}</div>
            </div>
        `;
        deadlinesList.appendChild(item);
    });
}
