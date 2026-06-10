/* ================================================================
   AI STUDY PLANNER — PERFORMANCE ANALYTICS CONTROLLER (ANALYTICS.JS)
   Calendar Heatmaps, HTML5 Canvas Donut Charts, Focus Index Metrics
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth check
    if (!requireAuth()) return;

    // 2. Load schedule data or defaults
    let scheduleData = Storage.get('active_schedule');
    let subjects = (scheduleData && scheduleData.subjects && scheduleData.subjects.length > 0) 
        ? scheduleData.subjects 
        : [
            { name: 'Calculus II', difficulty: 'Hard', color: '#059669', hours: 14 },
            { name: 'Physics Mechanics', difficulty: 'Medium', color: '#6366f1', hours: 10 },
            { name: 'Organic Chemistry', difficulty: 'Hard', color: '#f59e0b', hours: 8 }
        ];

    // 3. Initialize charts & heatmaps
    initHeatmap();
    initSubjectBars(subjects);
    initFocusGauge();
    initDonutChart(subjects);
});

// --- STREAK HEATMAP GRID BUILDER ---
function initHeatmap() {
    const grid = document.getElementById('heatmap-grid-element');
    const badge = document.getElementById('streak-days-badge');
    if (!grid) return;

    grid.innerHTML = '';
    
    // Seed 53 weeks * 7 days = 371 cells
    // Let's create a year matrix where weekends have less study, weekdays have more,
    // and the last 12 days are fully active (current streak!)
    const totalCells = 53 * 7;
    const currentStreak = 12;
    
    badge.textContent = `${currentStreak} Day Study Streak 🔥`;

    for (let i = 0; i < totalCells; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'heatmap-day';
        
        let level = 0;
        
        // Let's compute if this cell lies within the last 12 days (at the end of the year representation)
        if (i >= (totalCells - currentStreak)) {
            level = Math.floor(Math.random() * 3) + 2; // Level 2 to 4 (Green)
        } else {
            // Random historical levels
            const rand = Math.random();
            if (rand < 0.5) level = 0;
            else if (rand < 0.75) level = 1;
            else if (rand < 0.9) level = 2;
            else if (rand < 0.97) level = 3;
            else level = 4;
        }

        dayDiv.classList.add(`level-${level}`);
        
        // Add hover tooltip with mock dates
        const date = new Date();
        date.setDate(date.getDate() - (totalCells - i));
        const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        const hours = level === 0 ? '0 hrs' : level === 1 ? '1.5 hrs' : level === 2 ? '3 hrs' : level === 3 ? '4.5 hrs' : '6+ hrs';
        
        dayDiv.title = `${formattedDate}: studied ${hours}`;
        grid.appendChild(dayDiv);
    }
}

// --- SUBJECT WORKLOAD PROGRESS BARS ---
function initSubjectBars(subjects) {
    const container = document.getElementById('subject-bars-container');
    if (!container) return;

    container.innerHTML = '';

    subjects.forEach(sub => {
        // Target hours per week (Hard=8h, Medium=6h, Easy=4h)
        const target = sub.difficulty === 'Hard' ? 10 : sub.difficulty === 'Medium' ? 7 : 4;
        
        // Actual hours studied this week (Seeded as 60-95% of target)
        const completionRate = 0.65 + (Math.random() * 0.3); // 65% to 95%
        const actual = Math.round((target * completionRate) * 10) / 10;
        const pct = Math.round((actual / target) * 100);

        const group = document.createElement('div');
        group.className = 'subject-bar-group';
        group.innerHTML = `
            <div class="subject-bar-header">
                <span>${sub.name}</span>
                <span class="text-secondary">${actual} / ${target} hrs (${pct}%)</span>
            </div>
            <div class="subject-bar-outer">
                <div class="subject-bar-inner" style="width: ${pct}%; background: ${sub.color};"></div>
            </div>
        `;
        container.appendChild(group);
    });
}

// --- FOCUS QUALITY CIRCULAR GAUGE ---
function initFocusGauge() {
    const circle = document.getElementById('focus-gauge-fill');
    const text = document.getElementById('focus-gauge-value');
    
    if (circle && text) {
        const radius = 42;
        const circumference = 2 * Math.PI * radius; // ~263.893
        const score = 88; // Hardcoded high quality score
        
        circle.style.strokeDasharray = circumference;
        const offset = circumference - (score / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        text.textContent = `${score}%`;
    }
}

// --- HTML5 CANVAS DONUT CHART ---
function initDonutChart(subjects) {
    const canvas = document.getElementById('time-distribution-canvas');
    const legend = document.getElementById('donut-legend');
    if (!canvas || !legend) return;

    const ctx = canvas.getContext('2d');
    
    // Set display resolution (hi-dpi retina fix)
    const size = 220;
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Calculate total hours distribution
    // Hard get 3 parts, Medium 2 parts, Easy 1 part
    const data = subjects.map(sub => {
        const slots = sub.difficulty === 'Hard' ? 3 : sub.difficulty === 'Medium' ? 2 : 1;
        return { name: sub.name, value: slots, color: sub.color };
    });

    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Draw Donut
    let startAngle = -Math.PI / 2;
    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size / 2 - 10;
    const innerRadius = size / 2 - 40;

    data.forEach(slice => {
        const sliceAngle = (slice.value / total) * (2 * Math.PI);

        // Draw Outer Slice Arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
        ctx.closePath();

        ctx.fillStyle = slice.color;
        ctx.fill();

        startAngle += sliceAngle;
    });

    // Draw central blank hole for glassmorphism text
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 1, 0, 2 * Math.PI);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
    ctx.fill();

    // Populate Legend
    legend.innerHTML = '';
    data.forEach(slice => {
        const pct = Math.round((slice.value / total) * 100);
        const item = document.createElement('span');
        item.className = 'badge';
        item.style.border = `1.2px solid ${slice.color}`;
        item.style.color = slice.color;
        item.style.background = 'transparent';
        item.textContent = `${slice.name}: ${pct}%`;
        legend.appendChild(item);
    });
}
