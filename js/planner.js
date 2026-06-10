/* ================================================================
   AI STUDY PLANNER — SCHEDULER ALGORITHM & CALENDAR VIEW (PLANNER.JS)
   Subject Managers, Difficulty Weights, Timetable Allocations
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth check
    if (!requireAuth()) return;

    // 2. Setup slider listener
    const slider = document.getElementById('study-budget-slider');
    const display = document.getElementById('budget-value-display');
    if (slider && display) {
        slider.addEventListener('input', (e) => {
            display.textContent = `${e.target.value} hrs`;
        });
    }

    // 3. Initialize scheduler data & events
    initPlanner();
});

function initPlanner() {
    const addSubjectForm = document.getElementById('add-subject-form');
    const subjectListEl = document.getElementById('subject-list-element');
    const generateBtn = document.getElementById('generate-schedule-btn');
    const printBtn = document.getElementById('pdf-download-btn');
    
    // Load existing planner parameters or seed default ones
    let scheduleData = Storage.get('active_schedule');
    
    if (!scheduleData) {
        const defaultExams = [
            { name: 'Calculus II', difficulty: 'Hard', examDate: getFutureDate(10), color: '#059669' },
            { name: 'Physics Mechanics', difficulty: 'Medium', examDate: getFutureDate(18), color: '#6366f1' },
            { name: 'Organic Chemistry', difficulty: 'Hard', examDate: getFutureDate(25), color: '#f59e0b' }
        ];
        
        scheduleData = {
            budgetHours: 4,
            preferredTime: 'morning',
            subjects: defaultExams,
            calendar: generateCalendarSchedule(defaultExams, 4, 'morning')
        };
        
        Storage.set('active_schedule', scheduleData);
    }

    // Populate UI inputs with saved state
    if (scheduleData) {
        document.getElementById('study-budget-slider').value = scheduleData.budgetHours;
        document.getElementById('budget-value-display').textContent = `${scheduleData.budgetHours} hrs`;
        document.getElementById('study-pref-time').value = scheduleData.preferredTime;
    }

    function renderSubjects() {
        subjectListEl.innerHTML = '';
        if (scheduleData.subjects.length === 0) {
            subjectListEl.innerHTML = `<p class="text-xs text-tertiary">No subjects added yet.</p>`;
            return;
        }

        scheduleData.subjects.forEach((sub, index) => {
            const item = document.createElement('div');
            item.className = 'subject-item';
            item.innerHTML = `
                <div class="subject-info">
                    <span class="subject-color" style="background: ${sub.color}"></span>
                    <div>
                        <div class="subject-name">${sub.name}</div>
                        <div class="subject-hours">Exam: ${formatDate(sub.examDate)} • ${sub.difficulty}</div>
                    </div>
                </div>
                <button class="task-delete remove-subject-btn" data-index="${index}" title="Remove Subject">&times;</button>
            `;
            subjectListEl.appendChild(item);
        });

        // Listeners
        subjectListEl.querySelectorAll('.remove-subject-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                scheduleData.subjects.splice(index, 1);
                Storage.set('active_schedule', scheduleData);
                renderSubjects();
                showToast('Subject removed.', 'info', 1000);
            });
        });
    }

    // Form submission
    addSubjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('sub-name').value.trim();
        const difficulty = document.getElementById('sub-difficulty').value;
        const examDate = document.getElementById('sub-exam-date').value;
        
        // Subject limit check (Free vs Pro simulated limit)
        if (scheduleData.subjects.length >= 3) {
            showToast('Free Tier is limited to 3 subjects. Upgrade to Pro for unlimited planning!', 'warning', 4000);
            return;
        }

        // Generate unique color
        const colors = ['#059669', '#6366f1', '#f59e0b', '#0ea5e9', '#f43f5e', '#a855f7'];
        const randomColor = colors[scheduleData.subjects.length % colors.length];

        const newSub = { name, difficulty, examDate, color: randomColor };
        scheduleData.subjects.push(newSub);
        Storage.set('active_schedule', scheduleData);
        
        addSubjectForm.reset();
        renderSubjects();
        showToast('Subject added successfully!', 'success', 1000);
    });

    // Generate Timetable Schedule
    generateBtn.addEventListener('click', () => {
        if (scheduleData.subjects.length === 0) {
            showToast('Please add at least one subject to generate a plan.', 'warning');
            return;
        }

        const budget = parseInt(document.getElementById('study-budget-slider').value);
        const prefTime = document.getElementById('study-pref-time').value;

        scheduleData.budgetHours = budget;
        scheduleData.preferredTime = prefTime;
        
        // Generate algorithm
        scheduleData.calendar = generateCalendarSchedule(scheduleData.subjects, budget, prefTime);
        Storage.set('active_schedule', scheduleData);
        
        renderCalendarGrid(scheduleData.calendar);
        showToast('AI Timetable Generated Successfully!', 'success');
        
        // Update weekly progress in dashboard as well to fit budget
        const seededWeeklyProgress = Array(7).fill(0).map(() => Math.round((budget * (0.6 + Math.random() * 0.4)) * 10) / 10);
        Storage.set('study_hours_weekly', seededWeeklyProgress);
    });

    // PDF Print Export
    printBtn.addEventListener('click', printSchedule);

    // Initial render
    renderSubjects();
    renderCalendarGrid(scheduleData.calendar);
}

// Helper: generate mock dates
function getFutureDate(daysInFuture) {
    const today = new Date();
    today.setDate(today.getDate() + daysInFuture);
    return today.toISOString().split('T')[0];
}

// --- CALENDAR GRID RENDERER ---
function renderCalendarGrid(calendar) {
    const gridEl = document.getElementById('calendar-grid-element');
    if (!gridEl) return;
    
    gridEl.innerHTML = '';

    // Day Headers
    const headers = ['Time', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    headers.forEach(h => {
        const cell = document.createElement('div');
        cell.className = 'calendar-header-cell';
        cell.textContent = h;
        gridEl.appendChild(cell);
    });

    // Time slots and subject matrix
    const timeSlots = [
        { label: 'Session 1', hours: '09:00 - 10:30' },
        { label: 'Session 2', hours: '11:00 - 12:30' },
        { label: 'Session 3', hours: '14:00 - 15:30' },
        { label: 'Session 4', hours: '16:00 - 17:30' }
    ];

    timeSlots.forEach((slot, slotIndex) => {
        // Time Label Column
        const timeCell = document.createElement('div');
        timeCell.className = 'calendar-time-cell';
        timeCell.innerHTML = `
            <div>
                <div style="font-weight:700;font-size:0.8rem;">${slot.label}</div>
                <div style="font-size:0.68rem;opacity:0.85;">${slot.hours}</div>
            </div>
        `;
        gridEl.appendChild(timeCell);

        // Seven days row cells
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            
            const slotData = calendar[dayIndex][slotIndex];
            if (slotData && slotData.type === 'study') {
                cell.innerHTML = `
                    <div class="calendar-slot-card" style="background: ${slotData.color}">
                        <div class="calendar-slot-title">${slotData.subject}</div>
                        <div class="calendar-slot-time">${slotData.details}</div>
                    </div>
                `;
            } else if (slotData && slotData.type === 'break') {
                cell.innerHTML = `
                    <div class="calendar-slot-card" style="background: var(--gray-200); color: var(--text-secondary); border: 1.5px dashed var(--border-color); box-shadow:none;">
                        <div class="calendar-slot-title" style="font-weight:600;">Break</div>
                        <div class="calendar-slot-time">15 min stretch</div>
                    </div>
                `;
            }
            gridEl.appendChild(cell);
        }
    });
}

// --- CORE SCHEDULING ALGORITHM ---
function generateCalendarSchedule(subjects, dailyHours, preferredTime) {
    // Determine slots per day based on study hours budget
    // Assuming 1 slot = 1.5 study hours + 15 min break
    const slotsCount = dailyHours <= 2 ? 1 : dailyHours <= 4 ? 2 : dailyHours <= 6 ? 3 : 4;
    
    // Build weight matrices for subjects based on difficulty
    // Hard = 3, Medium = 2, Easy = 1
    const subjectList = subjects.map(sub => {
        let weight = sub.difficulty === 'Hard' ? 3 : sub.difficulty === 'Medium' ? 2 : 1;
        
        // Days remaining multiplier (Priority for close exams)
        const daysLeft = Math.ceil((new Date(sub.examDate) - new Date()) / (1000*60*60*24));
        if (daysLeft > 0 && daysLeft <= 7) {
            weight += 2; // Extra heavy priority
        } else if (daysLeft > 0 && daysLeft <= 14) {
            weight += 1;
        }

        return { ...sub, currentWeight: weight };
    });

    const calendar = []; // 7 columns (days), each containing slotsCount slots
    let lastStudiedSubject = null;

    for (let day = 0; day < 7; day++) {
        const daySlots = [];
        
        for (let slot = 0; slot < 4; slot++) {
            // If slot index exceeds active slots count, leave blank or mark as break
            if (slot >= slotsCount) {
                daySlots.push({ type: 'empty' });
                continue;
            }

            // Alternating slot with break
            if (slot > 0 && slot % 2 === 1 && dailyHours < (slot * 1.5)) {
                daySlots.push({ type: 'break' });
                continue;
            }

            // Pick subject based on weight distributions and spaced repetition
            const chosenSubject = selectWeightedSubject(subjectList, lastStudiedSubject);
            
            if (chosenSubject) {
                daySlots.push({
                    type: 'study',
                    subject: chosenSubject.name,
                    color: chosenSubject.color,
                    details: chosenSubject.difficulty === 'Hard' ? 'Active recall focus' : 'Summary sheet review'
                });
                lastStudiedSubject = chosenSubject.name;
            } else {
                daySlots.push({ type: 'empty' });
            }
        }
        calendar.push(daySlots);
    }
    return calendar;
}

// Weighted selection with basic repetition check
function selectWeightedSubject(subjects, lastStudied) {
    if (subjects.length === 0) return null;
    if (subjects.length === 1) return subjects[0];

    // Filter weights, reducing lastStudied probability
    const pool = [];
    subjects.forEach(sub => {
        let weight = sub.currentWeight;
        if (sub.name === lastStudied) {
            weight = Math.max(1, Math.round(weight * 0.3)); // reduce chance of back-to-back blocks
        }
        for (let i = 0; i < weight; i++) {
            pool.push(sub);
        }
    });

    if (pool.length === 0) return subjects[0];
    return pool[Math.floor(Math.random() * pool.length)];
}
