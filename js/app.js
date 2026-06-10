/* ================================================================
   AI STUDY PLANNER — GLOBAL SITE CONTROLLER (APP.JS)
   Theme Toggle, Responsive Navbar, Scroll Effects, Navigation States
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbar();
    initScrollReveal();
    updateAuthUI();
});

// Theme Management
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    
    // Check saved theme or system theme
    const savedTheme = Storage.get('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        Storage.set('theme', newTheme);
        showToast(`Switched to ${newTheme} mode!`, 'info', 1500);
    });
}

// Navbar & Drawer Controller
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Sticky Nav on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
    
    // Toggle Mobile Drawer
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('open');
        });
        
        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });
    }

    // Active Link Highlight
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
    
    const navLinks = document.querySelectorAll('.nav-menu a, .sidebar-link');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// User-Session UI Synchronizer
function updateAuthUI() {
    const authActions = document.getElementById('nav-auth-actions');
    const user = getSessionUser();
    
    if (authActions) {
        if (user) {
            // Logged in
            authActions.innerHTML = `
                <a href="dashboard.html" class="btn btn-sm btn-outline">Dashboard</a>
                <button id="logout-btn" class="btn btn-sm btn-ghost">Log Out</button>
            `;
            
            const logoutBtn = document.getElementById('logout-btn');
            logoutBtn?.addEventListener('click', logout);
        } else {
            // Guest mode
            authActions.innerHTML = `
                <a href="login.html" class="btn btn-sm btn-ghost">Log In</a>
                <a href="signup.html" class="btn btn-sm btn-primary">Sign Up</a>
            `;
        }
    }

    // Also update Dashboard sidebar profile if we are in app pages
    const sidebarProfile = document.querySelector('.sidebar-profile');
    if (sidebarProfile && user) {
        sidebarProfile.innerHTML = `
            <div class="avatar badge-green" style="background: var(--green-600)">${user.name.split(' ').map(n=>n[0]).join('').toUpperCase()}</div>
            <div class="info">
                <div class="name">${user.name}</div>
                <div class="email">${user.email}</div>
            </div>
            <button id="sidebar-logout" class="task-delete" style="margin-left: auto;" title="Log Out">
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:18px;height:18px;"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
        `;
        document.getElementById('sidebar-logout')?.addEventListener('click', logout);
    }
}

// Scroll Reveal Observer
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (reveals.length === 0) return;
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15
    });
    
    reveals.forEach(el => revealObserver.observe(el));
}
