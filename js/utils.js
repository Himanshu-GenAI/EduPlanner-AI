/* ================================================================
   AI STUDY PLANNER — UTILITY FUNCTIONS & HELPERS
   localStorage Wrapper, Toast System, Date Formatters
   ================================================================ */

// LocalStorage Helper
const Storage = {
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to localStorage', e);
            return false;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage', e);
            return false;
        }
    },
    
    clear() {
        localStorage.clear();
    }
};

// Toast Notification System
function showToast(message, type = 'success', duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Choose icon based on type
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    } else if (type === 'error') {
        iconSvg = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    } else if (type === 'warning') {
        iconSvg = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
    } else {
        iconSvg = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    }
    
    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Setup close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));
    
    // Auto-remove
    const timer = setTimeout(() => {
        removeToast(toast);
    }, duration);
    
    function removeToast(el) {
        el.classList.add('removing');
        el.addEventListener('animationend', () => {
            el.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        });
        clearTimeout(timer);
    }
}

// Check Authentication Session
function getSessionUser() {
    return Storage.get('user_session');
}

function isLoggedIn() {
    return getSessionUser() !== null;
}

function requireAuth() {
    if (!isLoggedIn()) {
        showToast('Please login to access this page.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return false;
    }
    return true;
}

function logout() {
    Storage.remove('user_session');
    showToast('Logged out successfully!', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Unique ID Generator
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Date and Time Formatting Helpers
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatDayName(dateString) {
    const options = { weekday: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Print/PDF Export Helper
function printSchedule() {
    window.print();
}

// Global App State Simulation Init
// Seed some initial data if not present
(function seedInitialData() {
    if (!Storage.get('testimonials_list')) {
        const defaultTestimonials = [
            { id: 1, name: "Sarah Jenkins", institution: "Stanford University", text: "The AI Study Planner completely changed my academic performance. I went from a 3.1 to a 3.8 GPA in just one semester!", rating: 5, avatar: "SJ" },
            { id: 2, name: "David Chen", institution: "MIT", text: "It allocates study blocks beautifully around my exam dates and balances subjects by difficulty. Highly recommended!", rating: 5, avatar: "DC" },
            { id: 3, name: "Maria Rodriguez", institution: "NYU", text: "As a working student, time is gold. This planner ensures every study hour counts and tracks my streaks perfectly.", rating: 5, avatar: "MR" }
        ];
        Storage.set('testimonials_list', defaultTestimonials);
    }
    
    if (!Storage.get('registered_users')) {
        Storage.set('registered_users', [
            { name: "Demo Student", email: "student@example.com", password: "password123" }
        ]);
    }
})();
