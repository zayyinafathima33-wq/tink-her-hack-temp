// ===== SCREEN NAVIGATION =====
const screensWithNav = ['screen-dashboard', 'screen-map', 'screen-facilities', 'screen-emergency', 'screen-profile'];
const bottomNav = document.getElementById('bottomNav');
let currentScreen = 'screen-welcome';

function navigateTo(screenId) {
    if (screenId === currentScreen) return;

    const current = document.getElementById(currentScreen);
    const target = document.getElementById(screenId);

    if (!current || !target) return;

    // Fade out current
    current.classList.add('fade-out');

    setTimeout(() => {
        current.classList.remove('active', 'fade-out');
        current.style.display = 'none';

        // Show target
        target.style.display = 'flex';
        // Force reflow
        target.offsetHeight;
        target.classList.add('active');

        currentScreen = screenId;

        // Toggle bottom nav visibility
        if (screensWithNav.includes(screenId)) {
            bottomNav.classList.add('visible');
        } else {
            bottomNav.classList.remove('visible');
        }

        // Update active bottom nav item
        updateBottomNav(screenId);

        // Update status bar color
        updateStatusBar(screenId);
    }, 250);
}

function updateBottomNav(screenId) {
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.screen === screenId);
    });
}

function updateStatusBar(screenId) {
    const statusBar = document.querySelector('.status-bar');
    const darkScreens = ['screen-welcome', 'screen-thankyou', 'screen-dashboard'];
    if (darkScreens.includes(screenId)) {
        statusBar.style.color = 'white';
        statusBar.querySelectorAll('svg').forEach(s => s.setAttribute('fill', 'white'));
    } else {
        statusBar.style.color = 'white';
        statusBar.querySelectorAll('svg').forEach(s => s.setAttribute('fill', 'white'));
    }
}

// ===== EMERGENCY BUTTON (HOLD INTERACTION) =====
const emergencyBtn = document.getElementById('emergencyBtn');
let holdTimer = null;
let holdProgress = 0;

if (emergencyBtn) {
    emergencyBtn.addEventListener('mousedown', startHold);
    emergencyBtn.addEventListener('touchstart', startHold, { passive: true });
    emergencyBtn.addEventListener('mouseup', cancelHold);
    emergencyBtn.addEventListener('mouseleave', cancelHold);
    emergencyBtn.addEventListener('touchend', cancelHold);
    emergencyBtn.addEventListener('touchcancel', cancelHold);
}

function startHold(e) {
    emergencyBtn.classList.add('holding');
    holdProgress = 0;

    holdTimer = setInterval(() => {
        holdProgress += 100;
        if (holdProgress >= 3000) {
            clearInterval(holdTimer);
            emergencyBtn.classList.remove('holding');
            triggerEmergency();
        }
    }, 100);
}

function cancelHold() {
    if (holdTimer) {
        clearInterval(holdTimer);
        holdTimer = null;
    }
    holdProgress = 0;
    emergencyBtn.classList.remove('holding');
}

function triggerEmergency() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'emergency-activated-overlay';
    overlay.innerHTML = `
    <svg width="64" height="64" viewBox="0 0 24 24" fill="white" style="margin-bottom:20px;">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
    <h2>🚨 SOS ACTIVATED</h2>
    <p>Emergency contacts are being notified...</p>
    <p style="font-size:12px;opacity:0.6;margin-bottom:20px;">Location shared • Authorities alerted</p>
    <button onclick="dismissEmergency(this)">Dismiss</button>
  `;
    document.body.appendChild(overlay);
}

function dismissEmergency(btn) {
    const overlay = btn.closest('.emergency-activated-overlay');
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    setTimeout(() => overlay.remove(), 300);
}

// ===== MAP ZOOM =====
let mapScale = 1;

function mapZoom(direction) {
    const map = document.querySelector('.city-map');
    if (!map) return;

    mapScale += direction * 0.2;
    mapScale = Math.max(0.6, Math.min(2, mapScale));
    map.style.transform = `scale(${mapScale})`;
    map.style.transformOrigin = 'center center';
}

// ===== DIAL EMERGENCY =====
function dialEmergency(number) {
    // Visual feedback
    const btn = event.currentTarget;
    btn.style.transform = 'scale(0.92)';
    setTimeout(() => {
        btn.style.transform = '';
    }, 200);

    // Show calling overlay
    const overlay = document.createElement('div');
    overlay.className = 'emergency-activated-overlay';
    overlay.style.background = 'rgba(29,53,87,0.97)';
    overlay.innerHTML = `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-bottom:16px;">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
    <h2>Calling ${number}</h2>
    <p>Connecting to emergency services...</p>
    <button onclick="dismissEmergency(this)" style="margin-top:20px;">End Call</button>
  `;
    document.body.appendChild(overlay);
}

// ===== UPDATE TIME DISPLAY =====
function updateTime() {
    const timeEl = document.querySelector('.time-display');
    if (timeEl) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeEl.textContent = `${hours}:${minutes}`;
    }
}

updateTime();
setInterval(updateTime, 60000);

// ===== ANIMATE STAT BARS ON DASHBOARD LOAD =====
function animateStatBars() {
    document.querySelectorAll('.stat-bar').forEach(bar => {
        const target = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = target;
        }, 300);
    });
}

// Observe when dashboard becomes visible
const dashboardObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'screen-dashboard' && mutation.target.classList.contains('active')) {
            animateStatBars();
        }
    });
});

const dashboard = document.getElementById('screen-dashboard');
if (dashboard) {
    dashboardObserver.observe(dashboard, { attributes: true, attributeFilter: ['class'] });
}

// ===== WELCOME SCREEN ENTRANCE ANIMATION =====
window.addEventListener('DOMContentLoaded', () => {
    const welcomeContent = document.querySelector('.welcome-content');
    if (welcomeContent) {
        welcomeContent.style.opacity = '0';
        welcomeContent.style.transform = 'translateY(30px)';
        welcomeContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        setTimeout(() => {
            welcomeContent.style.opacity = '1';
            welcomeContent.style.transform = 'translateY(0)';
        }, 400);
    }
});
